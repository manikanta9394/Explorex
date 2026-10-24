import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { executeRAGChat } from '../server/services/openRouterService.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const datasetPath = path.resolve(__dirname, '../evals/rag_eval_dataset.json')

async function runRAGEval() {
  console.log('🧪 Starting Explorex RAG Benchmark Evaluation (npm run eval:rag)...\n')

  if (!fs.existsSync(datasetPath)) {
    console.error(`Dataset not found at ${datasetPath}`)
    process.exit(1)
  }

  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'))
  console.log(`Loaded ${dataset.length} evaluation test cases across 7 categories:\n`)

  let totalQuestions = dataset.length
  let retrievalHits = 0
  let retrievalEligible = 0
  let groundednessHits = 0
  let refusalHits = 0
  let refusalEligible = 0
  let totalLatencyMs = 0
  let languageMatches = 0
  let languageEligible = 0

  const resultsByCategory = {}

  for (let i = 0; i < dataset.length; i++) {
    const item = dataset[i]
    const category = item.category || 'general'
    if (!resultsByCategory[category]) {
      resultsByCategory[category] = { total: 0, passed: 0 }
    }
    resultsByCategory[category].total++

    const start = Date.now()
    const res = await executeRAGChat({
      message: item.query,
      travelMode: 'driving',
      userId: `eval_runner_${i}`,
    })
    const latency = Date.now() - start
    totalLatencyMs += latency

    const answer = res.answer || ''
    const answerLower = answer.toLowerCase()
    const citedPlaceIds = (res.citedPlaces || []).map((p) => p.id)

    let testPassed = true
    let failureReasons = []

    // 1. Refusal Check
    if (item.must_refuse) {
      refusalEligible++
      const isRefused =
        res.isRefusal ||
        answerLower.includes("don't have verified information") ||
        answerLower.includes('ధృవీకరించబడిన సమాచారం లేదు') ||
        answerLower.includes('सत्यापित जानकारी नहीं') ||
        answerLower.includes('சரிபார்க்கப்பட்ட தகவல் என்னிடம் இல்லை')

      if (isRefused) {
        refusalHits++
      } else {
        testPassed = false
        failureReasons.push('Expected honest refusal for unknown/fictional entity, but model attempted to answer')
      }
    } else {
      // 2. Retrieval Hit-Rate Check
      if (item.expected_place_id) {
        retrievalEligible++
        const hit = citedPlaceIds.includes(item.expected_place_id) ||
                    (res.sources || []).some((s) => s.placeId === item.expected_place_id)
        if (hit) {
          retrievalHits++
        } else {
          testPassed = false
          failureReasons.push(`Expected place "${item.expected_place_id}" in retrieval, got: ${JSON.stringify(citedPlaceIds)}`)
        }
      }

      // 3. Groundedness Keyword Check
      if (Array.isArray(item.expected_keywords) && item.expected_keywords.length > 0) {
        const hasKeywords = item.expected_keywords.some((kw) =>
          answer.toLowerCase().includes(kw.toLowerCase())
        )
        if (hasKeywords) {
          groundednessHits++
        } else {
          testPassed = false
          failureReasons.push(`Expected keywords [${item.expected_keywords.join(', ')}] not found in answer`)
        }
      }

      // 4. Multilingual Check
      if (item.expected_language) {
        languageEligible++
        if (res.language === item.expected_language) {
          languageMatches++
        } else {
          testPassed = false
          failureReasons.push(`Expected language "${item.expected_language}", got "${res.language}"`)
        }
      }
    }

    if (testPassed) {
      resultsByCategory[category].passed++
      console.log(`  ✓ [${item.id}] [${category.toUpperCase()}] "${item.query.slice(0, 48)}..." (${latency}ms)`)
    } else {
      console.warn(`  ✗ [${item.id}] [${category.toUpperCase()}] "${item.query.slice(0, 48)}..." (${latency}ms)`)
      failureReasons.forEach((r) => console.warn(`      -> ${r}`))
    }
  }

  // Calculate Metrics
  const retrievalHitRate = retrievalEligible > 0 ? (retrievalHits / retrievalEligible) * 100 : 100
  const groundednessRate = (groundednessHits / (totalQuestions - refusalEligible)) * 100
  const refusalAccuracy = refusalEligible > 0 ? (refusalHits / refusalEligible) * 100 : 100
  const avgLatency = Math.round(totalLatencyMs / totalQuestions)
  const languageAccuracy = languageEligible > 0 ? (languageMatches / languageEligible) * 100 : 100

  console.log('\n======================================================')
  console.log('📊 EXPLOREX RAG BENCHMARK EVALUATION REPORT')
  console.log('======================================================')
  console.log(`Total Test Questions:        ${totalQuestions}`)
  console.log(`Retrieval Hit-Rate:          ${retrievalHitRate.toFixed(1)}% (Threshold: >= 90.0%)`)
  console.log(`Groundedness Score:          ${groundednessRate.toFixed(1)}% (Threshold: >= 90.0%)`)
  console.log(`Refusal Accuracy:            ${refusalAccuracy.toFixed(1)}% (Threshold: >= 95.0%)`)
  console.log(`Language Accuracy:           ${languageAccuracy.toFixed(1)}%`)
  console.log(`Average Query Latency:       ${avgLatency} ms`)
  console.log('------------------------------------------------------')
  console.log('Breakdown by Category:')
  for (const [cat, data] of Object.entries(resultsByCategory)) {
    const pct = ((data.passed / data.total) * 100).toFixed(1)
    console.log(`  • ${cat.padEnd(14)}: ${data.passed}/${data.total} passed (${pct}%)`)
  }
  console.log('======================================================\n')

  const passed =
    retrievalHitRate >= 90.0 &&
    groundednessRate >= 90.0 &&
    refusalAccuracy >= 95.0

  if (!passed) {
    console.error('❌ RAG Benchmark failed to meet quality thresholds.')
    process.exit(1)
  }

  console.log('✅ ALL RAG EVALUATION BENCHMARKS PASSED SUCCESSFULLY!\n')
}

runRAGEval().catch((err) => {
  console.error('Fatal evaluation runner error:', err)
  process.exit(1)
})
