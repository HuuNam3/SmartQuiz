'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { UserType, useUser } from '@/context/user-context'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CheckCircle2, Clock, BookOpen, ChevronLeft, ChevronRight, Send, Trophy, Zap, Brain, Star, Flame, Target } from 'lucide-react'

// Ngân hàng 10 câu hỏi
const allQuestions = [
  {
    id: 1,
    question:
      'Trong vùng Nội thủy, tàu thuyền nước ngoài nghiễm nhiên có quyền "đi qua không gây hại" tương tự như ở vùng Lãnh hải.',
    options: ['Đúng', 'Sai'],
    correct: 1,
  },
  {
    id: 2,
    question:
      'Ranh giới ngoài của vùng Tiếp giáp lãnh hải (cách đường cơ sở 24 hải lý) được coi là biên giới quốc gia trên biển của Việt Nam.',
    options: ['Đúng', 'Sai'],
    correct: 1,
  },
  {
    id: 3,
    question:
      'Tại vùng Đặc quyền kinh tế (200 hải lý), Việt Nam có quyền chủ quyền đối với cả tài nguyên sinh vật và tài nguyên không sinh vật ở cột nước và đáy biển.',
    options: ['Đúng', 'Sai'],
    correct: 0,
  },
  {
    id: 4,
    question:
      'Mọi hoạt động nghiên cứu khoa học của tổ chức quốc tế tại vùng Đặc quyền kinh tế Việt Nam chỉ cần thông báo cho Việt Nam biết là có thể thực hiện.',
    options: ['Đúng', 'Sai'],
    correct: 1,
  },
  {
    id: 5,
    question:
      'Nếu Việt Nam không có khả năng khai thác hết tài nguyên ở Thềm lục địa, các quốc gia khác có quyền tự do đến khai thác phần dư thừa đó.',
    options: ['Đúng', 'Sai'],
    correct: 1,
  },
  {
    id: 6,
    question:
      'Một hành vi vi phạm pháp luật về y tế xảy ra tại vùng Tiếp giáp lãnh hải vẫn có thể bị lực lượng chức năng Việt Nam bắt giữ và xử lý.',
    options: ['Đúng', 'Sai'],
    correct: 0,
  },
  {
    id: 7,
    question:
      'Tàu thuyền nước ngoài khi đi qua Lãnh hải Việt Nam được quyền tiến hành các hoạt động nghiên cứu, đo đạc nếu thiết bị đó không gây ô nhiễm môi trường biển.',
    options: ['Đúng', 'Sai'],
    correct: 1,
  },
  {
    id: 8,
    question:
      'Việt Nam có quyền chủ quyền đối với tất cả các loài sinh vật sống trong vùng nước phía trên Thềm lục địa, dù vùng đó nằm ngoài 200 hải lý.',
    options: ['Đúng', 'Sai'],
    correct: 1,
  },
  {
    id: 9,
    question:
      'Mọi đảo nhân tạo, thiết bị và công trình do nước ngoài xây dựng trong vùng Đặc quyền kinh tế của Việt Nam mà không có sự đồng ý của Chính phủ Việt Nam đều được coi là bất hợp pháp.',
    options: ['Đúng', 'Sai'],
    correct: 0,
  },
  {
    id: 10,
    question:
      'Người dân địa phương có quyền tự do xây dựng các khu nuôi trồng thủy sản cố định trong nội thủy vì đây là vùng nước tiếp giáp đất liền, không thuộc quản lý của Luật Biển.',
    options: ['Đúng', 'Sai'],
    correct: 1,
  },
]

