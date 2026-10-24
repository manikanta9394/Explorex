/**
 * Grounding Guard for Explorex RAG Chatbot
 * Protects against hallucinations, unverified places, and fabrications.
 */

export function isGroundingSufficient({ chunks, queryEntities, maxScore, rawQuery }) {
  if (!chunks || chunks.length === 0) {
    return { sufficient: false, reason: 'no_chunks_retrieved' }
  }

  // If user explicitly named a specific monument / place in their query,
  // ensure at least one retrieved chunk actually belongs to that place or matches it!
  const queryLower = (rawQuery || '').toLowerCase()

  // Common off-topic queries or non-Indian/fictional destinations
  const nonIndianFictionalMarkers = [
    'eiffel tower', 'statue of liberty', 'hogwarts', 'narnia', 'atlantis',
    'colosseum', 'big ben', 'disneyland', 'pyramids of giza', 'burj khalifa',
    'moon base', 'alien', 'mars', 'ufo'
  ]
  if (nonIndianFictionalMarkers.some((marker) => queryLower.includes(marker))) {
    return { sufficient: false, reason: 'out_of_domain_place' }
  }

  // Check if user asked specifically for a place name that doesn't exist anywhere in retrieved chunks
  if (queryEntities?.places && queryEntities.places.length > 0) {
    const hasAnyMatched = queryEntities.places.some((ep) =>
      chunks.some((c) => c.metadata.place_id === ep.id)
    )
    if (!hasAnyMatched) {
      return { sufficient: false, reason: 'place_mismatch' }
    }
  }

  // Check minimum score threshold
  if (maxScore !== undefined && maxScore !== null && maxScore < 0.008) {
    return { sufficient: false, reason: 'low_similarity_score' }
  }

  return { sufficient: true }
}

/**
 * Returns localized honest refusal message when verified data is not found
 */
export function getGroundedRefusalMessage(language = 'en', requestedSubject = '') {
  if (language === 'te') {
    return `నా దగ్గర Explorex భారతదేశ సమాచారంలో ${requestedSubject ? `"${requestedSubject}" గురించి ` : ''}ధృవీకరించబడిన సమాచారం లేదు.

సందర్శకుల భద్రత మరియు విశ్వసనీయత దృష్ట్యా, మేము ధృవీకరించబడని ధరలు లేదా ప్రదేశాలను ఊహించము. 

💡 ప్రాక్టికల్ సూచన: దయచేసి అధికారిక పర్యాటక శాఖ వెబ్‌సైట్లను (ఉదాహరణకు tourism.telangana.gov.in లేదా asi.nic.in) సంప్రదించండి. మీరు భారతదేశంలోని చార్మినార్, గోల్కొండ కోట, తాజ్ మహల్, హవా మహల్ లేదా బృహదీశ్వర ఆలయం వంటి ఇతర ప్రదేశాల గురించి అడగవచ్చు!`
  }

  if (language === 'hi') {
    return `मेरे पास Explorex भारत डेटासेट में ${requestedSubject ? `"${requestedSubject}" के बारे में ` : ''}कोई सत्यापित जानकारी नहीं है।

यात्रियों की सुविधा और प्रामाणिकता के लिए, हम काल्पनिक मूल्य या जानकारी प्रदान नहीं करते हैं।

💡 व्यावहारिक सुझाव: कृपया प्रामाणिक विवरण के लिए आधिकारिक राज्य पर्यटन पोर्टल या भारतीय पुरातत्व सर्वेक्षण (asi.nic.in) देखें। आप भारत के अन्य ऐतिहासिक स्थलों जैसे चारमीनार, गोलकोंडा किला, ताज महल, हवा महल या कोणार्क सूर्य मंदिर के बारे में पूछ सकते हैं!`
  }

  if (language === 'ta') {
    return `எங்கள் Explorex இந்தியா சுற்றுலா தரவுத்தொகுப்பில் ${requestedSubject ? `"${requestedSubject}" குறித்து ` : ''}சரிபார்க்கப்பட்ட தகவல் என்னிடம் இல்லை.

நாங்கள் உறுதிப்படுத்தப்படாத கட்டணங்கள் அல்லது இடங்களை கணிப்பதில்லை.

💡 குறிப்பு: தயவுசெய்து அதிகாரப்பூர்வ சுற்றுலா வலைத்தளங்களை (asi.nic.in) பார்க்கவும். நீங்கள் இந்தியாவின் தாஜ்மஹால், மீனாட்சி அம்மன் கோவில், பிரகதீஸ்வரர் கோவில் போன்ற இடங்களைப் பற்றி கேட்கலாம்!`
  }

  // English default
  return `I don't have verified information about that in the Explorex India dataset.

To ensure strict factual accuracy, Explorex never guesses or invents ticket prices, timings, or unverified places.

💡 Practical Tip: For official rates and schedules, please consult the Archaeological Survey of India (asi.nic.in) or the relevant state tourism department. Feel free to ask me about any of the 170+ verified heritage monuments across all 36 Indian states, including Golconda Fort, Charminar, Taj Mahal, Hawa Mahal, or Golden Temple!`
}
