import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Highlighter, Send, BookOpen } from 'lucide-react'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../../api'

export default function ReadingExamInterface() {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const partParam = searchParams.get('part')

    const [mockData, setMockData] = useState(null)
    const [currentPart, setCurrentPart] = useState(partParam === 'all' ? 1 : parseInt(partParam) || 1)
    const [isFullMock, setIsFullMock] = useState(partParam === 'all')
    const [fontSize, setFontSize] = useState(16)
    const [isDark, setIsDark] = useState(false)
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [results, setResults] = useState(null)
    const [highlights, setHighlights] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [correctAnswers, setCorrectAnswers] = useState(null)

    const handleHighlightClick = () => {
        const selection = window.getSelection()
        if (!selection.toString()) return

        const range = selection.getRangeAt(0)
        const span = document.createElement('span')
        span.style.backgroundColor = 'rgb(253, 230, 138)'
        span.style.padding = '2px 4px'

        try {
            range.surroundContents(span)
        } catch (e) {
            const contents = range.extractContents()
            span.appendChild(contents)
            range.insertNode(span)
        }

        selection.removeAllRanges()
    }

    // Fetch reading mock data
    useEffect(() => {
        const fetchReadingData = async () => {
            try {
                setLoading(true)
                const response = await api.get(`/mock/reading/mock/${id}`)
                const mockData = response.data.mock
                setMockData(mockData)

                // Fetch correct answers
                const answerResponse = await api.get(`/mock/reading/answer/${id}`)
                setCorrectAnswers(answerResponse.data.answers)

                setError(null)
            } catch (err) {
                console.error('Error fetching reading data:', err)
                setError('Failed to load reading task. Please try again.')
                setMockData(null)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchReadingData()
        }
    }, [id])

    const handleAnswerChange = (part, index, value) => {
        setAnswers(prev => ({
            ...prev,
            [part]: {
                ...prev[part],
                [index]: value
            }
        }))
    }

    const handleSubmit = async () => {
        const results = {}
        let totalCorrect = 0
        let totalQuestions = 0

        Object.keys(mockData).forEach(part => {
            if (part.startsWith('part')) {
                const partData = mockData[part]
                const partAnswers = answers[part] || {}
                const partResults = []

                // Get correct answers from API response
                const partKey = part.replace('part', 'part')
                const apiCorrectAnswers = correctAnswers?.[partKey] || []

                if (partData.answers) {
                    // Part 1
                    partData.answers.forEach((correctAnswer, idx) => {
                        totalQuestions++
                        const userAnswer = partAnswers[idx]?.trim() || ''
                        const correct = userAnswer.toLowerCase() === correctAnswer.toLowerCase()
                        if (correct) totalCorrect++
                        partResults.push({
                            userAnswer: userAnswer || '(Not answered)',
                            correctAnswer: correctAnswer,
                            correct
                        })
                    })
                } else if (partData.questions) {
                    if (Array.isArray(partData.questions)) {
                        // Part 2, 3, 4, 5
                        partData.questions.forEach((q, idx) => {
                            totalQuestions++
                            const userAnswer = partAnswers[idx] || ''
                            const correct = userAnswer === q.answer
                            if (correct) totalCorrect++
                            partResults.push({
                                userAnswer: userAnswer || '(Not answered)',
                                correctAnswer: q.answer,
                                correct,
                                questionNum: q.num || idx + 1
                            })
                        })
                    }
                } else if (partData.trueFalse) {
                    partData.trueFalse.forEach((tf, idx) => {
                        totalQuestions++
                        const userAnswer = partAnswers[idx]
                        const correct = userAnswer === (tf.answer ? 'true' : 'false')
                        if (correct) totalCorrect++
                        partResults.push({
                            userAnswer: userAnswer || '(Not answered)',
                            correctAnswer: tf.answer ? 'True' : 'False',
                            correct,
                            statement: tf.statement
                        })
                    })
                }

                results[part] = partResults
            }
        })

        setResults({
            results,
            totalCorrect,
            totalQuestions,
            percentage: Math.round((totalCorrect / totalQuestions) * 100)
        })
        setSubmitted(true)
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading reading task...</p>
            </div>
        </div>
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    Retry
                </button>
            </div>
        </div>
    }

    if (!mockData) {
        return <div className="flex items-center justify-center h-screen text-gray-600">No reading data found</div>
    }

    const bgClass = isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    const containerClass = isDark ? 'bg-gray-800' : 'bg-gray-50'
    const borderClass = isDark ? 'border-gray-700' : 'border-gray-200'

    const renderPart = () => {
        const part = mockData[`part${currentPart}`]
        if (!part) return null
        console.log(part)
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Part {currentPart}</h2>
                    <p className="text-lg opacity-80">{part.task}</p>
                </div>

                {/* Part 1 */}
                {currentPart === 1 && (
                    <div className="space-y-6">
                        <div
                            className={`p-6 rounded-lg border ${containerClass} ${borderClass}`}
                        >
                            <div style={{ fontSize: `${fontSize}px`, lineHeight: '2' }} className="leading-relaxed select-text">
                                {(() => {
                                    const textParts = part.text.split(/(\(\d+\))/g)
                                    let gapIndex = 0

                                    return (
                                        <span>
                                            {textParts.map((segment, idx) => {
                                                const gapMatch = segment.match(/\((\d+)\)/)
                                                if (gapMatch) {
                                                    const currentGapIndex = gapIndex
                                                    gapIndex++
                                                    return (
                                                        <span key={idx}>
                                                            <span className="text-gray-500 font-semibold">({currentGapIndex + 1})</span>
                                                            <input
                                                                type="text"
                                                                value={answers.part1?.[currentGapIndex] || ''}
                                                                onChange={(e) => handleAnswerChange('part1', currentGapIndex, e.target.value)}
                                                                disabled={submitted}
                                                                style={{ fontSize: `${fontSize}px` }}
                                                                className={`inline-block w-24 mx-2 px-2 py-1 border-b-2 focus:outline-none text-center font-semibold transition ${submitted
                                                                    ? results.results.part1?.[currentGapIndex]?.correct
                                                                        ? 'border-green-500 bg-green-100 dark:bg-green-900/40'
                                                                        : 'border-red-500 bg-red-100 dark:bg-red-900/40'
                                                                    : 'border-blue-400 dark:border-blue-500 dark:bg-gray-600'
                                                                    }`}
                                                            />
                                                        </span>
                                                    )
                                                }
                                                return <span key={idx}>{segment}</span>
                                            })}
                                        </span>
                                    )
                                })()}
                            </div>

                            {highlights.length > 0 && (
                                <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                                    <p className="text-sm font-semibold mb-2">Highlights:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {highlights.map((h, idx) => (
                                            <span key={idx} className="bg-yellow-300 dark:bg-yellow-700 px-2 py-1 rounded text-xs">
                                                {h}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {submitted && (
                            <div className="space-y-2">
                                <h4 className="font-bold text-lg mb-4">Answer Review:</h4>
                                {results.results.part1?.map((r, idx) => (
                                    <div key={idx} className={`p-4 rounded-lg border-l-4 ${r.correct ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-red-50 dark:bg-red-900/20 border-red-500'}`}>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">Gap ({idx + 1})</span>
                                            <span className={`text-sm font-bold ${r.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {r.correct ? '✓ Correct' : '✗ Incorrect'}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm">
                                            <span className="opacity-75">Your answer:</span>
                                            <span className="ml-2 font-semibold">{r.userAnswer}</span>
                                        </p>
                                        {!r.correct && (
                                            <p className="mt-1 text-sm">
                                                <span className="opacity-75">Correct answer:</span>
                                                <span className="ml-2 font-semibold text-green-700 dark:text-green-300">{r.correctAnswer}</span>
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Part 2: Matching */}
                {currentPart === 2 && (
                    <div className="space-y-4">
                        {part.statements.map((q, idx) => (
                            <div key={idx} className={`p-4 rounded-lg border-2 ${borderClass} ${containerClass}`}>
                                <div className="flex gap-4 flex-col md:flex-row">
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">Question {q.num}</p>
                                        <p style={{ fontSize: `${fontSize}px` }} className="text-sm leading-relaxed">
                                            {q}
                                        </p>
                                    </div>
                                    <div className="md:w-48">
                                        <label className="block text-sm font-semibold mb-2">Select statement:</label>
                                        <select
                                            value={answers.part2?.[idx] || ''}
                                            onChange={(e) => handleAnswerChange('part2', idx, e.target.value)}
                                            disabled={submitted}
                                            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                        >
                                            <option value="">Select...</option>
                                            {part.statements.map((s, i) => (
                                                <option key={i} value={s.charAt(0)}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                        {submitted && (
                                            <div className="mt-2 text-sm">
                                                <p className={results.results.part2?.[idx]?.correct ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                                    {results.results.part2?.[idx]?.correct ? `✓ ${results.results.part2?.[idx]?.correctAnswer}` : `✗ Correct: ${results.results.part2?.[idx]?.correctAnswer}`}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Part 3: Headings */}
                {currentPart === 3 && (
                    <div className="space-y-4">
                        {part.paragraphs.map((para, idx) => (
                            <div key={idx} className={`p-4 rounded-lg border-2 ${borderClass} ${containerClass}`}>
                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">Paragraph {para.num}</p>
                                <p style={{ fontSize: `${fontSize}px` }} className="mb-4 leading-relaxed p-3 bg-gray-100 dark:bg-gray-700 rounded">
                                    {para}
                                </p>
                                <select
                                    value={answers.part3?.[idx] || ''}
                                    onChange={(e) => handleAnswerChange('part3', idx, e.target.value)}
                                    disabled={submitted}
                                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                >
                                    <option value="">Select heading...</option>
                                    {part.headings.map((h, i) => (
                                        <option key={i} value={h}>{h}</option>
                                    ))}
                                </select>
                                {submitted && (
                                    <p className={`mt-2 text-sm font-bold ${results.results.part3?.[idx]?.correct ? 'text-green-600' : 'text-red-600'}`}>
                                        {results.results.part3?.[idx]?.correct ? '✓ Correct' : `✗ Correct: ${results.results.part3?.[idx]?.correctAnswer}`}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Part 4: Multiple Choice + True/False */}
                {currentPart === 4 && (
                    <div className="space-y-8">
                        <span>{part.text}</span>
                        {/* ================= Multiple Choice ================= */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg border-b pb-2">
                                Multiple Choice Questions
                            </h3>

                            {part.questions &&
                                Object.values(part.questions)
                                    .filter(q => q.question && q.options)
                                    .map((q, idx) => (
                                        <div
                                            key={idx}
                                            className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                                        >
                                            <p
                                                style={{ fontSize: `${fontSize}px` }}
                                                className="font-semibold"
                                            >
                                                {idx + 1}. {q.question}
                                            </p>

                                            <div className="space-y-2 ml-4">
                                                {q.options.map((opt, optIdx) => (
                                                    <label
                                                        key={optIdx}
                                                        className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`part4-mcq-${idx}`}
                                                            value={opt}
                                                            checked={answers.part4?.[idx] === opt}
                                                            onChange={(e) =>
                                                                handleAnswerChange(
                                                                    'part4',
                                                                    idx,
                                                                    e.target.value
                                                                )
                                                            }
                                                            disabled={submitted}
                                                            className="w-4 h-4 mt-1"
                                                        />
                                                        <span style={{ fontSize: `${fontSize}px` }}>
                                                            {opt}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>

                                            {submitted && (
                                                <p
                                                    className={`text-sm ml-4 font-bold ${results.results.part4?.[idx]?.correct
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                        }`}
                                                >
                                                    {results.results.part4?.[idx]?.correct
                                                        ? '✓ Correct'
                                                        : `✗ Correct: ${results.results.part4?.[idx]?.correctAnswer
                                                        }`}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                        </div>

                        {/* ================= True / False / Not Given ================= */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg border-b pb-2">
                                True / False / Not Given
                            </h3>

                            {Array.isArray(part.questions?.true_or_false) &&
                                part.questions.true_or_false.map((statement, idx) => {
                                    const answerIndex =
                                        Object.values(part.questions).filter(
                                            q => q.question && q.options
                                        ).length + idx;

                                    return (
                                        <div
                                            key={idx}
                                            className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                                        >
                                            <p
                                                style={{ fontSize: `${fontSize}px` }}
                                                className="font-semibold"
                                            >
                                                {idx + 1}. {statement}
                                            </p>

                                            <div className="flex gap-4 ml-4">
                                                {['true', 'false', 'not given'].map(option => (
                                                    <label
                                                        key={option}
                                                        className="flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`part4-tf-${idx}`}
                                                            value={option}
                                                            checked={
                                                                answers.part4?.[answerIndex] === option
                                                            }
                                                            onChange={(e) =>
                                                                handleAnswerChange(
                                                                    'part4',
                                                                    answerIndex,
                                                                    e.target.value
                                                                )
                                                            }
                                                            disabled={submitted}
                                                            className="w-4 h-4"
                                                        />
                                                        <span
                                                            style={{ fontSize: `${fontSize}px` }}
                                                            className="capitalize"
                                                        >
                                                            {option}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>

                                            {submitted && (
                                                <p
                                                    className={`text-sm ml-4 font-bold ${results.results.part4?.[answerIndex]?.correct
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                        }`}
                                                >
                                                    {results.results.part4?.[answerIndex]?.correct
                                                        ? '✓ Correct'
                                                        : `✗ Correct: ${results.results.part4?.[answerIndex]
                                                            ?.correctAnswer
                                                        }`}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}


                {/* Part 5: Fill in + Multiple Choice */}
       {currentPart === 5 && (
  <div className="space-y-8">

    {/* ================= Text ================= */}
    <div className={`p-6 rounded-lg border ${containerClass} ${borderClass}`}>
      {typeof part.text === 'string' && (
        <p
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
          className="leading-relaxed select-text"
        >
          {part.text}
        </p>
      )}
    </div>

    {/* ================= Filling ================= */}
    {typeof part.filling === 'string' && (
      <div className="space-y-4">
        <h3 className="font-bold text-lg border-b pb-2">Fill in the gaps</h3>

        <p
          style={{ fontSize: `${fontSize}px` }}
          className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg leading-relaxed"
        >
          {part.filling}
        </p>

        {/* 27–30 inputs (static, chunki backendda array yo‘q) */}
        <div className="space-y-3">
          {[27, 28, 29, 30].map((num, idx) => (
            <div
              key={num}
              className="flex gap-3 items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
            >
              <span className="font-bold text-blue-600 dark:text-blue-400 w-12">
                ({num})
              </span>

              <input
                type="text"
                value={answers.part5?.[idx] || ''}
                onChange={(e) =>
                  handleAnswerChange('part5', idx, e.target.value)
                }
                disabled={submitted}
                style={{ fontSize: `${fontSize}px` }}
                className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Your answer..."
              />

              {submitted && (
                <span
                  className={`text-sm font-bold ${
                    results.results.part5?.[idx]?.correct
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {results.results.part5?.[idx]?.correct ? '✓' : '✗'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* ================= Multiple Choice ================= */}
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-b pb-2">Multiple Choice</h3>

      {part.questions &&
        Object.values(part.questions).map((q, idx) => {
          const answerIndex = 4 + idx; // filling 0–3, MCQ 4+

          return (
            <div
              key={idx}
              className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
            >
              <p
                style={{ fontSize: `${fontSize}px` }}
                className="font-semibold"
              >
                {idx + 1}. {q.question}
              </p>

              <div className="space-y-2 ml-4">
                {q.options.map((opt, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  >
                    <input
                      type="radio"
                      name={`part5-mcq-${idx}`}
                      value={opt}
                      checked={answers.part5?.[answerIndex] === opt}
                      onChange={(e) =>
                        handleAnswerChange(
                          'part5',
                          answerIndex,
                          e.target.value
                        )
                      }
                      disabled={submitted}
                      className="w-4 h-4 mt-1"
                    />
                    <span style={{ fontSize: `${fontSize}px` }}>{opt}</span>
                  </label>
                ))}
              </div>

              {submitted && (
                <p
                  className={`text-sm ml-4 font-bold ${
                    results.results.part5?.[answerIndex]?.correct
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {results.results.part5?.[answerIndex]?.correct
                    ? '✓ Correct'
                    : `✗ Correct: ${
                        results.results.part5?.[answerIndex]?.correctAnswer
                      }`}
                </p>
              )}
            </div>
          );
        })}
    </div>
  </div>
)}

            </div>
        )
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Header */}
            <div className={`sticky top-0 z-40 border-b ${borderClass} ${containerClass}`}>
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        <h1 className="text-xl font-bold">{mockData?.title}</h1>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Font Size Control */}
                        <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                                className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
                                title="Decrease font size"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm">{fontSize}</span>
                            <button
                                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                                className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
                                title="Increase font size"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Highlight Button */}
                        <button
                            onClick={handleHighlightClick}
                            disabled={submitted}
                            className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Highlight selected text - Select text first then click"
                        >
                            <Highlighter className="w-4 h-4" />
                            <span className="hidden sm:inline">Highlight</span>
                        </button>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            title="Toggle dark mode"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>

                        {/* Submit Button - Top Right */}
                        {!submitted && (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition transform hover:scale-105 ml-auto"
                            >
                                <Send className="w-5 h-5" />
                                <span className="hidden sm:inline">Submit</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className={`rounded-lg p-8 ${containerClass}`}>
                    {!submitted ? renderPart() : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold mb-2">Results</h2>
                                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {results.totalCorrect}/{results.totalQuestions}
                                </p>
                                <p className="text-2xl opacity-80">{results.percentage}% Correct</p>
                            </div>

                            <div className="grid grid-cols-5 gap-2 my-8">
                                {[1, 2, 3, 4, 5].map(part => {
                                    const partResults = results.results[`part${part}`]
                                    const correct = partResults?.filter(r => r.correct).length || 0
                                    const total = partResults?.length || 0
                                    return (
                                        <button
                                            key={part}
                                            onClick={() => setCurrentPart(part)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition ${currentPart === part
                                                ? 'border-blue-600 bg-blue-100 dark:bg-blue-900/30'
                                                : `border-gray-300 dark:border-gray-600`
                                                }`}
                                        >
                                            <p className="font-bold">Part {part}</p>
                                            <p className="text-sm opacity-75">{correct}/{total}</p>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-4">Part {currentPart} Details:</h3>
                                <div className="space-y-3">
                                    {results.results[`part${currentPart}`]?.map((r, idx) => (
                                        <div key={idx} className={`p-4 rounded-lg border-l-4 ${r.correct ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                                            <p className="font-semibold">
                                                {r.questionNum ? `Question ${r.questionNum}` : r.statement ? 'Statement' : `Question ${idx + 1}`}
                                            </p>
                                            {r.statement && <p className="text-sm opacity-75 mt-1">{r.statement}</p>}
                                            <p className="mt-2 text-sm"><span className="opacity-75">Your answer:</span> <span className={r.correct ? 'text-green-700 dark:text-green-300 font-bold' : 'text-red-700 dark:text-red-300 font-bold'}>{r.userAnswer}</span></p>
                                            {!r.correct && (
                                                <p className="mt-1 text-sm"><span className="opacity-75">Correct answer:</span> <span className="text-green-700 dark:text-green-300 font-bold">{r.correctAnswer}</span></p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            {!submitted && (
                <div className={`sticky bottom-0 border-t ${borderClass} ${containerClass} p-4`}>
                    <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
                        <div className="flex gap-2 flex-wrap">
                            {[1, 2, 3, 4, 5].map(part => (
                                <button
                                    key={part}
                                    onClick={() => setCurrentPart(part)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition ${currentPart === part
                                        ? 'bg-blue-600 text-white'
                                        : `bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600`
                                        }`}
                                >
                                    Part {part}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}