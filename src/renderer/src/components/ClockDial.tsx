type ClockDialProps = {
  totalSeconds: number
  remainingSeconds: number
}

const PIE_RADIUS = 130
const THIN_RADIUS = PIE_RADIUS / 2
const CIRCUMFERENCE = 2 * Math.PI * THIN_RADIUS

export default function ClockDial({ totalSeconds, remainingSeconds }: ClockDialProps) {
  const elapsedFraction =
    totalSeconds <= 0 ? 0 : Math.max(0, Math.min(1, 1 - remainingSeconds / totalSeconds))

  const handAngle = elapsedFraction * 360

  const sliceLength = elapsedFraction * CIRCUMFERENCE

  return (
    <svg viewBox="0 0 400 400">
      {/* Base circle */}
      <circle r={PIE_RADIUS} cx="200" cy="200" fill="pink" />

      {/* Slice */}
      <circle
        r={THIN_RADIUS}
        cx="200"
        cy="200"
        fill="none"
        stroke="deeppink"
        strokeWidth={PIE_RADIUS}
        transform="rotate(-90 200 200)"
        strokeDasharray={`${sliceLength} ${CIRCUMFERENCE}`}
      />

      <g transform={`rotate(${handAngle} 200 200)`}>
        <line
          x1="200"
          y1="200"
          x2="200"
          y2="70"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
