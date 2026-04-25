import { useState } from 'react'

const MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
const DAY_NAMES   = ['日','月','火','水','木','金','土']

const QUAD_COLOR = (importance, urgency) => {
  if (importance === 'high' && urgency === 'high') return '#ff2a6d'
  if (importance === 'high' && urgency === 'low')  return '#05ffa1'
  return '#00d9ff'
}

export default function Calendar({ todos }) {
  const today = new Date()
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year  = cur.getFullYear()
  const month = cur.getMonth()
  const daysInMonth  = new Date(year, month + 1, 0).getDate()
  const firstWeekDay = new Date(year, month, 1).getDay()

  const byDay = {}
  todos.forEach(t => {
    if (!t.dueDate) return
    const d = new Date(t.dueDate + 'T00:00:00')
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!byDay[day]) byDay[day] = []
      byDay[day].push(t)
    }
  })

  const cells = []
  for (let i = 0; i < firstWeekDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const isToday = d =>
    d === today.getDate() && year === today.getFullYear() && month === today.getMonth()

  return (
    <div style={{
      background: 'rgba(8, 8, 22, 0.62)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: 12,
      border: '1px solid rgba(5,255,161,0.35)',
      boxShadow: '0 0 24px rgba(5,255,161,0.18), 0 0 1px rgba(5,255,161,0.5), inset 0 0 30px rgba(5,255,161,0.04)',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button
          onClick={() => setCur(new Date(year, month - 1, 1))}
          style={{ color: '#44446a', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, transition: 'color 0.15s' }}
          onMouseOver={e => e.currentTarget.style.color = '#05ffa1'}
          onMouseOut={e => e.currentTarget.style.color = '#44446a'}
        >‹</button>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12, fontWeight: 700, color: '#05ffa1',
          textShadow: '0 0 10px rgba(5,255,161,0.5)',
          letterSpacing: '0.06em',
        }}>
          {year} / {String(month + 1).padStart(2, '0')}
        </span>
        <button
          onClick={() => setCur(new Date(year, month + 1, 1))}
          style={{ color: '#44446a', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, transition: 'color 0.15s' }}
          onMouseOver={e => e.currentTarget.style.color = '#05ffa1'}
          onMouseOut={e => e.currentTarget.style.color = '#44446a'}
        >›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 5 }}>
        {DAY_NAMES.map((d, i) => (
          <div key={d} style={{
            textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            fontWeight: 700,
            paddingBottom: 4,
            color: i === 0 ? '#ff2a6d88' : i === 6 ? '#05ffa188' : '#33334a',
            letterSpacing: '0.05em',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', flex: 1 }}>
        {cells.map((day, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2px 0',
          }}>
            {day && (
              <>
                <span style={{
                  width: 22, height: 22,
                  borderRadius: '50%',
                  border: isToday(day) ? '2px solid #05ffa1' : 'none',
                  backgroundColor: 'transparent',
                  boxShadow: isToday(day)
                    ? '0 0 10px rgba(5,255,161,0.7), 0 0 20px rgba(5,255,161,0.2), inset 0 0 8px rgba(5,255,161,0.1)'
                    : 'none',
                  color: isToday(day)
                    ? '#05ffa1'
                    : i % 7 === 0 ? '#ff2a6d66' : i % 7 === 6 ? '#05ffa166' : '#666688',
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: isToday(day) ? 800 : 400,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textShadow: isToday(day) ? '0 0 8px rgba(5,255,161,0.8)' : 'none',
                }}>
                  {day}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, marginTop: 1, maxWidth: 22 }}>
                  {(byDay[day] || []).slice(0, 4).map(t => (
                    <span
                      key={t.id}
                      title={t.title}
                      style={{
                        width: 4, height: 4, borderRadius: '50%',
                        backgroundColor: QUAD_COLOR(t.importance, t.urgency),
                        boxShadow: `0 0 4px ${QUAD_COLOR(t.importance, t.urgency)}`,
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
        {[
          { label: '瞬殺',       color: '#ff2a6d' },
          { label: '長期',       color: '#05ffa1' },
          { label: 'とりあえず', color: '#00d9ff' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              backgroundColor: l.color,
              boxShadow: `0 0 5px ${l.color}99`,
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#44446a' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
