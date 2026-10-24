import { useEffect, useRef, useState } from 'react'
import {
  Car,
  Compass,
  ExternalLink,
  Mic,
  MicOff,
  Navigation,
  RotateCcw,
  Send,
  Sparkles,
  Star,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SafeImage from '../components/SafeImage'
import { allDatasetPlaces, enrichedPlaces } from '../data/tourismData'
import { useAuth } from '../context/useAuth'
import { useTravelMode } from '../context/useTravelMode'
import { useUserLocation } from '../context/useUserLocation'
import { askAI, geocodeAddress } from '../services/api'
import { authApi } from '../services/authApi'
import { formatPriceWithUnit } from '../utils/formatCurrency'
import { AIChatErrorBoundary } from '../components/ErrorBoundary'

function parseFormattedText(text) {
  if (!text) return ''
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function MarkdownMessage({ content }) {
  if (!content) return null

  const lines = content.split('\n')
  const blocks = []
  let currentList = []
  let listType = null // 'ul' | 'ol'

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === 'ol') {
        blocks.push(
          <ol key={`ol-${blocks.length}`} className="chat-ol">
            {currentList.map((li, idx) => (
              <li key={idx}>{parseFormattedText(li)}</li>
            ))}
          </ol>
        )
      } else {
        blocks.push(
          <ul key={`ul-${blocks.length}`} className="chat-ul">
            {currentList.map((li, idx) => (
              <li key={idx}>{parseFormattedText(li)}</li>
            ))}
          </ul>
        )
      }
      currentList = []
      listType = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim()
    if (!rawLine) {
      flushList()
      continue
    }

    if (rawLine.startsWith('💡') || rawLine.toLowerCase().startsWith('practical tip:')) {
      flushList()
      const tipText = rawLine.replace(/^💡\s*(practical tip:)?/i, '').trim()
      blocks.push(
        <div key={`tip-${blocks.length}`} className="chat-tip-card">
          <span className="tip-badge">💡 Practical Tip</span>
          <p>{parseFormattedText(tipText)}</p>
        </div>
      )
      continue
    }

    if (
      rawLine.startsWith('*Note:') ||
      rawLine.startsWith('*గమనిక:') ||
      rawLine.startsWith('*नोट:') ||
      (rawLine.startsWith('*') && rawLine.endsWith('*') && rawLine.toLowerCase().includes('verify'))
    ) {
      flushList()
      const noteText = rawLine.replace(/^\*|\*$/g, '').trim()
      blocks.push(
        <div key={`note-${blocks.length}`} className="chat-verify-note">
          <span className="verify-note-icon">🛡️</span>
          <p>{parseFormattedText(noteText)}</p>
        </div>
      )
      continue
    }

    const bulletMatch = rawLine.match(/^[•\-*]\s+(.*)$/)
    if (bulletMatch) {
      if (listType === 'ol') flushList()
      listType = 'ul'
      currentList.push(bulletMatch[1])
      continue
    }

    const numberedMatch = rawLine.match(/^(\d+)\.\s+(.*)$/)
    if (numberedMatch) {
      if (listType === 'ul') flushList()
      listType = 'ol'
      currentList.push(numberedMatch[2])
      continue
    }

    flushList()
    blocks.push(
      <p key={`p-${blocks.length}`} className="chat-paragraph">
        {parseFormattedText(rawLine)}
      </p>
    )
  }

  flushList()
  return <div className="chat-markdown-body">{blocks}</div>
}

