import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import {
  Bot,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  Copy,
  Edit2,
  Footprints,
  Image as ImageIcon,
  Languages,
  Mic,
  MicOff,
  Navigation,
  Pin,
  PinOff,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SafeImage from '../components/SafeImage'
import { AIChatErrorBoundary } from '../components/ErrorBoundary'
import { allDatasetPlaces } from '../data/tourismData'
import { useAuth } from '../context/useAuth'
import { useLanguage } from '../context/LanguageContext'
import { useTravelMode } from '../context/useTravelMode'
import { useUserLocation } from '../context/useUserLocation'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { streamAIChatClient, sendAIFeedback } from '../services/api'
import {
  fetchUserConversations,
  createConversation,
  updateConversationTitle,
  togglePinConversation,
  deleteConversation,
  fetchConversationMessages,
  saveMessage,
  updateMessageFeedback,
  groupConversations,
} from '../services/chatStorageService'
import { formatPriceWithUnit } from '../utils/formatCurrency'

// ---------------------------------------------------------------------------
// Markdown & Table Formatter
// ---------------------------------------------------------------------------
function parseInlineFormatting(text) {
  if (!text) return ''
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    // Inline citation [1], [2], [3]
    const citationParts = part.split(/(\[\d+\])/g)
    return citationParts.map((sub, j) => {
      const match = sub.match(/^\[(\d+)\]$/)
      if (match) {
        return (
          <span key={`cite-${i}-${j}`} className="chat-citation-pill" title={`Source [${match[1]}]`}>
            [{match[1]}]
          </span>
        )
      }
      return sub
    })
  })
}

