interface Props {
  progress: number
  strokeColor: string
  size: number
  strokeWidth: number
  className?: string
}

export default function CircularProgress({ progress, className, strokeColor, size, strokeWidth }: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <circle className='stroke-green-950' strokeWidth={strokeWidth} fill='none' cx={size / 2} cy={size / 2} r={radius} />
      <circle
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap='round'
        fill='none'
        cx={size / 2}
        cy={size / 2}
        r={radius}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}
