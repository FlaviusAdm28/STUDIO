import { images, type ImageId } from '@/lib/images'

type Props = {
  id: ImageId
  /** The monochrome derived from the same colour frame (the studio's default state). */
  mono?: boolean
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}

/*
  A static <picture>: AVIF first, JPEG fallback, pre-generated widths, explicit intrinsic size so the
  layout never shifts. No runtime optimiser — the derivatives are already the right files.
*/
export function Picture({ id, mono = false, alt, sizes, priority = false, className }: Props) {
  const image = images[id]
  const name = mono ? `${id}-mono` : id
  const set = (ext: 'avif' | 'jpg') => image.widths.map((w) => `/media/v5/${name}-${w}.${ext} ${w}w`).join(', ')

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <img
        src={`/media/v5/${name}-960.jpg`}
        srcSet={set('jpg')}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  )
}
