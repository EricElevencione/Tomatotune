type ClockDialProps = {
  totalSeconds: number
  remainingSeconds: number
}

const PIE_RADIUS = 130
const THIN_RADIUS = PIE_RADIUS / 2
const CIRCUMFERENCE = 2 * Math.PI * THIN_RADIUS
const CENTER = 200

export default function ClockDial({ totalSeconds, remainingSeconds }: ClockDialProps) {
  const elapsedFraction =
    totalSeconds <= 0 ? 0 : Math.max(0, Math.min(1, 1 - remainingSeconds / totalSeconds))

  const handAngle = elapsedFraction * 360

  const sliceLength = elapsedFraction * CIRCUMFERENCE

  return (
    <svg viewBox="0 0 400 400">
      {/* Outside lines */}
      {Array.from({ length: 60 }, (_, i) => (
        <line
          key={i}
          x1="200"
          y1="25"
          x2="200"
          stroke="green"
          transform={`rotate(${i * (360 / 60)} 200 200)`}
          y2={i % 5 === 0 ? 55 : 40}
        />
      ))}

      {/* Base circle */}
      <circle r={PIE_RADIUS} cx={CENTER} cy={CENTER} fill="pink" />

      {/* Tick */}
      <line
        x1="200"
        y1="25"
        x2="200"
        y2="45"
        stroke="green"
        strokeWidth={2}
        transform="rotate(30 200 200)"
      />

      {/* Slice */}
      <circle
        r={THIN_RADIUS}
        cx={CENTER}
        cy={CENTER}
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
      <circle r="18" cx={CENTER} cy={CENTER} fill="white" />
    </svg>
  )
}
