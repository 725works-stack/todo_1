import { useState } from 'react'

const QUAD_COLOR = {
  high_high: '#ff2a6d',
  high_low:  '#05ffa1',
  low_high:  '#00d9ff',
  low_low:   '#00d9ff',
}

const STATUS_OPTIONS = [
  { key: 'todo',       label: 'TODO',  color: '#556',    bg: 'rgba(85,85,102,0.12)' },
  { key: 'inProgress', label: '進行中', color: '#ffd700', bg: 'rgba(255,215,0,0.1)' },
  { key: 'done',       label: '完了',  color: '#05ffa1', bg: 'rgba(5,255,161,0.1)' },
]

function truncate(str, n) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

export default function TodoItem({ todo, accentColor, onStatusChange, onProgressChange, onDelete, onEdit }) {
  const [hovered, setHovered] = useState(false)
  const color  = accentColor || QUAD_COLOR[`${todo.importance}_${todo.urgency}`] || '#888'
  const isDone = todo.status === 'done'

  return (
    <div
      className="task-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(90deg, ${color}0f 0%, rgba(8,8,24,0.7) 100%)`
          : 'rgba(8, 8, 24, 0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderLeft: `2px solid ${color}`,
        borderRadius: 6,
        padding: '5px 8px',
        marginBottom: 4,
        position: 'relative',
        boxShadow: hovered
          ? `0 0 0 1px ${color}30, 0 4px 18px ${color}28, -2px 0 14px ${color}20`
          : `0 0 0 1px rgba(255,255,255,0.04), 0 0 6px ${color}14`,
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {/* ─ Info row ─ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>

        {/* Title + memo */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 8, overflow: 'hidden', minWidth: 0 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: isDone ? '#3a3a52' : '#eeeef8',
            textDecoration: isDone ? 'line-through' : 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            maxWidth: '58%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {truncate(todo.title, 25)}
          </span>
          {todo.description && (
            <span style={{
              fontSize: 10,
              color: isDone ? '#2e2e42' : '#9898c0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flexShrink: 1,
            }}>
              {truncate(todo.description, 15)}
            </span>
          )}
        </div>

        {/* Due date */}
        {todo.dueDate && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9, color: '#7070a8', flexShrink: 0,
          }}>
            {todo.dueDate.slice(5)}
          </span>
        )}

        {/* Status segmented buttons */}
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {STATUS_OPTIONS.map((s, i) => {
            const isActive = todo.status === s.key
            return (
              <button
                key={s.key}
                onClick={() => onStatusChange(todo.id, s.key)}
                title={s.label}
                className={isActive && s.key === 'inProgress' ? 'badge-breath' : ''}
                style={{
                  padding: '1px 5px',
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  borderRadius: i === 0 ? '3px 0 0 3px' : i === 2 ? '0 3px 3px 0' : '0',
                  border: `1px solid ${isActive ? s.color + '99' : 'rgba(255,255,255,0.07)'}`,
                  borderLeft: i > 0 ? `1px solid ${isActive ? s.color + '99' : 'rgba(255,255,255,0.07)'}` : undefined,
                  backgroundColor: isActive ? s.bg : 'transparent',
                  color: isActive ? s.color : '#3a3a5a',
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                  lineHeight: 1.4,
                  boxShadow: isActive ? `0 0 8px ${s.color}44` : 'none',
                }}
                onMouseOver={e => { if (!isActive) { e.currentTarget.style.color = s.color; e.currentTarget.style.borderColor = s.color + '55' } }}
                onMouseOut={e => { if (!isActive) { e.currentTarget.style.color = '#3a3a5a'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' } }}
              >
                {s.label}
              </button>
            )
          })}
        </div>

        {/* Edit / Delete */}
        <div className="task-actions" style={{ display: 'flex', gap: 1, flexShrink: 0, opacity: 0, transition: 'opacity 0.15s' }}>
          <button
            onClick={() => onEdit(todo)}
            style={{ width: 16, height: 16, fontSize: 10, color: '#44446a', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseOver={e => e.currentTarget.style.color = '#d8d8e8'}
            onMouseOut={e => e.currentTarget.style.color = '#44446a'}
          >✎</button>
          <button
            onClick={() => onDelete(todo.id)}
            style={{ width: 16, height: 16, fontSize: 11, color: '#44446a', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseOver={e => e.currentTarget.style.color = '#ff2a6d'}
            onMouseOut={e => e.currentTarget.style.color = '#44446a'}
          >×</button>
        </div>
      </div>

      {/* ─ Progress bar + slider ─ */}
      <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ flex: 1, position: 'relative', height: 4 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${todo.progress}%`,
              background: `linear-gradient(90deg, ${color}bb, ${color})`,
              boxShadow: todo.progress > 0 ? `0 0 6px ${color}88` : 'none',
              transition: 'width 0.2s',
              borderRadius: 2,
            }} />
          </div>
          <input
            type="range"
            className="task-slider"
            min="0" max="100"
            value={todo.progress}
            onChange={e => onProgressChange(todo.id, Number(e.target.value))}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', '--thumb-color': color }}
          />
        </div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          fontWeight: 700,
          color: todo.progress > 0 ? color : '#33334a',
          minWidth: 26,
          textAlign: 'right',
          flexShrink: 0,
          textShadow: todo.progress > 0 ? `0 0 8px ${color}66` : 'none',
          transition: 'color 0.2s, text-shadow 0.2s',
        }}>{todo.progress}%</span>
      </div>

      <style>{`.task-card:hover .task-actions { opacity: 1 !important; }`}</style>
    </div>
  )
}
