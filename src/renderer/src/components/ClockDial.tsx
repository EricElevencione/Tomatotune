type ClockDialProps = {
  totalSeconds: number
  remainingSeconds: number
}

const PIE_RADIUS = 130
const THIN_RADIUS = PIE_RADIUS / 2
const CIRCUMFERENCE = 2 * Math.PI * THIN_RADIUS
const CENTER = 200
const HAND_LENGTH = 128 // Sits cleanly inside the 130px radius circle

export default function ClockDial({ totalSeconds, remainingSeconds }: ClockDialProps) {
  const elapsedFraction =
    totalSeconds <= 0 ? 0 : Math.max(0, Math.min(1, 1 - remainingSeconds / totalSeconds))

  const handAngle = elapsedFraction * 360
  const sliceLength = elapsedFraction * CIRCUMFERENCE

  // Exact math calculation for the hand tip:
  // 0 degrees = 12 o'clock (-90 in standard math coordinates)
  const handRad = ((handAngle - 90) * Math.PI) / 180
  const handX = CENTER + HAND_LENGTH * Math.cos(handRad)
  const handY = CENTER + HAND_LENGTH * Math.sin(handRad)

  return (
    <div className="relative flex aspect-square w-full max-w-[280px] items-center justify-center">
      <svg viewBox="0 0 400 400" className="h-full w-full drop-shadow-sm select-none">
        <defs>
          <filter id="dialShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.35" />
          </filter>
          <filter id="knobShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 60 outer radial ticks */}
        {Array.from({ length: 60 }, (_, i) => {
          const isMajor = i % 5 === 0
          return (
            <line
              key={i}
              x1={CENTER}
              y1={25}
              x2={CENTER}
              y2={isMajor ? 52 : 40}
              stroke={isMajor ? '#9ca3af' : '#374151'}
              strokeWidth={isMajor ? 2.5 : 1.5}
              strokeLinecap="round"
              transform={`rotate(${i * 6} ${CENTER} ${CENTER})`}
            />
          )
        })}

        {/* Base peach circle */}
        <circle cx={CENTER} cy={CENTER} r={PIE_RADIUS} fill="#fadcd5" filter="url(#dialShadow)" />

        {/* Rotating coral red slice */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={THIN_RADIUS}
          fill="none"
          stroke="#e26d6d"
          strokeWidth={PIE_RADIUS}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
          strokeDasharray={`${sliceLength} ${CIRCUMFERENCE}`}
        />

        {/* Rotating hand — anchored exactly at CENTER, never goes out */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={handX}
          y2={handY}
          stroke="#d65757"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Center white knob with depth (drawn over the hand anchor) */}
        <circle cx={CENTER} cy={CENTER} r="26" fill="#f3f4f6" filter="url(#knobShadow)" />
        <circle cx={CENTER} cy={CENTER} r="20" fill="#ffffff" />
        <circle cx={CENTER} cy={CENTER} r="16" fill="#fafafa" />
      </svg>
    </div>
  )
}
