import { media } from '@/lib/media'

type Props = {
  /** Base path of the derivative, as in `content/v5.ts`. */
  src: string
  alt: string
  sizes: string
  /** The monochrome derived from the same colour frame. */
  mono?: boolean
  priority?: boolean
  className?: string
}

/*
  A static <picture>: AVIF first, JPEG fallback, the pre-generated widths and the intrinsic size.
  No runtime optimiser — the derivatives are already the right files.
*/
export function Picture({ src, alt, sizes, mono = false, priority = false, className }: Props) {
  const image = media[src]
  if (!image) throw new Error(`No derivatives listed for ${src} (src/lib/media.ts)`)
  const base = mono ? `${src}-mono` : src
  const set = (ext: 'avif' | 'jpg') => image.widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ')
  const fallback = image.widths[Math.min(1, image.widths.length - 1)]

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <img
        src={`${base}-${fallback}.jpg`}
        srcSet={set('jpg')}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
    </picture>
  )
}
