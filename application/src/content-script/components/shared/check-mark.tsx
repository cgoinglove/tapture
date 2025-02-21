interface CheckmarkProps {
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
}

export default function Checkmark({ size = 100, strokeWidth = 2, color = 'currentColor', className = '' }: CheckmarkProps) {
  return (
    <svg width={size} height={size} viewBox='0 0 100 100' className={className}>
      <title>Animated Checkmark</title>
      <circle
        cx='50'
        cy='50'
        r='40'
        stroke={color}
        className='stroke-dasharray-circle animate-draw-circle'
        style={{
          strokeWidth,
          strokeLinecap: 'round',
          fill: 'transparent',
        }}
      />
      <path
        d='M30 50L45 65L70 35'
        stroke={color}
        className='stroke-dasharray-path animate-draw-path'
        style={{
          strokeWidth,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          fill: 'transparent',
        }}
      />
    </svg>
  )
}