const EXAMPLE_PROMPTS_BY_LANG = {
  en: [
    { icon: '📍', label: '1-Day Itinerary', query: 'What to see in 1 day in Hyderabad?' },
    { icon: '🍽️', label: 'Where Locals Eat', query: 'Where do locals eat near Charminar?' },
    { icon: '📸', label: 'Golden Hour Photos', query: 'When is the best time for photos at Golconda Fort?' },
    { icon: '💰', label: 'Budget Under ₹100', query: 'What are some budget places under ₹100?' },
    { icon: '🚗', label: 'How to Get There', query: 'How do I reach Chowmahalla Palace by car?' },
    { icon: '🏛️', label: 'Museum Highlights', query: 'Tell me about Salar Jung Museum ticket prices and highlights.' },
  ],
  te: [
    { icon: '🍽️', label: 'చార్మినార్ వద్ద బిర్యానీ', query: 'చార్మినార్ దగ్గర ఫేమస్ బిర్యానీ ఎక్కడ దొరుకుతుంది?' },
    { icon: '🏰', label: 'గోల్కొండ కోట సమయాలు', query: 'గోల్కొండ కోట ప్రవేశ రుసుము మరియు సమయాలు ఏమిటి?' },
    { icon: '📍', label: '1 రోజు ప్రణాళిక', query: 'హైదరాబాద్‌లో 1 రోజులో ఏయే ముఖ్యమైన ప్రదేశాలు చూడవచ్చు?' },
    { icon: '⛵', label: 'హుస్సేన్ సాగర్ బోటింగ్', query: 'హుస్సేన్ సాగర్‌లో బోటింగ్ సమయాలు మరియు టికెట్ ధర ఎంత?' },
    { icon: '🏛️', label: 'సాలార్ జంగ్ మ్యూజియం', query: 'సాలార్ జంగ్ మ్యూజియం టికెట్ ధర మరియు సమయాలు చెప్పండి' },
  ],
  hi: [
    { icon: '🍽️', label: 'चारमीनार के पास बिरयानी', query: 'चारमीनार के पास सबसे अच्छी बिरयानी कहाँ मिलती है?' },
    { icon: '🏰', label: 'गोलकोंडा किला टिकट', query: 'गोलकोंडा किले का टिकट किराया और समय क्या है?' },
    { icon: '📍', label: '1 दिन का टूर प्लान', query: 'हैदराबाद में 1 दिन की यात्रा का प्लान क्या होना चाहिए?' },
    { icon: '⛵', label: 'हुसैन सागर बोटिंग', query: 'हुसैन सागर में बोटिंग का क्या समय और टिकट है?' },
    { icon: '🏛️', label: 'सालार जंग म्यूजियम', query: 'सालार जंग म्यूजियम घूमने का सबसे अच्छा समय क्या है?' },
  ],
}

const QUICK_CHIPS = [
  { icon: '📍', text: 'What to see in 1 day?' },
  { icon: '🍽️', text: 'Where do locals eat near Charminar?' },
  { icon: '💰', text: 'Places under ₹100' },
  { icon: '📸', text: 'Best time for photos?' },
  { icon: '🚗', text: 'How do I get there?' },
  { icon: 'తెలుగు', text: 'చార్మినార్ దగ్గర బిర్యానీ' },
  { icon: 'हिन्दी', text: 'गोलकोंडा किले का टिकट' },
]

