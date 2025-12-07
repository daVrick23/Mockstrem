import React, { useEffect, useState } from 'react'
import { FaDownload, FaShareAlt, FaClock, FaCheckCircle, FaAward, FaCrown, FaArrowLeft } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

export default function MockResult() {
  const { mockId, resultId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/mock/writing/result/${resultId}`)
        setResult(res.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching result:', err)
        setError('Failed to load result. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [resultId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error || 'Result not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const tasks = [
    {
      id: 'task1_1',
      title: 'Task 1.1 - Informal Note',
      wordLimit: '~50 words',
      userAnswer: result.task1?.task11_answer || '',
      score: result.task1?.task11_score || 0,
      maxScore: 10,
      feedback: result.task1?.task11_feedback || 'No feedback available',
    },
    {
      id: 'task1_2',
      title: 'Task 1.2 - Formal Letter',
      wordLimit: '120-150 words',
      userAnswer: result.task1?.task12_answer || '',
      score: result.task1?.task12_score || 0,
      maxScore: 10,
      feedback: result.task1?.task12_feedback || 'No feedback available',
    },
    {
      id: 'task2',
      title: 'Task 2 - Blog Post',
      wordLimit: '180-200 words',
      userAnswer: result.task2?.task2_answer || '',
      score: result.task2?.task2_score || 0,
      maxScore: 10,
      feedback: result.task2?.task2_feedback || 'No feedback available',
    },
  ]

  const totalScore = tasks.reduce((sum, task) => sum + task.score, 0)
  const maxTotalScore = tasks.reduce((sum, task) => sum + task.maxScore, 0)
  const percentage = Math.round((totalScore / maxTotalScore) * 100)

  const getBandScore = (percentage) => {
    if (percentage >= 90) return { band: 9, level: 'Proficient User' }
    if (percentage >= 75) return { band: 8, level: 'Very Good User' }
    if (percentage >= 60) return { band: 7, level: 'Good User' }
    if (percentage >= 50) return { band: 6, level: 'Competent User' }
    if (percentage >= 40) return { band: 5, level: 'Modest User' }
    return { band: 4, level: 'Limited User' }
  }

  const bandInfo = getBandScore(percentage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mb-4 transition-colors"
        >
          <FaArrowLeft /> Back to Results
        </button>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">CEFR Writing Mock Result</h1>
        <p className="text-gray-600 dark:text-gray-400">Exam Date: {new Date(result.created_at).toLocaleDateString()}</p>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Score */}
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{totalScore}/{maxTotalScore}</div>
            <p className="text-blue-100 text-lg font-semibold">Total Score</p>
            <p className="text-blue-200 text-sm mt-2">{percentage}% Correct</p>
          </div>

          {/* Band */}
          <div className="text-center border-l border-r border-white/30">
            <div className="flex justify-center mb-2">
              <FaAward className="text-4xl text-yellow-300" />
            </div>
            <div className="text-5xl font-bold mb-2">{bandInfo.band}</div>
            <p className="text-blue-100 text-sm">Band Score</p>
            <p className="text-yellow-200 font-semibold mt-2">{bandInfo.level}</p>
          </div>

          {/* Time */}
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <FaClock className="text-4xl" />
            </div>
            <div className="text-2xl font-bold mb-2">
              {Math.round((result.time_taken || 3600) / 60)} min
            </div>
            <p className="text-blue-100 text-sm">Time Taken</p>
          </div>
        </div>
      </div>

      {/* Task Results */}
      <div className="space-y-6 mb-8">
        {tasks.map((task, idx) => (
          <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Task Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.wordLimit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {task.score}/{task.maxScore}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round((task.score / task.maxScore) * 100)}%
                  </div>
                </div>
              </div>
              {/* Score Bar */}
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(task.score / task.maxScore) * 100}%` }}
                />
              </div>
            </div>

            {/* User's Answer */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-blue-600">✍️</span> Your Answer
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 max-h-48 overflow-y-auto">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {task.userAnswer}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Word Count: <span className="font-semibold">{task.userAnswer.split(/\s+/).filter(Boolean).length}</span>
              </p>
            </div>

            {/* Feedback */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-yellow-600">💡</span> Feedback & Suggestions
              </h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {task.feedback}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Premium CTA Section */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl shadow-2xl p-8 mb-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <FaCrown className="text-3xl text-yellow-300" />
              <h3 className="text-3xl font-bold">Want More Detailed Feedback?</h3>
            </div>
            <p className="text-lg text-white/90 mb-6">
              Upgrade to Premium to unlock AI-powered analysis, personalized improvement plans, and expert human reviews of your writing.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-yellow-300" />
                <span>Detailed AI Analysis on Grammar & Vocabulary</span>
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-yellow-300" />
                <span>Expert Human Review & Personalized Tips</span>
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-yellow-300" />
                <span>Unlimited Mock Exams & Progress Tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-yellow-300" />
                <span>CEFR Level Certification</span>
              </li>
            </ul>
          </div>

          {/* Action */}
          <div className="flex flex-col gap-4">
            <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <FaCrown /> Upgrade to Premium
            </button>
            <button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all border-2 border-white">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all">
          <FaDownload /> Download Report
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all">
          <FaShareAlt /> Share Result
        </button>
      </div>
    </div>
  )
}
