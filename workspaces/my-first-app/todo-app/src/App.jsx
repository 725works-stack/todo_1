import { useState, useEffect } from 'react'
import TodoItem from './components/TodoItem'
import AddModal from './components/AddModal'
import SharePanel from './components/SharePanel'
import Calendar from './components/Calendar'
import ProgressSummary from './components/ProgressSummary'

const STORAGE_KEY = 'cybertodo-v1'
const MEMO_KEY    = 'cybertodo-memo-v1'

const SAMPLE_TODOS = [
  { id: '1', title: 'プロジェクト提案書の作成', description: '月曜の会議向け', importance: 'high', urgency: 'high', status: 'inProgress', progress: 35, dueDate: '2026-04-28' },
  { id: '2', title: 'バグ修正 #412',             description: '',               importance: 'high', urgency: 'high', status: 'todo',       progress: 0,  dueDate: '2026-04-25' },
  { id: '3', title: '長期戦略の策定',            description: '来期計画',        importance: 'high', urgency: 'low',  status: 'todo',       progress: 0,  dueDate: '2026-05-20' },
  { id: '4', title: 'チームビルディング企画',    description: '',               importance: 'high', urgency: 'low',  status: 'todo',       progress: 10, dueDate: '2026-05-10' },
  { id: '5', title: '会議の日程調整メール',       description: '全参加者へ連絡', importance: 'low',  urgency: 'high', status: 'todo',       progress: 0,  dueDate: '2026-04-24' },
  { id: '6', title: 'デスクの整理',              description: '',               importance: 'low',  urgency: 'low',  status: 'todo',       progress: 0,  dueDate: '' },
  { id: '7', title: '読みたい記事をまとめる',    description: '',               importance: 'low',  urgency: 'low',  status: 'todo',       progress: 0,  dueDate: '' },
]

