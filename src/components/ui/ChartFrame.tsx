import type { PropsWithChildren, ReactNode } from 'react'

interface ChartFrameProps extends PropsWithChildren {
  title: string
  kicker?: string
  aside?: ReactNode
}

export function ChartFrame({ title, kicker, aside, children }: ChartFrameProps) {
  return (
    <section className="panel chart-frame">
      <header className="section-heading">
        <div>
          {kicker ? <span className="eyebrow">{kicker}</span> : null}
          <h2>{title}</h2>
        </div>
        {aside}
      </header>
      <div className="chart-frame__body">{children}</div>
    </section>
  )
}
