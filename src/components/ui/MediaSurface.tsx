interface MediaSurfaceProps {
  src: string
  alt: string
  kind?: 'video' | 'image'
  eyebrow?: string
  title?: string
  muted?: boolean
}

export function MediaSurface({
  src,
  alt,
  kind = 'video',
  eyebrow,
  title,
  muted = true,
}: MediaSurfaceProps) {
  return (
    <div className="media-surface">
      {kind === 'video' ? (
        <video className="media-surface__asset" src={src} autoPlay loop muted={muted} playsInline />
      ) : (
        <img className="media-surface__asset" src={src} alt={alt} />
      )}

      {(eyebrow || title) && (
        <div className="media-surface__overlay">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          {title ? <h3>{title}</h3> : null}
        </div>
      )}
    </div>
  )
}
