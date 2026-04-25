import { useState } from 'react'

export default function SharePanel({ todos, onImport, onClose }) {
  const [copied, setCopied]         = useState(false)
  const [importText, setImportText] = useState('')
  const [error, setError]           = useState('')

  const exportData = JSON.stringify(todos, null, 2)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleImport = () => {
    try {
      const data = JSON.parse(importText)
      if (!Array.isArray(data)) throw new Error()
      onImport(data)
      setError('')
      onClose()
    } catch {
      setError('JSONの形式が正しくありません')
    }
  }

  const taStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 11,
    fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace",
    color: '#7878a0',
    resize: 'none',
    outline: 'none',
    colorScheme: 'dark',
    transition: 'border-color 0.2s, box-shadow 0.2s',
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
        width: '100%', maxWidth: 480,
        border: '1px solid rgba(0,217,255,0.25)',
        boxShadow: '0 0 40px rgba(0,217,255,0.1), 0 24px 60px rgba(0,0,0,0.7)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(0,217,255,0.1)',
          background: 'linear-gradient(90deg, rgba(0,217,255,0.06) 0%, transparent 100%)',
          borderRadius: '16px 16px 0 0',
        }}>
          <h2 style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, fontWeight: 800, color: '#00d9ff',
            textShadow: '0 0 12px rgba(0,217,255,0.6)',
            letterSpacing: '0.08em',
          }}>DATA_SHARE</h2>
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

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Export */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#44446a', letterSpacing: '0.1em' }}>EXPORT</label>
              <button
                onClick={copyToClipboard}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 6, cursor: 'pointer',
                  border: `1px solid ${copied ? '#05ffa1' : 'rgba(255,255,255,0.1)'}`,
                  color: copied ? '#05ffa1' : '#44446a',
                  background: copied ? 'rgba(5,255,161,0.1)' : 'transparent',
                  transition: 'all 0.15s',
                  boxShadow: copied ? '0 0 10px rgba(5,255,161,0.4)' : 'none',
                }}
              >
                {copied ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
            <textarea readOnly value={exportData} rows={5} style={taStyle} />
          </div>

          {/* Import */}
          <div>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: '#44446a', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
              IMPORT  (paste JSON)
            </label>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder='[{"id":"...","title":"...",...}]'
              rows={3}
              style={{ ...taStyle, color: '#d8d8e8' }}
              onFocus={e => { e.target.style.borderColor = '#00d9ff'; e.target.style.boxShadow = '0 0 12px rgba(0,217,255,0.2)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
            />
            {error && (
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: '#ff2a6d', fontSize: 10, marginTop: 4,
                textShadow: '0 0 8px rgba(255,42,109,0.6)',
              }}>{error}</p>
            )}
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              style={{
                marginTop: 10, width: '100%', padding: '10px', borderRadius: 9,
                background: importText.trim()
                  ? 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)'
                  : 'rgba(255,255,255,0.05)',
                border: 'none',
                color: importText.trim() ? '#000' : '#333',
                fontSize: 13, fontWeight: 800,
                cursor: importText.trim() ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                boxShadow: importText.trim() ? '0 0 16px rgba(5,255,161,0.4)' : 'none',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => { if (importText.trim()) { e.currentTarget.style.boxShadow = '0 0 28px rgba(5,255,161,0.65)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseOut={e => { if (importText.trim()) { e.currentTarget.style.boxShadow = '0 0 16px rgba(5,255,161,0.4)'; e.currentTarget.style.transform = 'translateY(0)' } }}
            >
              インポート
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
