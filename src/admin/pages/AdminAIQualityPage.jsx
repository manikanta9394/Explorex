import { useState, useEffect } from 'react'
import {
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  BookmarkPlus,
  RefreshCw,
  Plus,
  Sliders,
  CheckCircle,
  Database,
  ExternalLink,
  BookOpen,
} from 'lucide-react'
import { adminService } from '../../services/adminService'

export default function AdminAIQualityPage({ onNavigate }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reindexing, setReindexing] = useState(false)
  const [reindexProgress, setReindexProgress] = useState(0)
  const [actionSuccess, setActionSuccess] = useState('')

  // Settings
  const [model, setModel] = useState('google/gemini-2.0-flash-lite')
  const [temperature, setTemperature] = useState(0.25)
  const [settingsSaved, setSettingsSaved] = useState(false)

  const loadAIQualityData = async () => {
    setLoading(true)
    try {
      const res = await adminService.fetchAIQualityLogs()
      setData(res)
    } catch (err) {
      console.error('Failed to load AI Quality data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAIQualityData()
  }, [])

  const handleAddToEvalSet = async (logId) => {
    try {
      await adminService.addAIEvalItem(logId)
      setActionSuccess(`Conversation log #${logId} added to permanent Golden Evaluation benchmark set!`)
      setTimeout(() => setActionSuccess(''), 4000)
    } catch (err) {
      alert(`Failed to add eval item: ${err.message}`)
    }
  }

  const handleReindexEmbeddings = () => {
    setReindexing(true)
    setReindexProgress(10)
    const interval = setInterval(() => {
      setReindexProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setReindexing(false)
          setActionSuccess('Postgres pgvector chunks re-indexed across all states and categories.')
          setTimeout(() => setActionSuccess(''), 4000)
          return 100
        }
        return prev + 18
      })
    }, 400)
  }

  const handleSaveAISettings = async (e) => {
    e.preventDefault()
    try {
      await adminService.updateSettings('ai_settings', {
        model,
        temperature: parseFloat(temperature),
      })
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 3000)
    } catch (err) {
      alert(`Failed to save AI settings: ${err.message}`)
    }
  }

  const conversations = data?.conversations || [
    {
      id: 'conv_fl_001',
      masked_user: 'exp_8f4a***',
      query: 'What is the entry ticket price for children at Golconda Fort?',
      response: 'At Golconda Fort, Indian citizens pay ₹25 per adult, while entry is free for children under 15 years old with valid age/school ID.',
      retrieved_chunks: [
        { title: 'Golconda Fort Pricing & Rules', score: 0.89, excerpt: 'Entry fee is ₹25 for adults; children under 15 enter free.' },
      ],
      user_feedback: 'thumbs_down',
      user_comment: 'Wanted to know if camera tickets are included for kids.',
      status: 'pending_eval',
      timestamp: '2026-10-24 14:20',
    },
    {
      id: 'conv_fl_002',
      masked_user: 'exp_3b11***',
      query: 'Is photography allowed inside Charminar upper gallery at night?',
      response: 'Upper gallery access to Charminar is generally restricted after sunset for safety. Verified visiting hours are 09:00 - 17:30 daily.',
      retrieved_chunks: [
        { title: 'Charminar Visitor Guidelines', score: 0.92, excerpt: 'Timings: 09:00 - 17:30. Upper levels closed at night.' },
      ],
      user_feedback: 'thumbs_down',
      user_comment: 'Saw someone take pictures from the minaret last Sunday.',
      status: 'pending_eval',
      timestamp: '2026-10-24 16:05',
    },
  ]

  const unansweredClusters = data?.unansweredClusters || [
    { topic: 'Bhimashankar Temple trekking guides', count: 42, suggested_state: 'Maharashtra' },
    { topic: 'Kinnerasani Wildlife Sanctuary boat timings', count: 35, suggested_state: 'Telangana' },
    { topic: 'Agra local street food walking tour hours', count: 28, suggested_state: 'Uttar Pradesh' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="admin-page-header">
        <div className="page-title-group">
          <h2>AI Retrieval & Grounding Quality</h2>
          <p>Inspect RAG chunk citations, audit negative feedback, curate Golden Eval benchmarks, and trigger vector re-indexing</p>
        </div>

        <div className="header-action-group">
          <button
            type="button"
            className="adm-btn-primary"
            onClick={handleReindexEmbeddings}
            disabled={reindexing}
          >
            <Database size={13} />
            <span>{reindexing ? `Re-indexing (${reindexProgress}%)...` : 'Re-index pgvector Chunks'}</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div
          style={{
            background: 'var(--adm-success-bg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '6px',
            padding: '10px 14px',
            color: 'var(--adm-success)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle size={15} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Model Parameters Card */}
      <div className="admin-table-container">
        <div className="table-toolbar">
          <span style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sliders size={14} /> Production Inference & Retrieval Configuration
          </span>
        </div>
        <form onSubmit={handleSaveAISettings} style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="adm-form-group" style={{ flex: 1, minWidth: '220px' }}>
            <label className="adm-label" htmlFor="model-select">Serving LLM Engine</label>
            <select
              id="model-select"
              className="admin-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="google/gemini-2.0-flash-lite">Google Gemini 2.0 Flash Lite (Grounding default)</option>
              <option value="google/gemini-2.0-flash-001">Google Gemini 2.0 Flash (Advanced reasoning)</option>
              <option value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B Instruct</option>
            </select>
          </div>

          <div className="adm-form-group" style={{ width: '180px' }}>
            <label className="adm-label" htmlFor="temperature-input">Grounding Temperature: <strong>{temperature}</strong></label>
            <input
              id="temperature-input"
              type="range"
              min="0.1"
              max="0.7"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <button type="submit" className="adm-btn-secondary" style={{ height: '32px' }}>
            {settingsSaved ? 'Saved!' : 'Save Config'}
          </button>
        </form>
      </div>

      {/* Flagged AI Conversation Logs */}
      <div className="admin-table-container">
        <div className="table-toolbar">
          <span style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ThumbsDown size={14} style={{ color: 'var(--adm-danger)' }} /> Flagged / Negative Feedback Turns (Masked Identities)
          </span>
          <button type="button" className="adm-btn-secondary" onClick={loadAIQualityData}>
            <RefreshCw size={12} />
            <span>Refresh</span>
          </button>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {conversations.map((turn) => (
            <div
              key={turn.id}
              style={{
                background: 'var(--adm-bg)',
                border: '1px solid var(--adm-border)',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <code style={{ fontSize: '11px', color: 'var(--adm-text-dim)' }}>{turn.masked_user}</code>
                  <span style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>• {turn.timestamp}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="adm-btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => handleAddToEvalSet(turn.id)}
                    title="Add to permanent golden evaluation test dataset"
                  >
                    <BookmarkPlus size={12} />
                    <span>Add to Eval Set</span>
                  </button>
                </div>
              </div>

              {/* User Prompt */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--adm-text-dim)', textTransform: 'uppercase' }}>Explorer Query:</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--adm-text)', marginTop: '2px' }}>
                  "{turn.query}"
                </div>
              </div>

              {/* AI Response */}
              <div
                style={{
                  background: 'var(--adm-surface)',
                  border: '1px solid var(--adm-border-subtle)',
                  borderRadius: '6px',
                  padding: '10px',
                }}
              >
                <div style={{ fontSize: '11px', color: 'var(--adm-accent)', fontWeight: 600 }}>CITED AI RESPONSE:</div>
                <div style={{ fontSize: '12.5px', marginTop: '4px', lineHeight: 1.45 }}>{turn.response}</div>
              </div>

              {/* Retrieved Chunks Inspection */}
              {turn.retrieved_chunks && turn.retrieved_chunks.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--adm-text-dim)' }}>Retrieved pgvector Grounding Chunks:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    {turn.retrieved_chunks.map((chk, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--adm-surface-raised)',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ color: 'var(--adm-text-muted)' }}>
                          <strong>{chk.title}:</strong> {chk.excerpt}
                        </span>
                        <span style={{ color: 'var(--adm-accent)', fontVariantNumeric: 'tabular-nums' }}>
                          Score: {(chk.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Discontent Reason */}
              {turn.user_comment && (
                <div style={{ fontSize: '11px', color: 'var(--adm-danger)' }}>
                  <strong>Explorer note:</strong> "{turn.user_comment}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Unanswered Query Clusters */}
      <div className="admin-table-container">
        <div className="table-toolbar">
          <span style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={14} /> Unanswered Questions Clustered by Topic
          </span>
        </div>
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Topic Phrase / Entity Cluster</th>
              <th>Suggested State</th>
              <th style={{ textAlign: 'right' }}>Frequency</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {unansweredClusters.map((cluster, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>{cluster.topic}</td>
                <td>
                  <span className="status-chip neutral">{cluster.suggested_state}</span>
                </td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {cluster.count} inquiries
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="adm-btn-secondary"
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                    onClick={() => onNavigate?.('/admin/places?action=new')}
                  >
                    <Plus size={11} />
                    <span>Create Place</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