function RichMarkdownMessage({ content }) {
  if (!content) return null

  const lines = content.split('\n')
  const blocks = []
  let currentList = []
  let listType = null // 'ul' | 'ol'
  let tableRows = []

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === 'ol') {
        blocks.push(
          <ol key={`ol-${blocks.length}`} className="chat-ol">
            {currentList.map((li, idx) => (
              <li key={idx}>{parseInlineFormatting(li)}</li>
            ))}
          </ol>
        )
      } else {
        blocks.push(
          <ul key={`ul-${blocks.length}`} className="chat-ul">
            {currentList.map((li, idx) => (
              <li key={idx}>{parseInlineFormatting(li)}</li>
            ))}
          </ul>
        )
      }
      currentList = []
      listType = null
    }
  }

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0]
      const bodyRows = tableRows.slice(1).filter((r) => !r.every((c) => /^-+$/.test(c.trim())))
      blocks.push(
        <div key={`tbl-${blocks.length}`} className="chat-table-wrap">
          <table className="chat-markdown-table">
            <thead>
              <tr>
                {headerRow.map((col, idx) => (
                  <th key={idx}>{parseInlineFormatting(col.trim())}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{parseInlineFormatting(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      tableRows = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim()

    // Table line: starts and ends with |
    if (rawLine.startsWith('|') && rawLine.endsWith('|')) {
      flushList()
      const cells = rawLine
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim())
      tableRows.push(cells)
      continue
    } else {
      flushTable()
    }

    if (!rawLine) {
      flushList()
      continue
    }

    // Practical Tip Card
    if (rawLine.startsWith('💡') || rawLine.toLowerCase().startsWith('practical tip:')) {
      flushList()
      const tipText = rawLine.replace(/^💡\s*(practical tip:)?/i, '').trim()
      blocks.push(
        <div key={`tip-${blocks.length}`} className="chat-tip-card">
          <span className="tip-badge">💡 Practical Tip</span>
          <p>{parseInlineFormatting(tipText)}</p>
        </div>
      )
      continue
    }

    // Official Disclaimer / Verification Note
    if (
      rawLine.startsWith('*Note:') ||
      rawLine.startsWith('*గమనిక:') ||
      rawLine.startsWith('*नोट:') ||
      rawLine.startsWith('*குறிப்பு:') ||
      (rawLine.startsWith('*') && rawLine.endsWith('*') && rawLine.toLowerCase().includes('verify'))
    ) {
      flushList()
      const noteText = rawLine.replace(/^\*|\*$/g, '').trim()
      blocks.push(
        <div key={`note-${blocks.length}`} className="chat-verify-note">
          <span className="verify-note-icon">🛡️</span>
          <p>{parseInlineFormatting(noteText)}</p>
        </div>
      )
      continue
    }

    // Headings
    if (rawLine.startsWith('### ')) {
      flushList()
      blocks.push(
        <h4 key={`h4-${blocks.length}`} className="chat-heading-3">
          {parseInlineFormatting(rawLine.slice(4))}
        </h4>
      )
      continue
    }
    if (rawLine.startsWith('## ')) {
      flushList()
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="chat-heading-2">
          {parseInlineFormatting(rawLine.slice(3))}
        </h3>
      )
      continue
    }

    // Bullet Lists
    if (rawLine.startsWith('- ') || rawLine.startsWith('* ') || rawLine.startsWith('• ')) {
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      currentList.push(rawLine.replace(/^[-*•]\s+/, ''))
      continue
    }

    // Numbered Lists (1. , 2. )
    const numberedMatch = rawLine.match(/^(\d+)\.\s+(.*)/)
    if (numberedMatch) {
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }
      currentList.push(numberedMatch[2])
      continue
    }

    // Normal paragraph
    flushList()
    blocks.push(
      <p key={`p-${blocks.length}`} className="chat-paragraph">
        {parseInlineFormatting(rawLine)}
      </p>
    )
  }

  flushList()
  flushTable()

  return <div className="chat-rich-markdown">{blocks}</div>
}

// ---------------------------------------------------------------------------
// Main AI Guide Page Component
// ---------------------------------------------------------------------------
export default function AIGuidePage({ onNavigate: _onNavigate, onSelectPlace, onGetDirections }) {
  const { user } = useAuth()
  const { language: uiLanguage } = useLanguage()
  const { travelMode, setTravelMode } = useTravelMode()
  const { userCoords } = useUserLocation()
  const { savedPlaces: _savedPlaces } = useSavedPlaces()

  const userId = user?.id || 'guest_explorer'
  const profileName = user?.name || user?.displayName || (user?.email ? user.email.split('@')[0] : 'Explorer')

  // Sidebar & Conversation State
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [renamingId, setRenamingId] = useState(null)
  const [renamingTitle, setRenamingTitle] = useState('')

  // Active Chat Messages State
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingTokenAcc, setStreamingTokenAcc] = useState('')
  const [selectedPlaceId, setSelectedPlaceId] = useState('charminar-hyderabad')
  const [chatLanguage, setChatLanguage] = useState(uiLanguage || 'en')
  const [selectedImage, setSelectedImage] = useState(null) // base64 photo upload
  const [expandedSourcesMsgId, setExpandedSourcesMsgId] = useState(null)
  const [feedbackPopoverMsgId, setFeedbackPopoverMsgId] = useState(null)
  const [feedbackReason, setFeedbackReason] = useState('Inaccurate info')
  const [feedbackComment, setFeedbackComment] = useState('')
  const [copiedMsgId, setCopiedMsgId] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Refs
  const abortControllerRef = useRef(null)
  const chatScrollContainerRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Auto-scroll helper
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (chatScrollContainerRef.current) {
        chatScrollContainerRef.current.scrollTo({
          top: chatScrollContainerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 50)
  }, [])

  // -------------------------------------------------------------------------
  // 1. Time-Aware Greeting Logic
  // -------------------------------------------------------------------------
  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours()
    let englishPrefix = 'Good day'

    if (hour >= 5 && hour < 12) {
      englishPrefix = 'Good morning'
    } else if (hour >= 12 && hour < 17) {
      englishPrefix = 'Good afternoon'
    } else if (hour >= 17 && hour < 21) {
      englishPrefix = 'Good evening'
    } else {
      englishPrefix = 'Good evening'
    }

    if (chatLanguage === 'te') {
      return {
        title: `నమస్కారం, ${profileName}!`,
        subtitle: `ఈ రోజు భారతదేశంలో మనం ఎక్కడికి వెళ్దాం? ప్రవేశ రుసుములు, సందర్శన నియమాలు మరియు ప్రయాణ ప్రణాళికల కోసం నన్ను అడగండి.`,
      }
    }
    if (chatLanguage === 'hi') {
      return {
        title: `नमस्ते, ${profileName}!`,
        subtitle: `आज हम भारत में कहाँ की यात्रा कर रहे हैं? आधिकारिक टिकट दरों, समय और यात्रा मार्गों की सत्यापित जानकारी पूछें।`,
      }
    }
    if (chatLanguage === 'ta') {
      return {
        title: `வணக்கம், ${profileName}!`,
        subtitle: `இன்று இந்தியாவில் நாம் எங்கு செல்லலாம்? சரிபார்க்கப்பட்ட கட்டணங்கள், நேரங்கள் மற்றும் பயணத் திட்டங்களைக் கேளுங்கள்.`,
      }
    }

    return {
      title: `${englishPrefix}, ${profileName}! Where are we heading today?`,
      subtitle: `Your verified AI travel guide across all 36 States & Union Territories of India. Grounded strictly in authentic heritage data.`,
    }
  }, [profileName, chatLanguage])

  // Active Place object
  const activePlace = useMemo(() => {
    return allDatasetPlaces.find((p) => p.id === selectedPlaceId) || allDatasetPlaces[0]
  }, [selectedPlaceId])

  // -------------------------------------------------------------------------
  // 2. Load User Conversations from Database on Mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true
    async function loadConversations() {
      const list = await fetchUserConversations(userId)
      if (!mounted) return
      setConversations(list)
      if (list.length > 0 && !activeConvId) {
        setActiveConvId(list[0].id)
      }
    }
    loadConversations()
    return () => {
      mounted = false
    }
  }, [userId, activeConvId])

  // Load messages whenever active conversation changes
  useEffect(() => {
    let mounted = true
    if (!activeConvId) {
      setMessages([])
      return
    }
    async function loadMessages() {
      const msgs = await fetchConversationMessages(activeConvId)
      if (!mounted) return
      setMessages(msgs)
      scrollToBottom()
    }
    loadMessages()
    return () => {
      mounted = false
    }
  }, [activeConvId, scrollToBottom])

  // Auto-grow textarea
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`
    }
  }

  // -------------------------------------------------------------------------
  // 3. New Conversation, Rename, Delete, Pin
  // -------------------------------------------------------------------------
  const handleNewChat = async () => {
    const created = await createConversation(userId, 'New Conversation')
    if (created) {
      setConversations((prev) => [created, ...prev])
      setActiveConvId(created.id)
      setMessages([])
      setInputValue('')
      if (textareaRef.current) textareaRef.current.focus()
    }
  }

  const handleSaveRename = async (convId) => {
    if (!renamingTitle.trim()) {
      setRenamingId(null)
      return
    }
    await updateConversationTitle(convId, renamingTitle.trim())
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, title: renamingTitle.trim() } : c))
    )
    setRenamingId(null)
  }

  const handleTogglePin = async (e, conv) => {
    e.stopPropagation()
    const nextPin = !conv.is_pinned
    await togglePinConversation(conv.id, nextPin)
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, is_pinned: nextPin } : c))
    )
  }

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation()
    await deleteConversation(convId)
    const remaining = conversations.filter((c) => c.id !== convId)
    setConversations(remaining)
    if (activeConvId === convId) {
      setActiveConvId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  // Filter conversations for search in sidebar
  const filteredConversations = useMemo(() => {
    if (!sidebarSearch.trim()) return conversations
    return conversations.filter((c) =>
      c.title.toLowerCase().includes(sidebarSearch.toLowerCase().trim())
    )
  }, [conversations, sidebarSearch])

  const grouped = useMemo(() => groupConversations(filteredConversations), [filteredConversations])

  // -------------------------------------------------------------------------
  // 4. Send Message & Streaming Handler
  // -------------------------------------------------------------------------
  const handleSendMessage = async (textToSend = null) => {
    const prompt = (textToSend !== null ? textToSend : inputValue).trim()
    if (!prompt || isStreaming) return

    let currentConversationId = activeConvId
    // If no conversation exists, create one immediately
    if (!currentConversationId) {
      const created = await createConversation(userId, prompt.slice(0, 32) + '...')
      if (created) {
        currentConversationId = created.id
        setConversations([created])
        setActiveConvId(created.id)
      }
    }

    // Add user message to UI state immediately
    const userMessageId = `user_${Date.now()}`
    const userMsgObj = {
      id: userMessageId,
      role: 'user',
      content: prompt,
      image: selectedImage,
      createdAt: new Date().toISOString(),
    }

    const updatedMessages = [...messages, userMsgObj]
    setMessages(updatedMessages)
    setInputValue('')
    setSelectedImage(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Persist user message to DB
    saveMessage(currentConversationId, {
      role: 'user',
      content: prompt,
    })

    // If first message in conversation, update conversation title automatically
    if (messages.length === 0 && currentConversationId) {
      const autoTitle = prompt.length > 35 ? prompt.slice(0, 32) + '...' : prompt
      updateConversationTitle(currentConversationId, autoTitle)
      setConversations((prev) =>
        prev.map((c) => (c.id === currentConversationId ? { ...c, title: autoTitle } : c))
      )
    }

    // Prepare Assistant Streaming Placeholder
    setIsStreaming(true)
    setStreamingTokenAcc('')
    scrollToBottom()

    // Prepare AbortController for "Stop Generating"
    const controller = new AbortController()
    abortControllerRef.current = controller

    let accumulatedAnswer = ''
    let citationsReceived = []
    let sourcesReceived = []
    let usedModel = 'rag-grounded-engine'

    try {
      await streamAIChatClient({
        message: prompt,
        history: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        currentPlace: activePlace,
        travelMode,
        userLocation: userCoords,
        userId,
        image: selectedImage,
        signal: controller.signal,
        onToken: (token) => {
          accumulatedAnswer += token
          setStreamingTokenAcc(accumulatedAnswer)
          scrollToBottom()
        },
        onDone: (meta) => {
          citationsReceived = meta.citedPlaces || []
          sourcesReceived = meta.sources || []
          usedModel = meta.model || 'rag-grounded-engine'
        },
        onError: async (_err) => {
          // If streaming failed or aborted, fallback cleanly to standard askAI
          if (!controller.signal.aborted && !accumulatedAnswer) {
            const fallback = await askAI(prompt, updatedMessages, {
              currentPlace: activePlace,
              travelMode,
              userLocation: userCoords,
            })
            accumulatedAnswer = fallback.answer || 'I am ready to help you explore India.'
            citationsReceived = fallback.recommendedPlaces || []
            sourcesReceived = fallback.sources || []
          }
        },
      })
    } catch {
      if (!accumulatedAnswer) {
        accumulatedAnswer = 'Explorex was unable to connect. Please tap Retry to resend your query.'
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null

      if (accumulatedAnswer) {
        const assistantMsgObj = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: accumulatedAnswer,
          citations: citationsReceived,
          sources: sourcesReceived,
          model: usedModel,
          feedback: null,
          createdAt: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMsgObj])
        setStreamingTokenAcc('')

        // Save assistant response to DB
        saveMessage(currentConversationId, {
          role: 'assistant',
          content: accumulatedAnswer,
          citations: citationsReceived,
          model: usedModel,
        })
      }
      scrollToBottom()
    }
  }

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
    }
  }

  // -------------------------------------------------------------------------
  // 5. Actions: Copy, Read Aloud, Regenerate, Edit Last Message, Feedback
  // -------------------------------------------------------------------------
  const handleCopyMessage = (msgId, text) => {
    navigator.clipboard.writeText(text)
    setCopiedMsgId(msgId)
    setTimeout(() => setCopiedMsgId(null), 2000)
  }

  const handleToggleReadAloud = (text) => {
    if (!('speechSynthesis' in window)) return
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const cleanText = text.replace(/[*#💡•\n]/gu, ' ').replace(/\[\d+\]/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = chatLanguage === 'te' ? 'te-IN' : chatLanguage === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const handleRegenerate = () => {
    // Find last user message
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === 'user')
    if (lastUserIndex === -1) return
    const actualIndex = messages.length - 1 - lastUserIndex
    const lastUserPrompt = messages[actualIndex].content
    // Remove messages after that user message
    setMessages(messages.slice(0, actualIndex))
    handleSendMessage(lastUserPrompt)
  }

  const handleEditLastMessage = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    if (lastUserMsg) {
      setInputValue(lastUserMsg.content)
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }

  const handleThumbsUp = async (msgId) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedback: 1 } : m))
    )
    await updateMessageFeedback(msgId, 1)
    sendAIFeedback({ messageId: msgId, conversationId: activeConvId, feedback: 1 })
  }

  const handleOpenThumbsDownPopover = (msgId) => {
    setFeedbackPopoverMsgId(msgId)
  }

  const handleSubmitThumbsDown = async () => {
    if (!feedbackPopoverMsgId) return
    const msgId = feedbackPopoverMsgId
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedback: -1 } : m))
    )
    await updateMessageFeedback(msgId, -1)
    sendAIFeedback({
      messageId: msgId,
      conversationId: activeConvId,
      feedback: -1,
      reason: feedbackReason,
      comment: feedbackComment,
    })
    setFeedbackPopoverMsgId(null)
    setFeedbackComment('')
  }

  // -------------------------------------------------------------------------
  // 6. Voice Speech Recognition (Web Speech API)
  // -------------------------------------------------------------------------
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = chatLanguage === 'te' ? 'te-IN' : chatLanguage === 'hi' ? 'hi-IN' : 'en-IN'

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onerror = () => setIsListening(false)
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        if (transcript) {
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript))
          if (textareaRef.current) {
            textareaRef.current.focus()
          }
        }
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch {
      setIsListening(false)
    }
  }

  // -------------------------------------------------------------------------
  // 7. Image Upload for Vision Queries ("What place is this?")
  // -------------------------------------------------------------------------
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setSelectedImage(event.target.result)
      if (!inputValue.trim()) {
        setInputValue('What place is this in the photo? Tell me about its heritage and visiting details.')
      }
      if (textareaRef.current) textareaRef.current.focus()
    }
    reader.readAsDataURL(file)
  }

  // Keyboard shortcut listener
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    } else if (e.key === 'ArrowUp' && !inputValue.trim() && messages.length > 0) {
      e.preventDefault()
      handleEditLastMessage()
    }
  }

  // Suggestion Cards for Empty-State
  const suggestionCards = useMemo(() => {
    return [
      {
        title: 'Golconda Fort Heritage Tour',
        desc: 'Explore ticket prices, acoustics, sound & light show timings.',
        prompt: 'What is the entry fee, visiting hours, and rules for Golconda Fort in Hyderabad?',
        icon: '🏛️',
      },
      {
        title: 'Living Chola Temples in Tamil Nadu',
        desc: 'Brihadeeswarar Temple architecture, dress code, and history.',
        prompt: 'Tell me about Brihadeeswarar Temple in Thanjavur: visiting etiquette, timings, and free entry details.',
        icon: '🛕',
      },
      {
        title: 'Golden Temple Spiritual Journey',
        desc: 'Amritsar langar, head covering rules, and best time to visit.',
        prompt: 'What are the rules and guidelines for visiting the Golden Temple in Amritsar?',
        icon: '✨',
      },
    ]
  }, [])

  return (
    <div className="ai-chatbot-page-shell">
      {/* Top Header Band */}
      <PageHeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Explorex AI Guide' },
        ]}
        eyebrow="RAG-Grounded Cultural Guide"
        title="Explorex AI Assistant"
        subtitle="Conversational travel intelligence covering all 36 States and Union Territories of India with verified source citations."
        badge={
          <div className="ai-header-badge-row">
            <span className="ai-version-pill">
              <Sparkles size={13} color="#C9A227" /> RAG Grounded v2.1
            </span>
            <span className="ai-status-pill online">
              <span className="status-dot-pulse" /> 100% Verified Data
            </span>
          </div>
        }
      />

      {/* Main Split Chat Layout */}
      <div className="ai-chat-master-container">
        {/* ================================================================= */}
        {/* LEFT CONVERSATION SIDEBAR (Claude / ChatGPT style)                */}
        {/* ================================================================= */}
        <aside className={`ai-chat-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
          <div className="sidebar-top-bar">
            <button
              type="button"
              className="new-chat-primary-btn"
              onClick={handleNewChat}
              title="Start a new conversation"
            >
              <Plus size={16} />
              <span>New Chat</span>
            </button>
            <button
              type="button"
              className="sidebar-close-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-label="Toggle sidebar"
            >
              <ChevronRight size={16} className={`toggle-icon ${sidebarOpen ? 'rotate' : ''}`} />
            </button>
          </div>

          {/* Search Conversations Input */}
          <div className="sidebar-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              aria-label="Search past chats"
            />
            {sidebarSearch && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSidebarSearch('')}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Grouped Conversations Scroll List */}
          <div className="sidebar-conversations-list">
            {/* 1. Pinned Chats */}
            {grouped.pinned.length > 0 && (
              <div className="conv-group-section">
                <span className="conv-group-label">
                  <Pin size={11} /> Pinned
                </span>
                {grouped.pinned.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={conv.id === activeConvId}
                    isRenaming={conv.id === renamingId}
                    renamingTitle={renamingTitle}
                    onSelect={() => setActiveConvId(conv.id)}
                    onStartRename={() => {
                      setRenamingId(conv.id)
                      setRenamingTitle(conv.title)
                    }}
                    onRenameChange={(e) => setRenamingTitle(e.target.value)}
                    onSaveRename={() => handleSaveRename(conv.id)}
                    onCancelRename={() => setRenamingId(null)}
                    onTogglePin={(e) => handleTogglePin(e, conv)}
                    onDelete={(e) => handleDeleteConversation(e, conv.id)}
                  />
                ))}
              </div>
            )}

            {/* 2. Today */}
            {grouped.today.length > 0 && (
              <div className="conv-group-section">
                <span className="conv-group-label">Today</span>
                {grouped.today.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={conv.id === activeConvId}
                    isRenaming={conv.id === renamingId}
                    renamingTitle={renamingTitle}
                    onSelect={() => setActiveConvId(conv.id)}
                    onStartRename={() => {
                      setRenamingId(conv.id)
                      setRenamingTitle(conv.title)
                    }}
                    onRenameChange={(e) => setRenamingTitle(e.target.value)}
                    onSaveRename={() => handleSaveRename(conv.id)}
                    onCancelRename={() => setRenamingId(null)}
                    onTogglePin={(e) => handleTogglePin(e, conv)}
                    onDelete={(e) => handleDeleteConversation(e, conv.id)}
                  />
                ))}
              </div>
            )}

            {/* 3. Yesterday */}
            {grouped.yesterday.length > 0 && (
              <div className="conv-group-section">
                <span className="conv-group-label">Yesterday</span>
                {grouped.yesterday.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={conv.id === activeConvId}
                    isRenaming={conv.id === renamingId}
                    renamingTitle={renamingTitle}
                    onSelect={() => setActiveConvId(conv.id)}
                    onStartRename={() => {
                      setRenamingId(conv.id)
                      setRenamingTitle(conv.title)
                    }}
                    onRenameChange={(e) => setRenamingTitle(e.target.value)}
                    onSaveRename={() => handleSaveRename(conv.id)}
                    onCancelRename={() => setRenamingId(null)}
                    onTogglePin={(e) => handleTogglePin(e, conv)}
                    onDelete={(e) => handleDeleteConversation(e, conv.id)}
                  />
                ))}
              </div>
            )}

            {/* 4. Earlier */}
            {grouped.earlier.length > 0 && (
              <div className="conv-group-section">
                <span className="conv-group-label">Earlier</span>
                {grouped.earlier.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={conv.id === activeConvId}
                    isRenaming={conv.id === renamingId}
                    renamingTitle={renamingTitle}
                    onSelect={() => setActiveConvId(conv.id)}
                    onStartRename={() => {
                      setRenamingId(conv.id)
                      setRenamingTitle(conv.title)
                    }}
                    onRenameChange={(e) => setRenamingTitle(e.target.value)}
                    onSaveRename={() => handleSaveRename(conv.id)}
                    onCancelRename={() => setRenamingId(null)}
                    onTogglePin={(e) => handleTogglePin(e, conv)}
                    onDelete={(e) => handleDeleteConversation(e, conv.id)}
                  />
                ))}
              </div>
            )}

            {conversations.length === 0 && (
              <div className="sidebar-empty-state">
                <Compass size={24} />
                <p>No conversations yet. Tap "New Chat" to begin exploring!</p>
              </div>
            )}
          </div>

          {/* Sidebar Footer info */}
          <div className="sidebar-footer">
            <span className="sidebar-brand-credit">Explorex RAG · All India Edition</span>
          </div>
        </aside>

        {/* ================================================================= */}
        {/* MAIN CHAT STAGE                                                   */}
        {/* ================================================================= */}
        <AIChatErrorBoundary>
          <main className="ai-chat-stage">
          {/* Top Stage Control Toolbar (Place, Mode, Language, Sidebar button) */}
          <div className="stage-top-controls">
            {!sidebarOpen && (
              <button
                type="button"
                className="stage-sidebar-open-btn"
                onClick={() => setSidebarOpen(true)}
                title="Open conversations sidebar"
              >
                <Compass size={16} />
                <span>History</span>
              </button>
            )}

            {/* Active Place Picker for spatial grounding */}
            <div className="control-pill-wrap place-picker">
              <label htmlFor="active-place-select">
                <Compass size={13} color="#C9A227" /> Inspecting:
              </label>
              <select
                id="active-place-select"
                value={selectedPlaceId}
                onChange={(e) => setSelectedPlaceId(e.target.value)}
                title="Ground conversation in a specific destination"
              >
                {allDatasetPlaces.slice(0, 50).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Travel Mode Selector */}
            <div className="control-pill-wrap mode-picker">
              <button
                type="button"
                className={`mode-btn ${travelMode === 'driving-car' || travelMode === 'driving' ? 'active' : ''}`}
                onClick={() => setTravelMode('driving-car')}
                title="Driving mode"
              >
                <Car size={13} />
              </button>
              <button
                type="button"
                className={`mode-btn ${travelMode === 'cycling-regular' || travelMode === 'cycling' ? 'active' : ''}`}
                onClick={() => setTravelMode('cycling-regular')}
                title="Cycling mode"
              >
                🚲
              </button>
              <button
                type="button"
                className={`mode-btn ${travelMode === 'foot-walking' || travelMode === 'walking' ? 'active' : ''}`}
                onClick={() => setTravelMode('foot-walking')}
                title="Walking mode"
              >
                <Footprints size={13} />
              </button>
            </div>

            {/* Language Selector */}
            <div className="control-pill-wrap lang-picker">
              <Languages size={13} />
              <select
                value={chatLanguage}
                onChange={(e) => setChatLanguage(e.target.value)}
                aria-label="Select AI output language"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>

          {/* =============================================================== */}
          {/* MESSAGES SCROLL CONTAINER                                        */}
          {/* =============================================================== */}
          <div className="ai-chat-messages-scroll" ref={chatScrollContainerRef}>
            {/* If no messages: Show Empty-State Greeting & Suggestions */}
            {messages.length === 0 && !isStreaming && (
              <div className="chat-empty-state-card">
                <div className="empty-state-brand-orb">
                  <Sparkles size={32} color="#C9A227" />
                </div>
                <h2 className="empty-greeting-title">{timeGreeting.title}</h2>
                <p className="empty-greeting-sub">{timeGreeting.subtitle}</p>

                {/* 3 Suggestion Cards */}
                <div className="empty-suggestions-grid">
                  {suggestionCards.map((card, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="suggestion-tile-card"
                      onClick={() => handleSendMessage(card.prompt)}
                    >
                      <div className="tile-icon">{card.icon}</div>
                      <div className="tile-content">
                        <h4>{card.title}</h4>
                        <p>{card.desc}</p>
                      </div>
                      <ChevronRight size={14} className="tile-arrow" />
                    </button>
                  ))}
                </div>

                {/* What I can do badge pills */}
                <div className="capabilities-ribbon">
                  <span className="cap-label">What I can do:</span>
                  <span className="cap-pill">✓ Verified Entry Tickets in ₹</span>
                  <span className="cap-pill">✓ Opening Hours &amp; Holiday Rules</span>
                  <span className="cap-pill">✓ Multi-Day Custom Itineraries</span>
                  <span className="cap-pill">✓ Proximity Food &amp; Stays</span>
                  <span className="cap-pill">✓ Telugu &amp; Hindi Native Chat</span>
                </div>
              </div>
            )}

            {/* Message Bubble Feed */}
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user'
              const isLastAssistant = !isUser && index === messages.length - 1

              return (
                <div key={msg.id} className={`chat-bubble-row ${isUser ? 'user-row' : 'assistant-row'}`}>
                  <div className="bubble-avatar-col">
                    {isUser ? (
                      <div className="user-avatar-badge" title={profileName}>
                        <User size={16} />
                      </div>
                    ) : (
                      <div className="assistant-avatar-badge" title="Explorex AI">
                        <Bot size={16} color="#C9A227" />
                      </div>
                    )}
                  </div>

                  <div className="bubble-content-col">
                    <div className="bubble-header-meta">
                      <span className="speaker-name">{isUser ? profileName : 'Explorex AI Guide'}</span>
                      {!isUser && msg.model && (
                        <span className="model-chip-tag">{msg.model}</span>
                      )}
                    </div>

                    {/* If user attached an image */}
                    {isUser && msg.image && (
                      <div className="user-attached-image-wrap">
                        <img src={msg.image} alt="Uploaded attachment" />
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="bubble-card-shell">
                      <RichMarkdownMessage content={msg.content} />
                    </div>

                    {/* Assistant Extra Features: Sources, Place Cards, Action Toolbar */}
                    {!isUser && (
                      <>
                        {/* Collapsible Sources Chips */}
                        {Array.isArray(msg.sources) && msg.sources.length > 0 && (
                          <div className="msg-sources-drawer">
                            <button
                              type="button"
                              className="sources-toggle-btn"
                              onClick={() =>
                                setExpandedSourcesMsgId(
                                  expandedSourcesMsgId === msg.id ? null : msg.id
                                )
                              }
                            >
                              <span className="sources-count-badge">
                                📚 {msg.sources.length} Verified Sources Cited
                              </span>
                              <ChevronDown
                                size={13}
                                className={`chevron-indicator ${expandedSourcesMsgId === msg.id ? 'open' : ''}`}
                              />
                            </button>

                            {expandedSourcesMsgId === msg.id && (
                              <div className="sources-dropdown-grid">
                                {msg.sources.map((s, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="source-snippet-card"
                                    onClick={() => onSelectPlace?.({ id: s.placeId, name: s.placeName })}
                                    title="Click to view full destination details"
                                  >
                                    <div className="source-card-header">
                                      <span className="source-num">[{s.index}]</span>
                                      <strong>{s.placeName}</strong>
                                      <span className="source-location">
                                        ({s.city}, {s.state})
                                      </span>
                                    </div>
                                    <p className="source-snippet-text">{s.snippet}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Interactive Place Cards under the answer */}
                        {Array.isArray(msg.citations) && msg.citations.length > 0 && (
                          <div className="msg-cited-places-tray">
                            <span className="tray-label">Destinations Cited in this Answer:</span>
                            <div className="cited-cards-slider">
                              {msg.citations.map((place) => {
                                const { priceDisplay, unitDisplay } = formatPriceWithUnit(place.price)
                                return (
                                  <div
                                    key={place.id}
                                    className="cited-place-tile interactive-card"
                                    onClick={() => onSelectPlace?.(place)}
                                  >
                                    <div className="tile-thumb-wrap">
                                      <SafeImage
                                        src={place.image}
                                        category={place.category}
                                        alt={place.name}
                                        className="tile-img"
                                      />
                                      <span className="tile-cite-index">[{place.citationIndex}]</span>
                                      {place.is_illustration && (
                                        <span className="tile-illust-chip">🎨 Illustration</span>
                                      )}
                                    </div>
                                    <div className="tile-info">
                                      <h5 className="tile-name" title={place.name}>
                                        {place.name}
                                      </h5>
                                      <span className="tile-location">
                                        {place.city}, {place.state}
                                      </span>
                                      <div className="tile-bottom-row">
                                        <span className="tile-price">
                                          {priceDisplay}
                                          {unitDisplay ? <small>/{unitDisplay}</small> : ''}
                                        </span>
                                        <button
                                          type="button"
                                          className="tile-directions-btn"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            onGetDirections?.(place)
                                          }}
                                          title="Get Directions"
                                        >
                                          <Navigation size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Follow-up Suggestion Chips after last assistant answer */}
                        {isLastAssistant && (
                          <div className="follow-up-suggestions-row">
                            <span className="follow-up-hint">Suggested follow-ups:</span>
                            <button
                              type="button"
                              className="follow-up-pill"
                              onClick={() => handleSendMessage(`What are the visiting rules and dress code for ${activePlace.name}?`)}
                            >
                              Visiting Rules &amp; Dress Code
                            </button>
                            <button
                              type="button"
                              className="follow-up-pill"
                              onClick={() => handleSendMessage(`Where can I find authentic regional food near ${activePlace.name}?`)}
                            >
                              Nearby Food &amp; Stays
                            </button>
                            <button
                              type="button"
                              className="follow-up-pill"
                              onClick={() => handleSendMessage(`What is the best month and time of day to visit ${activePlace.name}?`)}
                            >
                              Best Time to Visit
                            </button>
                          </div>
                        )}

                        {/* Action Toolbar below assistant message */}
                        <div className="msg-action-toolbar">
                          <button
                            type="button"
                            className="action-icon-btn"
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            title="Copy message to clipboard"
                          >
                            {copiedMsgId === msg.id ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                            <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            type="button"
                            className={`action-icon-btn ${isSpeaking ? 'active' : ''}`}
                            onClick={() => handleToggleReadAloud(msg.content)}
                            title="Read aloud using Text-to-Speech"
                          >
                            {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
                          </button>

                          {isLastAssistant && (
                            <button
                              type="button"
                              className="action-icon-btn"
                              onClick={handleRegenerate}
                              title="Regenerate this response"
                            >
                              <RotateCcw size={14} />
                              <span>Regenerate</span>
                            </button>
                          )}

                          <div className="feedback-buttons-group">
                            <button
                              type="button"
                              className={`feedback-thumb-btn ${msg.feedback === 1 ? 'active-up' : ''}`}
                              onClick={() => handleThumbsUp(msg.id)}
                              title="Helpful & accurate"
                              aria-label="Thumbs up"
                            >
                              <ThumbsUp size={13} fill={msg.feedback === 1 ? 'currentColor' : 'none'} />
                            </button>
                            <button
                              type="button"
                              className={`feedback-thumb-btn ${msg.feedback === -1 ? 'active-down' : ''}`}
                              onClick={() => handleOpenThumbsDownPopover(msg.id)}
                              title="Inaccurate or issues"
                              aria-label="Thumbs down"
                            >
                              <ThumbsDown size={13} fill={msg.feedback === -1 ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </div>

                        {/* Thumbs Down Reason Modal / Popover */}
                        {feedbackPopoverMsgId === msg.id && (
                          <div className="feedback-reason-modal">
                            <div className="modal-inner">
                              <h5>Help Us Improve Explorex AI</h5>
                              <p>What was the primary issue with this response?</p>
                              <select
                                value={feedbackReason}
                                onChange={(e) => setFeedbackReason(e.target.value)}
                              >
                                <option value="Inaccurate info">Inaccurate info / wrong fact</option>
                                <option value="Didn't cite data">Didn't cite verified places data</option>
                                <option value="Off topic">Off topic or declined incorrectly</option>
                                <option value="Too verbose">Too verbose or confusing</option>
                                <option value="Other">Other</option>
                              </select>
                              <textarea
                                placeholder="Additional details (optional)..."
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                rows={2}
                              />
                              <div className="modal-actions-row">
                                <button
                                  type="button"
                                  className="modal-cancel-btn"
                                  onClick={() => setFeedbackPopoverMsgId(null)}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="modal-submit-btn"
                                  onClick={handleSubmitThumbsDown}
                                >
                                  Submit Feedback
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Live Streaming Token Accumulator */}
            {isStreaming && (
              <div className="chat-bubble-row assistant-row streaming-row">
                <div className="bubble-avatar-col">
                  <div className="assistant-avatar-badge pulsing">
                    <Bot size={16} color="#C9A227" />
                  </div>
                </div>
                <div className="bubble-content-col">
                  <div className="bubble-header-meta">
                    <span className="speaker-name">Explorex AI Guide</span>
                    <span className="streaming-badge">
                      <Sparkles size={11} className="spin-icon" /> Generating verified answer...
                    </span>
                  </div>
                  <div className="bubble-card-shell">
                    {streamingTokenAcc ? (
                      <div className="streaming-live-text">
                        <RichMarkdownMessage content={streamingTokenAcc} />
                        <span className="streaming-cursor" />
                      </div>
                    ) : (
                      <div className="typing-indicator-wave">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                        <span className="typing-label">Retrieving facts from Explorex India database...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* BOTTOM PROMPT BAR                                                */}
          {/* =============================================================== */}
          <div className="ai-chat-bottom-bar">
            {/* If streaming: show Stop Generating button */}
            {isStreaming && (
              <div className="stop-generating-float-row">
                <button
                  type="button"
                  className="stop-generating-btn"
                  onClick={handleStopGenerating}
                >
                  <Square size={13} fill="currentColor" />
                  <span>Stop Generating</span>
                </button>
              </div>
            )}

            {/* Uploaded Image Preview Strip */}
            {selectedImage && (
              <div className="prompt-image-preview-strip">
                <div className="preview-chip">
                  <img src={selectedImage} alt="Attachment preview" />
                  <span>Photo attached for vision query</span>
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => setSelectedImage(null)}
                    title="Remove attachment"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}

            <div className="chat-input-pill-container">
              {/* Image upload button */}
              <button
                type="button"
                className="input-tool-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload landmark photo to ask 'What place is this?'"
                aria-label="Upload photo"
              >
                <ImageIcon size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageFileChange}
              />

              {/* Voice recognition button */}
              <button
                type="button"
                className={`input-tool-btn voice-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleSpeechRecognition}
                title={isListening ? 'Stop listening' : 'Speak your query via microphone'}
                aria-label="Voice input"
              >
                {isListening ? <MicOff size={18} color="#EF4444" /> : <Mic size={18} />}
              </button>

              {/* Auto-growing Textarea */}
              <textarea
                ref={textareaRef}
                className="chat-main-textarea"
                placeholder={
                  chatLanguage === 'te'
                    ? 'భారతీయ పర్యాటక ప్రదేశాలు, టికెట్ ధరలు లేదా ప్రయాణ ప్రణాళికల గురించి అడగండి...'
                    : chatLanguage === 'hi'
                    ? 'भारतीय पर्यटन स्थलों, टिकट शुल्क या यात्रा योजनाओं के बारे में पूछें...'
                    : chatLanguage === 'ta'
                    ? 'சுற்றுலா தலங்கள், நுழைவுக் கட்டணங்கள் அல்லது பயணத் திட்டங்கள் குறித்து கேளுங்கள்...'
                    : 'Ask about ticket prices, visiting hours, rules, or itineraries across India...'
                }
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isStreaming}
              />

              {/* Send Button */}
              <button
                type="button"
                className="chat-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isStreaming}
                aria-label="Send message"
                title="Send message (Enter)"
              >
                <Send size={16} />
              </button>
            </div>

            <div className="input-keyboard-legend">
              <span>
                <kbd>Enter</kbd> to send · <kbd>Shift + Enter</kbd> for new line · <kbd>↑</kbd> to edit last prompt
              </span>
            </div>
          </div>
        </main>
        </AIChatErrorBoundary>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sidebar Conversation Item Helper
// ---------------------------------------------------------------------------
function ConversationItem({
  conv,
  isActive,
  isRenaming,
  renamingTitle,
  onSelect,
  onStartRename,
  onRenameChange,
  onSaveRename,
  onCancelRename,
  onTogglePin,
  onDelete,
}) {
  if (isRenaming) {
    return (
      <div className="conv-item renaming">
        <input
          type="text"
          value={renamingTitle}
          onChange={onRenameChange}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSaveRename()
            if (e.key === 'Escape') onCancelRename()
          }}
        />
        <div className="rename-actions">
          <button type="button" onClick={onSaveRename} title="Save title">
            <Check size={12} color="#10B981" />
          </button>
          <button type="button" onClick={onCancelRename} title="Cancel">
            <X size={12} color="#EF4444" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`conv-item ${isActive ? 'active' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
    >
      <span className="conv-title" title={conv.title}>
        {conv.is_pinned && <Pin size={11} className="pin-marker-icon" />}
        {conv.title}
      </span>

      <div className="conv-actions-hover">
        <button
          type="button"
          className="conv-action-btn"
          onClick={onTogglePin}
          title={conv.is_pinned ? 'Unpin chat' : 'Pin chat to top'}
        >
          {conv.is_pinned ? <PinOff size={13} /> : <Pin size={13} />}
        </button>

        <button
          type="button"
          className="conv-action-btn"
          onClick={(e) => {
            e.stopPropagation()
            onStartRename()
          }}
          title="Rename conversation"
        >
          <Edit2 size={13} />
        </button>

        <button
          type="button"
          className="conv-action-btn delete"
          onClick={onDelete}
          title="Delete conversation"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
