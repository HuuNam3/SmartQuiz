'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useStudent } from '@/context/student-context'

const quizzes = [
  {
    id: 1,
    question: 'Thủ đô của Việt Nam là?',
    options: ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'],
    correct: 1,
  },
  {
    id: 2,
    question: '2 + 2 bằng bao nhiêu?',
    options: ['3', '4', '5', '6'],
    correct: 1,
  },
  {
    id: 3,
    question: 'Ai là tác giả của Truyện Kiều?',
    options: ['Nguyễn Ánh', 'Nguyễn Du', 'Nguyễn Huệ', 'Nguyễn Khải'],
    correct: 1,
  },
]

const QUIZ_DURATION = 15 * 60 // 15 phút tính bằng giây

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const router = useRouter()
  const { studentInfo } = useStudent()

  // Timer effect
  useEffect(() => {
    if (isTimeUp || showScore) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimeUp, showScore])

  // Kiểm tra nếu không có studentInfo, redirect về trang chủ
  useEffect(() => {
    if (!studentInfo) {
      router.push('/')
    }
  }, [studentInfo, router])

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index)
    if (index === quizzes[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < quizzes.length) {
      setCurrentQuestion(nextQuestion)
      setSelectedAnswer(null)
    } else {
      setShowScore(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setTimeLeft(QUIZ_DURATION)
    setIsTimeUp(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const timePercentage = (timeLeft / QUIZ_DURATION) * 100

  if (!studentInfo) {
    return null // Sẽ redirect bằng useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">Trắc Nghiệm</h1>
          <p className="text-center text-gray-600 mb-4">
            Học sinh: <span className="font-semibold text-blue-600">{studentInfo.name}</span> - Lớp: <span className="font-semibold text-blue-600">{studentInfo.className}</span>
          </p>
        </div>

        {isTimeUp && !showScore ? (
          <Card className="p-8 text-center shadow-lg bg-red-50 border-2 border-red-300">
            <h2 className="text-3xl font-bold text-red-600 mb-6">Hết thời gian!</h2>
            <p className="text-lg text-gray-700 mb-8">
              Thời gian làm bài 15 phút của bạn đã hết. Hãy xem kết quả của bạn dưới đây.
            </p>
            <Button
              onClick={() => {
                setShowScore(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Xem Kết Quả
            </Button>
          </Card>
        ) : showScore ? (
          <Card className="p-8 text-center shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Kết quả của bạn</h2>
            <p className="text-lg text-gray-600 mb-6">
              {studentInfo.name} - Lớp {studentInfo.className}
            </p>
            <div className="mb-8">
              <p className="text-6xl font-bold text-blue-600 mb-4">
                {score}/{quizzes.length}
              </p>
              <p className="text-xl text-gray-600">
                Bạn trả lời đúng {score} trong {quizzes.length} câu hỏi
              </p>
            </div>
            <Button
              onClick={handleRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Làm lại
            </Button>
          </Card>
        ) : (
          <Card className="p-8 shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4 items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Câu {currentQuestion + 1}/{quizzes.length}
                  </span>
                  <div className="w-48 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / quizzes.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`text-lg font-bold px-4 py-2 rounded-lg ${
                  timeLeft <= 60
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  Thời gian: {formatTime(timeLeft)}
                </div>
              </div>
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    timePercentage > 20 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${timePercentage}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {quizzes[currentQuestion].question}
            </h2>

            <div className="space-y-4 mb-8">
              {quizzes[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 text-left rounded-lg font-medium transition-all duration-200 ${
                    selectedAnswer === null
                      ? 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                      : index === quizzes[currentQuestion].correct
                      ? 'bg-green-200 text-green-800'
                      : index === selectedAnswer
                      ? 'bg-red-200 text-red-800'
                      : 'bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null || isTimeUp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {currentQuestion === quizzes.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
