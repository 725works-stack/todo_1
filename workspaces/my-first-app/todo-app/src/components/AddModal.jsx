import { useState, useEffect } from 'react'

const EMPTY = {
  title: '', description: '',
  importance: 'high', urgency: 'high',
  status: 'todo', progress: 0, dueDate: '',
}

const QUAD_INFO = (importance, urgency) => {
  if (importance === 'high' && urgency === 'high') return { label: '① 瞬殺  Short / 5min',   color: '#ff2a6d' }
  if (importance === 'high' && urgency === 'low')  return { label: '② 長期  Long / Project',  color: '#05ffa1' }
  return { label: '③ とりあえず  Idea', color: '#00d9ff' }
}

const ToggleBtn = ({ active, color, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      flex: 1,
      padding: '6px 4px',
      borderRadius: 7,
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.15s',
      border: `1px solid ${active ? color : 'rgba(255,255,255,0.08)'}`,
      background: active ? `${color}18` : 'transparent',
      color: active ? color : '#44446a',
      letterSpacing: '0.04em',
      boxShadow: active ? `0 0 12px ${color}33` : 'none',
      textShadow: active ? `0 0 10px ${color}88` : 'none',
    }}
  >
    {label}
  </button>
)

export default function AddModal({ onClose, onSave, editing, defaultImportance, defaultUrgency }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (editing) setForm(editing)
    else setForm({ ...EMPTY, importance: defaultImportance || 'high', urgency: defaultUrgency || 'high' })
  }, [editing, defaultImportance, defaultUrgency])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const qi  = QUAD_INFO(form.importance, form.urgency)

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    color: '#d8d8e8',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  const focusStyle = color => e => {
    e.target.style.borderColor = color
    e.target.style.boxShadow = `0 0 12px ${color}33`
  }
  const blurStyle = e => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'rgba(5, 5, 18, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 16,
        width: '100%', maxWidth: 440,
        border: `1px solid ${qi.color}38`,
        boxShadow: `0 0 40px ${qi.color}18, 0 24px 60px rgba(0,0,0,0.7)`,
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: `1px solid ${qi.color}18`,
          background: `linear-gradient(90deg, ${qi.color}0a 0%, transparent 100%)`,
          borderRadius: '16px 16px 0 0',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14, fontWeight: 800, color: '#d8d8e8',
              letterSpacing: '0.05em',
            }}>
              {editing ? 'EDIT_TASK' : 'NEW_TASK'}
            </h2>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, fontWeight: 700, color: qi.color,
              textShadow: `0 0 10px ${qi.color}88`,
            }}>{qi.label}</span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#44446a', fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.color = '#ff2a6d'; e.currentTarget.style.borderColor = '#ff2a6d55' }}
            onMouseOut={e => { e.currentTarget.style.color = '#44446a'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Importance × Urgency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#44446a', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>IMPORTANCE</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <ToggleBtn active={form.importance === 'high'} color="#05ffa1" label="高" onClick={() => set('importance', 'high')} />
                <ToggleBtn active={form.importance === 'low'}  color="#44446a" label="低" onClick={() => set('importance', 'low')}  />
              </div>
            </div>
            <div>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#44446a', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>URGENCY</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <ToggleBtn active={form.urgency === 'high'} color="#ff2a6d" label="高" onClick={() => set('urgency', 'high')} />
                <ToggleBtn active={form.urgency === 'low'}  color="#44446a" label="低" onClick={() => set('urgency', 'low')}  />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#44446a', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>TITLE *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="タスク名を入力..."
              required
              style={inputStyle}
              onFocus={focusStyle(qi.color)}
              onBlur={blurStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#44446a', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>NOTE</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="補足メモ（任意）"
              rows={2}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={focusStyle(qi.color)}
              onBlur={blurStyle}
            />
          </div>

          {/* Due date */}
          <div>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#44446a', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>DUE DATE</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => set('dueDate', e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
              onFocus={focusStyle(qi.color)}
              onBlur={blurStyle}
            />
          </div>

          {/* Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#44446a', letterSpacing: '0.1em' }}>PROGRESS</label>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, fontWeight: 800, color: '#05ffa1',
                textShadow: '0 0 10px rgba(5,255,161,0.6)',
              }}>{form.progress}%</span>
            </div>
            <input
              type="range"
              className="modal-slider"
              min="0" max="100"
              value={form.progress}
              onChange={e => set('progress', Number(e.target.value))}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '10px', borderRadius: 9,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#44446a', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#d8d8e8' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#44446a' }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              style={{
                flex: 1, padding: '10px', borderRadius: 9,
                background: 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)',
                border: 'none',
                color: '#000', fontSize: 13, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 0 16px rgba(5,255,161,0.45)',
                transition: 'box-shadow 0.15s, transform 0.1s',
              }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(5,255,161,0.7)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(5,255,161,0.45)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {editing ? '更新' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