export default function AIGuidePage({
  onNavigate,
  onSelectPlace,
  onGetDirections,
  currentPlace,
}) {
  const { user, token } = useAuth()
  const userId = user?.id || null
  const { travelMode, setTravelMode } = useTravelMode()
  const { userCoords } = useUserLocation()

  // Selected place context
  const [selectedPlaceId, setSelectedPlaceId] = useState(currentPlace?.id || enrichedPlaces[0]?.id || 'place-1-1')
  const activePlace = allDatasetPlaces.find((p) => p.id === selectedPlaceId) || currentPlace || enrichedPlaces[0]

  // Language tab for example prompts
  const [activeLangTab, setActiveLangTab] = useState('en')

  // Voice speech recognition state
  const isSpeechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  const [isListening, setIsListening] = useState(false)
  const [speechError, setSpeechError] = useState(null)
  const recognitionRef = useRef(null)

  const chatStorageKey = userId ? `explorex_full_chat_${userId}` : 'explorex_full_chat_guest'

  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(chatStorageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return [
      {
        id: 'welcome-guide-msg',
        role: 'assistant',
        text: `Hello! I am Explorex, your dedicated travel companion for Hyderabad and Telangana. Ask me anything—from custom 1-day itineraries to authentic Biryani spots, entry fees in ₹, or visiting rules. You can also ask in తెలుగు or हिन्दी!`,
        recommendedPlaces: [activePlace],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]
  })
  const [loading, setLoading] = useState(false)
  const chatContainerRef = useRef(null)
  const msgIdRef = useRef(10)
  const isInitialMount = useRef(true)

  // Persist messages
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(chatStorageKey, JSON.stringify(messages))
        if (userId && token) {
          authApi.syncChatHistory(token, messages).catch(() => {})
        }
      } catch {}
    }
  }, [messages, chatStorageKey, userId, token])

  // Scroll to bottom on new message
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, loading])

  // Check for auto-send prompt from Trip Planner
  useEffect(() => {
    try {
      const pending =
        sessionStorage.getItem('explorex_pending_ai_prompt') ||
        localStorage.getItem('explorex_pending_ai_prompt')
      if (pending) {
        sessionStorage.removeItem('explorex_pending_ai_prompt')
        localStorage.removeItem('explorex_pending_ai_prompt')
        setTimeout(() => {
          handleSend(pending)
        }, 350)
      }
    } catch {}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {}
      }
    }
  }, [])

  function toggleVoiceInput() {
    if (!isSpeechSupported) {
      setSpeechError('Web Speech API is not supported in this browser. Please type your query.')
      setTimeout(() => setSpeechError(null), 4000)
      return
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {}
      }
      setIsListening(false)
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      recognition.continuous = false
      recognition.interimResults = true

      // Map active language tab to speech recognition language
      recognition.lang =
        activeLangTab === 'te'
          ? 'te-IN'
          : activeLangTab === 'hi'
          ? 'hi-IN'
          : 'en-IN'

      recognition.onstart = () => {
        setIsListening(true)
        setSpeechError(null)
      }

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0]?.transcript)
          .join('')
        if (transcript) {
          setPrompt(transcript)
        }
      }

      recognition.onerror = (event) => {
        setIsListening(false)
        if (event.error !== 'no-speech') {
          setSpeechError(`Voice input: ${event.error}. Please try again or type your query.`)
          setTimeout(() => setSpeechError(null), 4000)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch {
      setIsListening(false)
      setSpeechError('Could not start speech recognition.')
      setTimeout(() => setSpeechError(null), 4000)
    }
  }

  async function handleSend(textToSend) {
    const text = typeof textToSend === 'string' ? textToSend : prompt.trim()
    if (!text || loading) return

    const nextId = msgIdRef.current++
    const userMessage = {
      id: `u-${nextId}`,
      role: 'user',
      text,
      timestamp: 'Just now',
    }

    setMessages((prev) => [...prev, userMessage])
    setPrompt('')
    setLoading(true)

    try {
      if (/where|location|find|address|reach/i.test(text)) {
        geocodeAddress(text).catch(() => null)
      }

      const historyPayload = messages
        .filter((m) => !m.error)
        .map((m) => ({ role: m.role, content: m.text }))

      const result = await askAI(text, historyPayload, {
        currentPlace: activePlace,
        travelMode: travelMode || 'driving-car',
        userLocation: userCoords,
      })

      const answerText =
        typeof result === 'string' ? result : result.answer || 'Here is what I found for you.'
      const recPlaces = Array.isArray(result?.recommendedPlaces) ? result.recommendedPlaces : []

      const respId = msgIdRef.current++
      const aiMessage = {
        id: `a-${respId}`,
        role: 'assistant',
        text: answerText,
        recommendedPlaces: recPlaces,
        timestamp: 'Just now',
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch {
      const errId = msgIdRef.current++
      setMessages((prev) => [
        ...prev,
        {
          id: `a-err-${errId}`,
          role: 'assistant',
          text: 'Explorex took longer than expected to respond or encountered a network timeout. Please verify your connection and click Retry below.',
          error: true,
          failedText: text,
          timestamp: 'Just now',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    const welcomeMsg = [
      {
        id: `welcome-cleared-${Date.now()}`,
        role: 'assistant',
        text: 'Chat cleared. Ask me anything about planning your journey in Hyderabad and Telangana (in English, తెలుగు, or हिन्दी)!',
        recommendedPlaces: [activePlace],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]
    setMessages(welcomeMsg)
    try {
      localStorage.setItem(chatStorageKey, JSON.stringify(welcomeMsg))
    } catch {}
  }

  // Open Google Maps Directions for a place
  function openDirectionsUrl(place) {
    if (!place?.position) return
    const mode =
      travelMode === 'foot-walking'
        ? 'walking'
        : travelMode === 'cycling-regular'
        ? 'bicycling'
        : 'driving'
    const [lat, lng] = place.position
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${mode}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const { priceDisplay: activePlacePrice } = formatPriceWithUnit(
    activePlace?.price,
    activePlace?.category
  )

  return (
    <div className="ai-guide-page-shell">
      {/* Header Band */}
      <PageHeaderBand
        eyebrow="Intelligent Travel Companion"
        title="Explorex AI Travel Guide"
        subtitle="Your conversational Hyderabad &amp; Telangana specialist. Grounded in verified places, transparent prices in ₹, and real travel times."
        badge={
          <span className="header-stat-badge">
            <Sparkles size={13} /> Grounded in Verified Telangana Places
          </span>
        }
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'AI Guide' },
        ]}
      />

      {/* Main Full-page Chat Shell */}
      <div className="ai-guide-container">
        <AIChatErrorBoundary>
          <div className="ai-guide-layout-box">
            {/* Side Panel: Pick place context, travel mode, and tap example prompts */}
            <aside className="ai-guide-sidebar">
              {/* Profile Card */}
              <div className="ai-profile-card">
                <div className="ai-avatar-wrap">
                  <span className="profile-sparkles">
                    <Sparkles size={20} />
                  </span>
                  <span className="online-pulse-ring" />
                </div>
                <div className="ai-profile-meta">
                  <h4>Explorex AI Guide</h4>
                  <span className="ai-status-tag">Online • Dataset Grounded</span>
                </div>
              </div>

              {/* 1. Pick the Place You Are Looking At */}
              <div className="ai-side-panel-section">
                <div className="panel-section-header">
                  <Compass size={14} />
                  <label htmlFor="ai-place-select">Place You Are Looking At</label>
                </div>
                <select
                  id="ai-place-select"
                  className="ai-place-picker-select"
                  value={selectedPlaceId}
                  onChange={(e) => setSelectedPlaceId(e.target.value)}
                >
                  <optgroup label="Top Heritage & Landmarks">
                    {enrichedPlaces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="All Destinations">
                    {allDatasetPlaces
                      .filter((p) => !enrichedPlaces.some((ep) => ep.id === p.id))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.category})
                        </option>
                      ))}
                  </optgroup>
                </select>

                {/* Place Preview Card */}
                {activePlace && (
                  <div className="ai-focus-place-card">
                    <div className="focus-card-thumb">
                      <SafeImage
                        src={activePlace.image}
                        fallbackSrc={activePlace.fallbackImage}
                        category={activePlace.category}
                        alt={activePlace.name}
                      />
                    </div>
                    <div className="focus-card-info">
                      <span className="focus-card-name">{activePlace.name}</span>
                      <div className="focus-card-meta">
                        <span className="focus-card-chip">{activePlace.category}</span>
                        <span className="focus-card-rating">
                          <Star size={11} fill="#C9A227" color="#C9A227" />
                          {activePlace.rating || 4.7}
                        </span>
                        <span className="focus-card-price">{activePlacePrice}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="focus-view-btn"
                      onClick={() => {
                        if (onSelectPlace) onSelectPlace(activePlace)
                        onNavigate(`explore/${activePlace.id}`)
                      }}
                      title="View destination details"
                    >
                      <ExternalLink size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Pick a Travel Mode */}
              <div className="ai-side-panel-section">
                <div className="panel-section-header">
                  <Car size={14} />
                  <span>Pick a Travel Mode</span>
                </div>
                <div className="travel-mode-selector-group">
                  <button
                    type="button"
                    className={`travel-mode-pill-btn ${
                      travelMode === 'driving-car' ? 'active' : ''
                    }`}
                    onClick={() => setTravelMode('driving-car')}
                  >
                    <span>🚗</span>
                    <span>Driving</span>
                  </button>
                  <button
                    type="button"
                    className={`travel-mode-pill-btn ${
                      travelMode === 'foot-walking' ? 'active' : ''
                    }`}
                    onClick={() => setTravelMode('foot-walking')}
                  >
                    <span>🚶</span>
                    <span>Walking</span>
                  </button>
                  <button
                    type="button"
                    className={`travel-mode-pill-btn ${
                      travelMode === 'cycling-regular' ? 'active' : ''
                    }`}
                    onClick={() => setTravelMode('cycling-regular')}
                  >
                    <span>🚴</span>
                    <span>Cycling</span>
                  </button>
                  <button
                    type="button"
                    className={`travel-mode-pill-btn ${
                      travelMode === 'transit' ? 'active' : ''
                    }`}
                    onClick={() => setTravelMode('driving-car')}
                  >
                    <span>🚌</span>
                    <span>Transit</span>
                  </button>
                </div>
              </div>

              {/* 3. Tap Example Prompts (English, Telugu, Hindi) */}
              <div className="ai-side-panel-section">
                <div className="panel-section-header">
                  <Sparkles size={14} />
                  <span>Tap Example Prompts</span>
                </div>

                {/* Language Tabs */}
                <div className="lang-tabs-bar">
                  <button
                    type="button"
                    className={`lang-tab-btn ${activeLangTab === 'en' ? 'active' : ''}`}
                    onClick={() => setActiveLangTab('en')}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    className={`lang-tab-btn ${activeLangTab === 'te' ? 'active' : ''}`}
                    onClick={() => setActiveLangTab('te')}
                  >
                    తెలుగు
                  </button>
                  <button
                    type="button"
                    className={`lang-tab-btn ${activeLangTab === 'hi' ? 'active' : ''}`}
                    onClick={() => setActiveLangTab('hi')}
                  >
                    हिन्दी
                  </button>
                </div>

                <div className="quick-topics-list">
                  {EXAMPLE_PROMPTS_BY_LANG[activeLangTab]?.map((qp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="quick-topic-btn"
                      disabled={loading}
                      onClick={() => handleSend(qp.query)}
                    >
                      <span className="qp-icon">{qp.icon}</span>
                      <span className="qp-text">{qp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Conversation */}
              {messages.length > 1 && (
                <button
                  type="button"
                  className="sidebar-clear-chat-btn"
                  onClick={handleClear}
                >
                  <RotateCcw size={13} />
                  <span>Clear Conversation</span>
                </button>
              )}
            </aside>

            {/* Main Chat Conversation Container */}
            <main className="ai-guide-chat-main">
              {/* Chat Top Banner with Active Context */}
              <div className="chat-top-context-bar">
                <div className="chat-context-badges">
                  <span className="context-badge-item">
                    <Compass size={12} />
                    <strong>{activePlace?.name || 'Charminar'}</strong>
                  </span>
                  <span className="context-badge-item">
                    {travelMode === 'foot-walking'
                      ? '🚶 Walking'
                      : travelMode === 'cycling-regular'
                      ? '🚴 Cycling'
                      : '🚗 Driving'}
                  </span>
                </div>
                <div className="chat-model-grounding-tag">
                  🛡️ Strict Dataset Grounding Active
                </div>
              </div>

              {/* Messages Container */}
              <div
                className="chat-messages-container full-page-chat-container"
                ref={chatContainerRef}
              >
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-message-row ${msg.role}`}>
                    {msg.role === 'assistant' && (
                      <div className="msg-avatar">
                        <Sparkles size={13} />
                      </div>
                    )}

                    <div className={`chat-bubble ${msg.role}`}>
                      <MarkdownMessage content={msg.text} />

                      {/* Clickable Recommended Destination Cards */}
                      {msg.recommendedPlaces && msg.recommendedPlaces.length > 0 && (
                        <div className="ai-recommended-cards">
                          <span className="recommended-cards-title">
                            <Compass size={13} /> Recommended Destinations
                          </span>
                          <div className="recommended-cards-list">
                            {msg.recommendedPlaces.map((rec) => {
                              const { priceDisplay } = formatPriceWithUnit(
                                rec.price,
                                rec.category
                              )
                              return (
                                <div
                                  key={rec.id}
                                  className="ai-card-item"
                                  onClick={() => {
                                    if (onSelectPlace) onSelectPlace(rec)
                                    onNavigate(`explore/${rec.id}`)
                                  }}
                                  title={`View details for ${rec.name}`}
                                >
                                  <div className="ai-card-img-wrap">
                                    <SafeImage
                                      src={rec.image}
                                      fallbackSrc={rec.fallbackImage}
                                      category={rec.category}
                                      alt={rec.name}
                                    />
                                    <span className="ai-card-chip">
                                      {rec.category || 'Attraction'}
                                    </span>
                                  </div>
                                  <div className="ai-card-body">
                                    <h4 className="ai-card-name">{rec.name}</h4>
                                    <div className="ai-card-meta">
                                      <span className="ai-card-rating">
                                        <Star size={11} fill="#C9A227" color="#C9A227" />
                                        <strong>{rec.rating || 4.7}</strong>
                                      </span>
                                      <span className="ai-card-price">{priceDisplay}</span>
                                    </div>
                                    <div className="ai-card-actions">
                                      <button
                                        type="button"
                                        className="ai-card-details-btn"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          if (onSelectPlace) onSelectPlace(rec)
                                          onNavigate(`explore/${rec.id}`)
                                        }}
                                        title="View Details"
                                      >
                                        <ExternalLink size={12} />
                                        <span>Details</span>
                                      </button>
                                      <button
                                        type="button"
                                        className="ai-card-directions-btn"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          if (onGetDirections) onGetDirections(rec)
                                          openDirectionsUrl(rec)
                                        }}
                                        title="Get Directions in Google Maps"
                                      >
                                        <Navigation size={12} />
                                        <span>Get Directions</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Error & Retry Banner */}
                      {msg.error && (
                        <div className="chat-error-actions">
                          <button
                            type="button"
                            className="chat-retry-btn"
                            onClick={() => handleSend(msg.failedText)}
                          >
                            <RotateCcw size={12} />
                            <span>Retry Question</span>
                          </button>
                        </div>
                      )}

                      <span className="chat-timestamp">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}

                {/* Animated Typing Indicator */}
                {loading && (
                  <div className="chat-message-row assistant">
                    <div className="msg-avatar">
                      <Sparkles size={13} />
                    </div>
                    <div className="chat-bubble assistant typing-bubble">
                      <span className="typing-dots">
                        <span />
                        <span />
                        <span />
                      </span>
                      <span className="typing-label">Explorex is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Suggestion Chips Bar */}
              <div className="ai-quick-chips-bar">
                {QUICK_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="quick-suggestion-chip"
                    disabled={loading}
                    onClick={() => handleSend(chip.text)}
                  >
                    <span className="chip-icon">{chip.icon}</span>
                    <span className="chip-text">{chip.text}</span>
                  </button>
                ))}
              </div>

              {/* Chat Input Toolbar with Voice Input */}
              <div className="chat-input-toolbar">
                {isListening && (
                  <div className="voice-listening-banner">
                    <span className="voice-pulse-indicator" />
                    <span>Listening... Speak now in English, తెలుగు, or हिन्दी</span>
                  </div>
                )}

                {speechError && (
                  <div className="speech-error-banner">
                    <span>⚠️ {speechError}</span>
                  </div>
                )}

                <form
                  className="ai-chat-input-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                >
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask about 1-day itineraries, Biryani spots, photography rules, or entry prices in ₹..."
                    disabled={loading}
                  />

                  {/* Voice input button (Web Speech API) */}
                  <button
                    type="button"
                    className={`voice-input-btn ${isListening ? 'is-listening' : ''}`}
                    onClick={toggleVoiceInput}
                    title={
                      isSpeechSupported
                        ? isListening
                          ? 'Stop listening'
                          : 'Voice input (speak in English, Telugu, or Hindi)'
                        : 'Voice input not supported in this browser'
                    }
                    aria-label="Voice input"
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    className="ai-send-btn"
                    disabled={loading || !prompt.trim()}
                    aria-label="Send message to Explorex"
                  >
                    <Send size={16} />
                  </button>
                </form>

                <div className="ai-chat-disclaimer">
                  💡 Prices, timings, and rules may vary; please verify before visiting.
                </div>
              </div>
            </main>
          </div>
        </AIChatErrorBoundary>
      </div>
    </div>
  )
}
