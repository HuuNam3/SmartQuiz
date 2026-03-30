'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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
  const [isReviewing, setIsReviewing] = useState(false)
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

  const handleReview = () => {
    setIsReviewing(true)
    setCurrentQuestion(0)
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
    const resultPercentage = (user.score / MAX_SCORE) * 100
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center shadow-lg">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Bạn đã hoàn thành bài trắc nghiệm!</h2>
              <p className="text-gray-600">Mỗi học sinh chỉ được làm bài 1 lần.</p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg mb-6">
              <p className="text-lg text-gray-600 mb-2">Kết quả của bạn:</p>
              <div className={cn(
                "text-5xl font-bold mb-2",
                resultPercentage >= 80 ? "text-green-600" :
                  resultPercentage >= 50 ? "text-amber-600" : "text-red-600"
              )}>
                {user.score}/{MAX_SCORE}
              </div>
              <div className={cn(
                "inline-block px-4 py-2 rounded-full text-sm font-semibold",
                resultPercentage >= 80 ? "bg-green-100 text-green-700" :
                  resultPercentage >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
              )}>
                {resultPercentage >= 80 ? "Xuất sắc!" :
                  resultPercentage >= 50 ? "Khá tốt!" : "Cần cố gắng thêm!"}
              </div>
            </div>

            <Button
              onClick={handleGoToProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Xem hồ sơ học sinh
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const score = calculateScore()
  const scorePercentage = (score / quizzes.length) * 100

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">Trắc Nghiệm</h1>
          <p className="text-center text-gray-600 mb-4">
            Học sinh: <span className="font-semibold text-blue-600">{user.name}</span> - Lớp: <span className="font-semibold text-blue-600">{user.class}</span>
          </p>
        </div>

        {isTimeUp && !showScore ? (
          <Card className="p-8 text-center shadow-lg bg-red-50 border-2 border-red-300">
            <h2 className="text-3xl font-bold text-red-600 mb-6">Hết thời gian!</h2>
            <p className="text-lg text-gray-700 mb-8">
              Thời gian làm bài 6 phút của bạn đã hết. Bài làm của bạn sẽ được nộp tự động.
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Xem Kết Quả
            </Button>
          </Card>
        ) : showScore ? (
          <Card className="p-8 text-center shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Kết quả của bạn</h2>
            <p className="text-lg text-gray-600 mb-6">
              {user.name} - Lớp {user.class}
            </p>
            <div className="mb-8">
              <div className={cn(
                "text-7xl font-bold mb-4",
                scorePercentage >= 80 ? "text-green-600" :
                  scorePercentage >= 50 ? "text-amber-600" : "text-red-600"
              )}>
                {score}/{quizzes.length}
              </div>
              <p className="text-xl text-gray-600 mb-4">
                Bạn trả lời đúng {score} trong {quizzes.length} câu hỏi
              </p>
              <div className={cn(
                "inline-block px-6 py-3 rounded-full text-lg font-semibold",
                scorePercentage >= 80 ? "bg-green-100 text-green-700" :
                  scorePercentage >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
              )}>
                {scorePercentage >= 80 ? "Xuất sắc!" :
                  scorePercentage >= 50 ? "Khá tốt!" : "Cần cố gắng thêm!"}
              </div>
            </div>

            <Button
              onClick={handleGoToProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Xem hồ sơ học sinh
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Question Navigator */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="p-4 shadow-lg sticky top-4">
                <h3 className="font-semibold text-gray-700 mb-4 text-center">Danh sách câu hỏi</h3>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {quizzes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleGoToQuestion(index)}
                      className={cn(
                        "w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200",
                        currentQuestion === index
                          ? "bg-blue-600 text-white ring-2 ring-blue-300"
                          : answers[index] !== null
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="text-sm text-gray-600 space-y-1 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
                    <span>Đã trả lời ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
                    <span>Chưa trả lời ({unansweredCount})</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t space-y-2">
                  <Button
                    onClick={handleReview}
                    variant="outline"
                    className="w-full"
                    disabled={answeredCount === 0}
                  >
                    Kiểm tra lại
                  </Button>
                  <Button
                    onClick={handleSubmitClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Nộp bài
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Question Area */}
            <div className="lg:col-span-3 order-1 lg:order-2">
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
                    <div className={`text-lg font-bold px-4 py-2 rounded-lg ${timeLeft <= 60
                      ? 'bg-red-100 text-red-700 animate-pulse'
                      : 'bg-blue-100 text-blue-700'
                      }`}>
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${timePercentage > 20 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${timePercentage}%` }}
                    ></div>
                  </div>
                </div>

                {isReviewing && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                    <p className="text-amber-700 text-sm font-medium">
                      Chế độ kiểm tra - Bạn có thể thay đổi đáp án trước khi nộp bài
                    </p>
                  </div>
                )}

                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Câu {currentQuestion + 1}: {quizzes[currentQuestion].question}
                </h2>

                <div className="space-y-4 mb-8">
                  {quizzes[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      className={cn(
                        "w-full p-4 text-left rounded-lg font-medium transition-all duration-200 border-2",
                        answers[currentQuestion] === index
                          ? "bg-blue-100 border-blue-500 text-blue-800"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      )}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 mr-3 text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={handlePrev}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="px-6"
                  >
                    Câu trước
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestion === quizzes.length - 1}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    Câu tiếp
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Xác nhận nộp bài</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              Xác nhận nộp bài trắc nghiệm
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-base space-y-3 text-muted-foreground">
            <span className="block">Bạn đã trả lời <strong className="text-blue-600">{answeredCount}/{quizzes.length}</strong> câu hỏi.</span>
            {unansweredCount > 0 && (
              <span className="block text-amber-600 font-medium">
                Còn {unansweredCount} câu chưa trả lời. Bạn có muốn tiếp tục nộp bài?
              </span>
            )}
            <span className="block text-gray-600">Sau khi nộp bài, bạn không thể thay đổi đáp án.</span>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Quay lại</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} className="bg-green-600 hover:bg-green-700">
              Nộp bài
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
