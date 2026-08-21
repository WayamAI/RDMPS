import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { EASE, FONT_MONO } from './shared'

export default function PhotoPlate({
  src,
  alt,
  caption,
  side = 'left',
  aspect = 'aspect-[16/10]',
  chips,
}: {
  src: string
  alt: string
  caption: string
  side?: 'left' | 'right'
  aspect?: string
  chips?: string[]
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 120, damping: 18 })
  const sy = useSpring(my, { stiffness: 120, damping: 18 })
  const tx = useTransform(sx, [0, 1], [-8, 8])
  const ty = useTransform(sy, [0, 1], [-8, 8])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = frameRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  const hiddenClip = side === 'left' ? 'inset(0 100% 0 0 round 16px)' : 'inset(0 0 0 100% round 16px)'

  return (
    <motion.figure
      initial={{ clipPath: hiddenClip, opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0 0% 0 0% round 16px)', opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative m-0"
    >
      <div
        ref={frameRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`relative ${aspect} overflow-hidden rounded-2xl border border-stroke-default bg-container shadow-xl`}
      >
        <motion.img
          src={src}
          alt={alt}
          style={{ x: tx, y: ty, scale: 1.06 }}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        />
        {/* caption strip, bottom-left */}
        <figcaption
          className={`${FONT_MONO} absolute bottom-3 left-3 max-w-[80%] rounded-md bg-container/85 border border-stroke-default px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] text-text-primary backdrop-blur-md`}
        >
          {caption}
        </figcaption>
        {chips && chips.length > 0 && (
          <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
            {chips.map((c) => (
              <span
                key={c}
                className={`${FONT_MONO} rounded-full border border-stroke-default bg-container/90 px-2.5 py-1 text-[10px] text-text-primary backdrop-blur-md`}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.figure>
  )
}
