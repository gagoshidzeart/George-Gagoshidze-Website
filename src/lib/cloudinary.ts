const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'dwzj5y97z'

export function cloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string } = {}
) {
  const cloud = CLOUD_NAME
  const { width, height, crop = 'fit' } = options

  const transforms = ['f_auto', 'q_auto']
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  if (width && height) transforms.push(`c_${crop}`)

  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms.join(',')}/${publicId}`
}
