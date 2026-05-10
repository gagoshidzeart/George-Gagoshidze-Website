/**
 * Migration script: reads products_export.csv, uploads local images to Cloudinary,
 * and inserts artwork + image data into Supabase.
 *
 * Run with:
 *   npx ts-node --project tsconfig.scripts.json scripts/migrate.ts
 *
 * Prerequisites:
 *   - Fill in SUPABASE_SERVICE_ROLE_KEY and CLOUDINARY_API_SECRET in .env.local
 *   - Run the Supabase SQL schema to create tables
 *   - Seed collections first (or let this script skip the collection_id lookup)
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import { parse } from 'csv-parse/sync'
import { v2 as cloudinary } from 'cloudinary'
import { createClient } from '@supabase/supabase-js'

// Load env vars from .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf-8')
  for (const line of env.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      process.env[match[1].trim()] = match[2].trim()
    }
  }
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Path to local images organised as paintings/<handle>/image.jpg
const PAINTINGS_DIR = path.join(__dirname, '..', 'paintings')
const CSV_PATH = path.join(__dirname, '..', 'products_export.csv')

type CsvRow = {
  Handle: string
  Title: string
  'Body (HTML)': string
  'Variant Price': string
  'Image Src': string
  'Image Position': string
  'Image Alt Text': string
  'Dimensions (product.metafields.custom.dimensions)': string
  'Project (product.metafields.custom.project)': string
  'Year (product.metafields.custom.year)': string
  'Painting medium (product.metafields.shopify.painting-medium)': string
  Status: string
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function parseYear(s: string): number | null {
  const m = s.match(/\b(19|20)\d{2}\b/)
  return m ? parseInt(m[0]) : null
}

async function uploadToCloudinary(localPath: string, publicId: string): Promise<{ public_id: string; secure_url: string } | null> {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      overwrite: false,
      use_filename: false,
    })
    return { public_id: result.public_id, secure_url: result.secure_url }
  } catch (err: any) {
    if (err?.http_code === 400 && err?.message?.includes('already exists')) {
      // Already uploaded — fetch the existing resource
      const info = await cloudinary.api.resource(publicId)
      return { public_id: info.public_id, secure_url: info.secure_url }
    }
    console.error(`  Cloudinary error for ${publicId}:`, err?.message ?? err)
    return null
  }
}

async function getCollectionId(projectHandle: string): Promise<string | null> {
  if (!projectHandle) return null
  const { data } = await supabase
    .from('collections')
    .select('id')
    .eq('handle', projectHandle.toLowerCase().replace(/\s+/g, '-'))
    .single()
  return data?.id ?? null
}

async function main() {
  console.log('Reading CSV...')
  const raw = fs.readFileSync(CSV_PATH, 'utf-8')
  const rows: CsvRow[] = parse(raw, { columns: true, skip_empty_lines: true, relax_quotes: true })

  // Group rows by handle (first occurrence = master data, all = images)
  const grouped = new Map<string, CsvRow[]>()
  for (const row of rows) {
    const h = row.Handle
    if (!grouped.has(h)) grouped.set(h, [])
    grouped.get(h)!.push(row)
  }

  console.log(`Found ${grouped.size} artworks to migrate.\n`)

  let idx = 0
  for (const [handle, artworkRows] of grouped) {
    idx++
    const master = artworkRows[0]
    const title = master.Title
    process.stdout.write(`[${idx}/${grouped.size}] ${handle} — `)

    // Check if already in DB
    const { data: existing } = await supabase
      .from('artworks')
      .select('id')
      .eq('handle', handle)
      .single()

    let artworkId: string

    if (existing) {
      process.stdout.write(`already exists (id: ${existing.id}), skipping artwork insert.\n`)
      artworkId = existing.id
    } else {
      // Parse fields
      const price = parseFloat(master['Variant Price']) || null
      const dimensions = master['Dimensions (product.metafields.custom.dimensions)'] || null
      const yearRaw = master['Year (product.metafields.custom.year)'] || ''
      const year = yearRaw ? parseInt(yearRaw) : null
      const medium = master['Painting medium (product.metafields.shopify.painting-medium)'] || null
      const projectRaw = master['Project (product.metafields.custom.project)'] || ''
      const descriptionRaw = master['Body (HTML)']
      const description = descriptionRaw ? stripHtml(descriptionRaw) : null

      const collectionId = await getCollectionId(projectRaw)

      // Determine year-based collection if no project
      let finalCollectionId = collectionId
      if (!finalCollectionId && year) {
        const yearHandle = yearToCollectionHandle(year)
        if (yearHandle) finalCollectionId = await getCollectionId(yearHandle)
      }

      const { data: inserted, error } = await supabase
        .from('artworks')
        .insert({
          handle,
          title,
          year,
          dimensions,
          medium,
          price,
          sold: false,
          collection_id: finalCollectionId,
          description,
          featured: false,
          sort_order: idx,
        })
        .select('id')
        .single()

      if (error || !inserted) {
        console.error(`  ERROR inserting artwork: ${error?.message}`)
        continue
      }

      artworkId = inserted.id
      process.stdout.write(`inserted.\n`)
    }

    // Upload images
    const localDir = path.join(PAINTINGS_DIR, handle)
    if (fs.existsSync(localDir)) {
      const files = fs.readdirSync(localDir)
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort()

      // Check if images already uploaded for this artwork
      const { data: existingImages } = await supabase
        .from('artwork_images')
        .select('id')
        .eq('artwork_id', artworkId)

      if (existingImages && existingImages.length > 0) {
        console.log(`  Images already exist, skipping.`)
        continue
      }

      for (let i = 0; i < files.length; i++) {
        const filePath = path.join(localDir, files[i])
        const publicId = `gagoshidze/artworks/${handle}/${i + 1}`
        process.stdout.write(`  Uploading image ${i + 1}/${files.length}...`)

        const result = await uploadToCloudinary(filePath, publicId)
        if (!result) {
          console.log(' FAILED')
          continue
        }

        await supabase.from('artwork_images').insert({
          artwork_id: artworkId,
          cloudinary_public_id: result.public_id,
          cloudinary_url: result.secure_url,
          position: i,
          alt_text: `${title} by George Gagoshidze`,
        })

        console.log(' done')
      }
    } else {
      console.log(`  No local images folder found at ${localDir}`)
    }
  }

  console.log('\nMigration complete.')
}

function yearToCollectionHandle(year: number): string | null {
  if (year >= 2025) return 'latest-works'
  if (year >= 2022 && year <= 2024) return 'latest-works'
  if (year >= 2019 && year <= 2021) return '2019-2021'
  if (year >= 2016 && year <= 2018) return '2016-2018'
  if (year >= 2014 && year <= 2015) return '2014-2015'
  if (year >= 2012 && year <= 2013) return '2012-2013'
  if (year >= 2010 && year <= 2011) return '2010-2011'
  return null
}

main().catch(console.error)
