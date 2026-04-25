const RADIUS = 34
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const SIZE = 84

function CircularGauge({ pct }) {
  const offset     = CIRCUMFERENCE * (1 - pct / 100)
  const glowRadius = 4 + (pct / 100) * 14
  const color      = pct === 100 ? '#ffd700' : '#05ffa1'
  const glowColor  = pct === 100 ? 'rgba(255,215,0,0.7)' : 'rgba(5,255,161,0.65)'

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation={glowRadius * 0.4} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Track */}
      <circle
        cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="3.5"
      />
      {/* Progress arc */}
      <circle
        cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        style={{
          transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.4s',
          filter: `drop-shadow(0 0 ${glowRadius}px ${glowColor})`,
        }}
      />
      {/* Center percentage */}
      <text
        x={SIZE / 2} y={SIZE / 2 - 3}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="15"
        fontWeight="800"
        fontFamily="'JetBrains Mono', 'Roboto Mono', monospace"
        style={{ textShadow: `0 0 10px ${glowColor}` }}
      >
        {pct}
      </text>
      <text
        x={SIZE / 2} y={SIZE / 2 + 11}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="8"
        fontWeight="600"
        fontFamily="'JetBrains Mono', 'Roboto Mono', monospace"
        opacity="0.65"
      >
        %
      </text>
    </svg>
  )
}

export default function ProgressSummary({ todos }) {
  const total      = todos.length
  const done       = todos.filter(t => t.status === 'done').length
  const inProgress = todos.filter(t => t.status === 'inProgress').length
  const pct        = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div style={{
      background: 'rgba(8, 8, 22, 0.62)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: 12,
      border: '1px solid rgba(5,255,161,0.35)',
      boxShadow: '0 0 22px rgba(5,255,161,0.18), 0 0 1px rgba(5,255,161,0.5), inset 0 0 24px rgba(5,255,161,0.04)',
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      <CircularGauge pct={pct} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#44446a', flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#44446a' }}>
              {total} 件
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 4, height: 4, borderRadius: '50%',
              backgroundColor: '#ffd700',
              boxShadow: '0 0 5px rgba(255,215,0,0.7)',
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#ffd700', fontWeight: 700 }}>
              {inProgress} 進行中
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 4, height: 4, borderRadius: '50%',
              backgroundColor: '#05ffa1',
              boxShadow: '0 0 5px rgba(5,255,161,0.7)',
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#05ffa1', fontWeight: 700 }}>
              {done} 完了
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
