/**
 * Seeds the 7 collections into Supabase.
 * Run with:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-collections.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf-8')
  for (const line of env.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) process.env[match[1].trim()] = match[2].trim()
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const collections = [
  { handle: 'latest-works', title: 'Latest Works', sort_order: 1 },
  { handle: 'ukraine-is-georgia-is-ukraine', title: 'Ukraine is Georgia is Ukraine', sort_order: 2 },
  { handle: '2019-2021', title: '2019–2021', sort_order: 3 },
  { handle: '2016-2018', title: '2016–2018', sort_order: 4 },
  { handle: '2014-2015', title: '2014–2015', sort_order: 5 },
  { handle: '2012-2013', title: '2012–2013', sort_order: 6 },
  { handle: '2010-2011', title: '2010–2011', sort_order: 7 },
]

async function main() {
  for (const col of collections) {
    const { data: existing } = await supabase
      .from('collections')
      .select('id')
      .eq('handle', col.handle)
      .single()

    if (existing) {
      console.log(`Skipping "${col.title}" — already exists.`)
      continue
    }

    const { error } = await supabase.from('collections').insert(col)
    if (error) {
      console.error(`Failed to insert "${col.title}": ${error.message}`)
    } else {
      console.log(`Created: ${col.title}`)
    }
  }
  console.log('Done.')
}

main().catch(console.error)