const QUIZ_COUNT = 6
const MAX_SCORE = 6
const QUIZ_DURATION = 6 * 60 * 1000 // 15 phút tính bằng giây

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ_COUNT).fill(null))
  const [showScore, setShowScore] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const router = useRouter()
  const { user, setUser, fetchUsers } = useUser()

  // Lấy ngẫu nhiên 10 câu từ 20 câu hỏi (chỉ chạy 1 lần khi component mount)
  const quizzes = useMemo(() => {
    return shuffleArray(allQuestions).slice(0, QUIZ_COUNT)
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/')
    }

  }, [user, router])

  // Timer effect
  useEffect(() => {
    if (isTimeUp || showScore) return

    if (user?.startTime) {
      const endTime =
        user.startTime + QUIZ_DURATION;

      const remainingSeconds = Math.floor(
        (endTime - Date.now()) / 1000
      );

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLeft(
        remainingSeconds > 0
          ? remainingSeconds
          : 0
      );
    } else {
      setTimeLeft(QUIZ_DURATION / 1000);
    }

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
  }, [isTimeUp, showScore, user?.startTime])

  const calculateScore = useCallback((): number => {
    return answers.reduce<number>((score, answer, index) => {
      if (answer === quizzes[index]?.correct) {
        return score + 1
      }
      return score
    }, 0)
  }, [answers, quizzes])

  useEffect(() => {
    if (!isTimeUp || !user) return
    const finalScore = calculateScore()

    const submitQuiz = async () => {
      try {
        await fetch(`/api/users`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId: user.classId,
            score: finalScore,
            first: false,
          }),
        });
        fetchUsers()
      } catch (error) {
        console.error("Failed to save user:", error);
      }
    }

    submitQuiz()
  }, [isTimeUp, calculateScore, user, fetchUsers])

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (user?.endTime && user?.score >= 5 && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const particles: Array<{
        x: number
        y: number
        vx: number
        vy: number
        life: number
        color: string
      }> = []

      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * 8 + 4,
          life: 1,
          color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][
            Math.floor(Math.random() * 5)
          ],
        })
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach((p) => {
          p.y += p.vy
          p.vy += 0.2
          p.life -= 0.01

          ctx.fillStyle = p.color
          ctx.globalAlpha = p.life
          ctx.fillRect(p.x, p.y, 8, 8)
        })

        if (particles.some((p) => p.life > 0)) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }
  }, [user?.endTime, user?.score])

  if (!user) {
    return null
  }

  const handleAnswerClick = (index: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = index
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCurrentQuestion(0)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestion(index)
  }

  const handleSubmitClick = () => {
    setShowSubmitConfirm(true)
  }

  const handleConfirmSubmit = async () => {
    if (!user) return
    try {
      const finalScore = calculateScore()
      const data: UserType = {
        ...user,
        endTime: Date.now(),
        score: finalScore,
        updatedAt: new Date(),
      }
      await fetch(`/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: user.classId,
          score: finalScore,
          first: false,
        }),
      });
      setUser(data)
      setShowSubmitConfirm(false)
      setShowScore(true)
      fetchUsers()
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  }

  const handleGoToProfile = () => {
    router.push('/profile')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const timePercentage = timeLeft ? (timeLeft / QUIZ_DURATION) * 100 : 0

  const answeredCount = answers.filter(a => a !== null).length
  const unansweredCount = quizzes.length - answeredCount

  // Nếu đã hoàn thành bài trắc nghiệm, hiển thị thông báo
  if (user.endTime) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-12 px-4 flex items-center justify-center relative overflow-hidden">
        {user.score >= 5 && (
          <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
          />
        )}
        <div className="max-w-2xl mx-auto w-full relative z-20">
          <Card className="p-8 text-center shadow-lg border-0 relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-bl from-purple-100 to-transparent rounded-full blur-3xl opacity-50"></div>
            <div className="relative z-10">
              <div className="mb-6">
                {user.score >= 5 ? (
                  <div className="animate-bounce">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Star className="w-12 h-12 text-white animate-spin" />
                    </div>
                  </div>
                ) : user.score >= 3 ? (
                  <div className="animate-pulse">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg">
                      <Target className="w-12 h-12 text-white" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg">
                      <Trophy className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Hoàn thành bài trắc nghiệm!
              </h2>
              {user.score >= 5 && (
                <p className="text-lg font-bold text-yellow-600 mb-2">Xuất sắc! 🎉</p>
              )}
              <p className="text-gray-500 text-sm">Mỗi học sinh chỉ được làm bài 1 lần</p>

              <div className="p-8 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl mb-6 mt-8 border border-blue-200">
                <p className="text-sm text-gray-600 font-medium mb-3">KẾT QUẢ CỦA BẠN</p>
                <div className={cn(
                  "text-6xl font-black mb-3 text-balance",
                  user.score >= 5 ? "bg-linear-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent" :
                    user.score >= 3 ? "bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent" :
                    "bg-linear-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent"
                )}>
                  {user.score}/{MAX_SCORE}
                </div>
                <div className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold",
                  user.score >= 5 ? "bg-yellow-100 text-yellow-700" :
                    user.score >= 3 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                )}>
                  {user.score >= 5 ? (
                    <>
                      <Flame className="w-4 h-4" />
                      Xuất sắc!
                    </>
                  ) : user.score >= 3 ? (
                    <>
                      <Target className="w-4 h-4" />
                      Khá tốt!
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Cố gắng lên!
                    </>
                  )}
                </div>
              </div>

              <Button
                onClick={handleGoToProfile}
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Xem hồ sơ học sinh
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const score = calculateScore()
  const scorePercentage = (score / quizzes.length) * 100

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Trắc Nghiệm Chuyên Đề</h1>
          </div>
          <div className="flex items-center justify-center gap-4 text-gray-700">
            <span>👤 <span className="font-semibold text-blue-600">{user.name}</span></span>
            <span className="text-gray-400">•</span>
            <span>📚 <span className="font-semibold text-blue-600">Lớp {user.class}</span></span>
          </div>
        </div>

        {isTimeUp && !showScore ? (
          <Card className="p-8 text-center shadow-lg bg-red-50 border-2 border-red-300">
            <Clock className="w-16 h-16 text-red-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-3xl font-bold text-red-700 mb-4">Hết thời gian!</h2>
            <p className="text-lg text-red-600 mb-8">
              ⏰ Thời gian làm bài của bạn đã kết thúc. Bài làm sẽ được nộp tự động.
            </p>
            <Button
              onClick={() => {
                const newScore = calculateScore()
                setUser({
                  ...user,
                  score: newScore
                })
                setShowScore(true)
              }}
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
            >
              Xem Kết Quả
            </Button>
          </Card>
        ) : showScore ? (
          <Card className="p-8 text-center shadow-lg bg-white border-0">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Kết quả của bạn</h2>
            <p className="text-lg text-gray-600 mb-8">
              {user.name} • Lớp {user.class}
            </p>
            <div className="mb-8 p-8 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className={cn(
                "text-7xl font-black mb-4",
                scorePercentage >= 80 ? "text-green-600" :
                  scorePercentage >= 50 ? "text-amber-600" : "text-blue-600"
              )}>
                {score}/{quizzes.length}
              </div>
              <p className="text-lg text-gray-700 mb-4">
                ✓ Bạn trả lời đúng <span className="font-bold text-green-600">{score}</span> trong <span className="font-bold text-blue-600">{quizzes.length}</span> câu
              </p>
              <div className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-bold",
                scorePercentage >= 80 ? "bg-green-100 text-green-700" :
                  scorePercentage >= 50 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
              )}>
                {scorePercentage >= 80 ? "🎉 Xuất sắc!" :
                  scorePercentage >= 50 ? "👍 Khá tốt!" : "💪 Cố gắng lên!"}
              </div>
            </div>

            <Button
              onClick={handleGoToProfile}
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Xem hồ sơ học sinh
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Question Navigator */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="p-5 shadow-lg sticky top-4 bg-white border-blue-200 border">
                <h3 className="font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Danh sách câu
                </h3>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {quizzes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleGoToQuestion(index)}
                      className={cn(
                        "w-11 h-11 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-110",
                        currentQuestion === index
                          ? "bg-linear-to-br from-purple-600 to-blue-600 text-white ring-2 ring-blue-300 shadow-md"
                          : answers[index] !== null
                            ? "bg-linear-to-br from-green-500 to-emerald-500 text-white border-2 border-green-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="text-sm text-gray-700 space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <span>Đã trả lời (<span className="font-bold text-green-600">{answeredCount}</span>)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-gray-200"></div>
                    <span>Chưa trả lời (<span className="font-bold text-orange-600">{unansweredCount}</span>)</span>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-gray-200">
                  <Button
                    onClick={handleSubmitClick}
                    className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-md transition-all duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Nộp bài
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Question Area */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <Card className="p-8 shadow-lg bg-white border-blue-200 border">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4 items-center">
                      <span className="text-sm font-bold text-white bg-blue-600 px-3 py-1 rounded-full">
                        Câu {currentQuestion + 1}/{quizzes.length}
                      </span>
                      <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-linear-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 shadow-md"
                          style={{ width: `${((currentQuestion + 1) / quizzes.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className={cn(
                      "text-lg font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300",
                      timeLeft <= 60
                        ? 'bg-red-100 text-red-700 animate-pulse border-2 border-red-300'
                        : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    )}>
                      <Clock className="w-5 h-5" />
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        timePercentage > 20 ? 'bg-linear-to-r from-green-500 to-emerald-500' : 'bg-linear-to-r from-red-500 to-orange-500'
                      )}
                      style={{ width: `${timePercentage}%` }}
                    ></div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
                  <span className="text-blue-600">Câu {currentQuestion + 1}:</span> {quizzes[currentQuestion].question}
                </h2>

                <div className="space-y-4 mb-10">
                  {quizzes[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      className={cn(
                        "w-full p-5 text-left rounded-lg font-semibold transition-all duration-200 border-2 transform hover:scale-102 hover:shadow-md",
                        answers[currentQuestion] === index
                          ? "bg-linear-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-md ring-2 ring-blue-300"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                      )}
                    >
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 mr-4 text-base font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between gap-4">
                  <Button
                    onClick={handlePrev}
                    disabled={currentQuestion === 0}
                    className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 border disabled:opacity-50"
                    variant="outline"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Câu trước
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="px-8 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-md transition-all duration-300"
                  >
                    Câu tiếp
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <AlertDialogContent className="bg-white border-blue-200 border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-gray-800 flex items-center gap-2">
              <Send className="w-6 h-6 text-blue-600" />
              Xác nhận nộp bài
            </AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              Xác nhận nộp bài trắc nghiệm
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-base space-y-4 text-gray-700">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <span className="block">✓ Bạn đã trả lời <strong className="text-green-600">{answeredCount}/{quizzes.length}</strong> câu hỏi.</span>
              {unansweredCount > 0 && (
                <span className="block text-amber-600 font-medium mt-2">
                  ⚠️ Còn {unansweredCount} câu chưa trả lời. Bạn có muốn tiếp tục nộp bài?
                </span>
              )}
              <span className="block text-red-600 text-sm">🔒 Sau khi nộp bài, bạn không thể thay đổi đáp án.</span>
            </div>
          </div>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300">
              ← Quay lại
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold">
              <Send className="w-4 h-4 mr-2" />
              Nộp bài
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