const QUADRANTS = [
  {
    id: 'q1',
    filterFn: t => t.importance === 'high' && t.urgency === 'high',
    defaultI: 'high', defaultU: 'high',
    label: '瞬殺', sublabel: 'Short / 5min',
    color: '#ff2a6d',
    glow: 'rgba(255,42,109,0.18)',
    glowStrong: 'rgba(255,42,109,0.38)',
  },
  {
    id: 'q2',
    filterFn: t => t.importance === 'high' && t.urgency === 'low',
    defaultI: 'high', defaultU: 'low',
    label: '長期', sublabel: 'Long / Project',
    color: '#05ffa1',
    glow: 'rgba(5,255,161,0.15)',
    glowStrong: 'rgba(5,255,161,0.32)',
  },
  {
    id: 'q3',
    filterFn: t => t.importance === 'low',
    defaultI: 'low', defaultU: 'low',
    label: 'とりあえず', sublabel: 'Idea',
    color: '#00d9ff',
    glow: 'rgba(0,217,255,0.12)',
    glowStrong: 'rgba(0,217,255,0.28)',
  },
]

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function QuadrantPanel({ q, todos, onAdd, onStatusChange, onProgressChange, onDelete, onEdit }) {
  return (
    <div style={{
      background: 'rgba(8, 8, 22, 0.62)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: 12,
      border: `1px solid ${q.color}30`,
      boxShadow: `0 0 28px ${q.glow}, inset 0 0 40px ${q.glow}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px 7px',
        borderBottom: `1px solid ${q.color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        background: `linear-gradient(90deg, ${q.color}0a 0%, transparent 100%)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            fontWeight: 800,
            color: q.color,
            textShadow: `0 0 12px ${q.color}99, 0 0 24px ${q.color}44`,
            letterSpacing: '0.06em',
          }}>
            {q.label}
          </span>
          <span style={{ fontSize: 10, color: '#444', letterSpacing: '0.08em' }}>{q.sublabel}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: q.color, fontWeight: 700, opacity: 0.6,
          }}>{todos.length}</span>
          <button
            onClick={() => onAdd(q.defaultI, q.defaultU)}
            title={`${q.label}にタスクを追加`}
            style={{
              width: 19, height: 19, borderRadius: 5,
              background: `${q.color}18`,
              border: `1px solid ${q.color}55`,
              color: q.color,
              fontSize: 14, fontWeight: 800,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
              transition: 'all 0.15s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = `${q.color}30`
              e.currentTarget.style.boxShadow = `0 0 10px ${q.color}66`
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = `${q.color}18`
              e.currentTarget.style.boxShadow = 'none'
            }}
          >+</button>
        </div>
      </div>

      {/* Task list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 7px' }}>
        {todos.length === 0 ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', color: `${q.color}28`, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.1em',
          }}>
            NO TASKS
          </div>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              accentColor={q.color}
              onStatusChange={onStatusChange}
              onProgressChange={onProgressChange}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [todos, setTodos] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : SAMPLE_TODOS } catch { return SAMPLE_TODOS }
  })
  const [memo, setMemo]           = useState(() => localStorage.getItem(MEMO_KEY) || '')
  const [memoFocused, setMemoFocused] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showShare, setShowShare] = useState(false)
  const [defaultI, setDefaultI]   = useState('high')
  const [defaultU, setDefaultU]   = useState('high')

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)) }, [todos])
  useEffect(() => { localStorage.setItem(MEMO_KEY, memo) }, [memo])

  const openAdd = (imp = 'high', urg = 'high') => {
    setDefaultI(imp); setDefaultU(urg); setEditing(null); setShowAdd(true)
  }
  const handleSave = form => {
    if (editing) setTodos(ts => ts.map(t => t.id === editing.id ? { ...t, ...form } : t))
    else         setTodos(ts => [...ts, { ...form, id: generateId() }])
    setShowAdd(false); setEditing(null)
  }
  const handleEdit     = todo  => { setEditing(todo); setShowAdd(true) }
  const handleDelete   = id    => setTodos(ts => ts.filter(t => t.id !== id))
  const handleStatus   = (id, status) => setTodos(ts => ts.map(t =>
    t.id === id ? { ...t, status, progress: status === 'done' ? 100 : t.progress } : t))
  const handleProgress = (id, progress) => setTodos(ts => ts.map(t =>
    t.id === id ? { ...t, progress, status: progress === 100 ? 'done' : progress > 0 ? 'inProgress' : t.status } : t))
  const handleImport   = data  => setTodos(data)

  const q1 = todos.filter(QUADRANTS[0].filterFn)
  const q2 = todos.filter(QUADRANTS[1].filterFn)
  const q3 = todos.filter(QUADRANTS[2].filterFn)

  return (
    <div style={{
      background: 'linear-gradient(135deg, #050508 0%, #0a0a18 60%, #06060e 100%)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px 14px',
      gap: 10,
      overflow: 'hidden',
    }}>

      {/* ── Header ── */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <h1 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 20, fontWeight: 800,
          color: '#05ffa1',
          letterSpacing: '0.06em',
          textShadow: '0 0 16px rgba(5,255,161,0.7), 0 0 40px rgba(5,255,161,0.25)',
          lineHeight: 1,
        }}>
          TODO.EXE
        </h1>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: 14, marginLeft: 6 }}>
          {[{ q: QUADRANTS[0], todos: q1 }, { q: QUADRANTS[1], todos: q2 }, { q: QUADRANTS[2], todos: q3 }].map(({ q, todos: qt }) => (
            <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                backgroundColor: q.color,
                boxShadow: `0 0 6px ${q.color}`,
                flexShrink: 0,
              }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: q.color, fontWeight: 700, opacity: 0.85 }}>{q.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#3a3a5a', fontWeight: 600 }}>{qt.length}</span>
            </div>
          ))}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#3a3a5a' }}>
            完了 <span style={{ color: '#05ffa1', fontWeight: 700 }}>{todos.filter(t => t.status === 'done').length}</span>/{todos.length}
          </span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowShare(true)}
            style={{
              padding: '6px 12px', borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#556',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = '#05ffa1'
              e.currentTarget.style.color = '#05ffa1'
              e.currentTarget.style.boxShadow = '0 0 12px rgba(5,255,161,0.3)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = '#556'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >共有</button>
          <button
            onClick={() => openAdd('high', 'high')}
            style={{
              padding: '6px 14px', borderRadius: 8,
              background: 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)',
              border: 'none',
              color: '#000', fontSize: 12, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 0 16px rgba(5,255,161,0.45)',
              transition: 'box-shadow 0.15s, transform 0.1s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = '0 0 28px rgba(5,255,161,0.7)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = '0 0 16px rgba(5,255,161,0.45)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >+ タスクを追加</button>
        </div>
      </header>

      {/* ── Main: 左(カレンダー+進捗) | 右(2×2 TODOグリッド) ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '248px 1fr', gap: 12, minHeight: 0 }}>

        {/* 左: カレンダー + 進捗 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, overflow: 'hidden' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <Calendar todos={todos} />
          </div>
          <ProgressSummary todos={todos} />
        </div>

        {/* 右: 2×2 TODOグリッド */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 10, minHeight: 0 }}>

          {/* 左上: ①瞬殺 */}
          <QuadrantPanel
            q={QUADRANTS[0]} todos={q1} onAdd={openAdd}
            onStatusChange={handleStatus} onProgressChange={handleProgress}
            onDelete={handleDelete} onEdit={handleEdit}
          />

          {/* 右上: ③とりあえず */}
          <QuadrantPanel
            q={QUADRANTS[2]} todos={q3} onAdd={openAdd}
            onStatusChange={handleStatus} onProgressChange={handleProgress}
            onDelete={handleDelete} onEdit={handleEdit}
          />

          {/* 左下: ②長期 */}
          <QuadrantPanel
            q={QUADRANTS[1]} todos={q2} onAdd={openAdd}
            onStatusChange={handleStatus} onProgressChange={handleProgress}
            onDelete={handleDelete} onEdit={handleEdit}
          />

          {/* 右下: メモ欄 */}
          <div style={{
            background: 'rgba(8, 8, 22, 0.62)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 12,
            border: memoFocused
              ? '1px solid rgba(255,255,255,0.5)'
              : '1px solid rgba(255,255,255,0.18)',
            boxShadow: memoFocused
              ? '0 0 28px rgba(255,255,255,0.14), inset 0 0 40px rgba(255,255,255,0.03)'
              : '0 0 18px rgba(255,255,255,0.06), inset 0 0 40px rgba(255,255,255,0.02)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0,
            transition: 'border-color 0.25s, box-shadow 0.25s',
          }}>
            {/* Header */}
            <div style={{
              padding: '8px 12px 7px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13, fontWeight: 800,
                  color: '#ffffff',
                  textShadow: '0 0 10px rgba(255,255,255,0.9), 0 0 24px rgba(255,255,255,0.4)',
                  letterSpacing: '0.06em',
                }}>MEMO</span>
                <span style={{ fontSize: 10, color: '#555', letterSpacing: '0.08em' }}>Notes / Ideas</span>
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: memo.length > 0 ? 'rgba(255,255,255,0.3)' : '#22223a',
                transition: 'color 0.2s',
              }}>{memo.length}</span>
            </div>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              onFocus={() => setMemoFocused(true)}
              onBlur={() => setMemoFocused(false)}
              placeholder="自由なメモ、アイデア、リンクなど..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '10px 13px',
                color: '#c8c8dc',
                fontSize: 13,
                fontFamily: 'inherit',
                resize: 'none',
                lineHeight: 1.8,
                caretColor: '#ffffff',
              }}
            />
          </div>

        </div>
      </div>

      {/* ── Modals ── */}
      {showAdd && (
        <AddModal
          onClose={() => { setShowAdd(false); setEditing(null) }}
          onSave={handleSave}
          editing={editing}
          defaultImportance={defaultI}
          defaultUrgency={defaultU}
        />
      )}
      {showShare && (
        <SharePanel
          todos={todos}
          onImport={handleImport}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
