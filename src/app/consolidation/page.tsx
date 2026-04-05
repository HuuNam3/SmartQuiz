'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle2, Lock, Unlock, Trash2, Brain, Star, Send, AlertCircle } from 'lucide-react'
import { useUser, /*UserType*/ } from '@/context/user-context'
// import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface StationQuestion {
  id: string
  question: string
  singleDrag?: boolean
  options: string[]
  answers: string | string[]
  type: 'single' | 'multiple' | 'dragdrop'
  dragItems?: string[]
  correctItems?: string | string[]
}

interface StationData {
  id: number
  title: string
  color: string
  questions: StationQuestion[]
  unlockCode?: string
}

type Code = {
  StationCode: number
  code: string
  used: boolean
}

const stationsData: StationData[] = [
  {
    id: 1,
    title: 'Vùng Nội Thủy Việt Nam',
    color: 'blue',
    questions: [
      {
        id: 'q1',
        question: 'Vùng nước nằm giữa bờ biển và đường cơ sở được gọi là:',
        options: ['A. Lãnh hải', 'B. Vùng tiếp giáp lãnh hải', 'C. Nội thủy', 'D. Vùng đặc quyền kinh tế'],
        answers: 'C',
        type: 'single',
      },
      {
        id: 'q2',
        question: 'Điểm giống nhau giữa vùng Nội thủy và Lãnh thổ đất liền của nước ta là:',
        options: ['A. Đều có diện tích cố định không thay đổi theo thủy triều', 'B. Quốc gia thực hiện chủ quyền hoàn toàn và tuyệt đối', 'C. Tàu thuyền nước ngoài được tự do đi lại không cần xin phép', 'D. Đều nằm phía ngoài đường cơ sở thẳng'],
        answers: 'B',
        type: 'single',
      },
      {
        id: 'q3',
        question: 'Việc Nhà nước ta xác định đường cơ sở thẳng thay vì dùng đường bờ biển có ý nghĩa quan trọng nhất là:',
        options: ['A. Giúp mở rộng diện tích vùng nội thủy tại những nơi có bờ biển khúc khuỷu', 'B. Làm cho vùng nội thủy có chiều rộng cố định là 12 hải lý', 'C. Cho phép tàu thuyền nước ngoài được tự do đi lại', 'D. Biến toàn bộ vùng biển Đông thành vùng nội thủy'],
        answers: 'A',
        type: 'single',
      },
      {
        id: 'q4',
        question: 'Một tàu nghiên cứu của nước ngoài muốn vào vùng nước trong vịnh Bắc Bộ (nội thủy Việt Nam) để đo đạc. Tàu phải làm gì?',
        options: ['A. Cứ đi vào vì đây là vùng biển quốc tế', 'B. Chỉ cần thông báo cho trạm radar gần nhất', 'C. Phải xin phép và được sự đồng ý của cơ quan có thẩm quyền Việt Nam', 'D. Được quyền đi qua không gây hại mà không cần xin phép'],
        answers: 'C',
        type: 'single',
      },
      {
        id: 'q5',
        question: 'Ranh giới phía ngoài của nội thủy chính là:',
        options: ['A. Ranh giới ngoài của lãnh hải', 'B. Đường bờ biển', 'C. Đường cơ sở', 'D. Vạch cách bờ 200 hải lý'],
        answers: 'A',
        type: 'single',
      },
    ],
    unlockCode: '1',
  },
  {
    id: 2,
    title: 'Vùng Lãnh Hải',
    color: 'purple',
    questions: [
      {
        id: 'q1',
        question: 'Ranh giới phía ngoài của lãnh hải Việt Nam được xác định là:',
        options: ['A. Đường cơ sở của nước ta', 'B. Biên giới quốc gia trên biển', 'C. Ranh giới vùng tiếp giáp lãnh hải', 'D. Đường bờ biển'],
        answers: 'B',
        type: 'single',
      },
      {
        id: 'q2',
        question: 'Điểm khác biệt quan trọng nhất của Lãnh hải so với Nội thủy là:',
        options: ['A. Lãnh hải rộng hơn nội thủy rất nhiều', 'B. Lãnh hải không thuộc chủ quyền của quốc gia', 'C. Tàu thuyền nước ngoài có quyền đi qua không gây hại', 'D. Lãnh hải chỉ tính cho các đảo xa bờ'],
        answers: 'C',
        type: 'single',
      },
      {
        id: 'q3',
        question: 'Khi một tàu buôn nước ngoài xả thải dầu trong lãnh hải Việt Nam, hành động nào của lực lượng chức năng là đúng luật?',
        options: ['A. Không được can thiệp vì tàu có quyền đi qua không gây hại', 'B. Phải xin ý kiến của Liên Hợp Quốc', 'C. Có quyền ngăn chặn, xử phạt vì tàu đã mất quyền "không gây hại"', 'D. Chỉ được phép nhắc nhở và yêu cầu tàu đi nhanh'],
        answers: 'C',
        type: 'single',
      },
      {
        id: 'q4',
        question: 'Một hòn đảo xa bờ (không trong hệ thống đường cơ sở thẳng) sẽ có các vùng biển nào:',
        options: ['A. Chỉ có vùng nội thủy quanh đảo', 'B. Có lãnh hải, vùng tiếp giáp, vùng đặc quyền kinh tế và thềm lục địa riêng', 'C. Chỉ có vùng đặc quyền kinh tế 200 hải lý', 'D. Không có các vùng biển riêng vì quá xa'],
        answers: 'B',
        type: 'single',
      },
      {
        id: 'q5',
        question: 'Điểm khác biệt về ranh giới ngoài giữa Nội thủy và Lãnh hải là:',
        options: ['A. Nội thủy là đường bờ biển, lãnh hải là đường cơ sở', 'B. Nội thủy là 12 hải lý, lãnh hải là 24 hải lý', 'C. Nội thủy là đường cơ sở, lãnh hải là biên giới quốc gia trên biển', 'D. Cả hai đều chung ranh giới ngoài là đường cơ sở thẳng'],
        answers: 'C',
        type: 'single',
      },
    ],
    unlockCode: '2',
  },
  {
    id: 3,
    title: 'Giải Mã Vùng Tiếp Giáp Lãnh Hải',
    color: 'cyan',
    questions: [
      {
        id: 'q1',
        question: 'Vùng tiếp giáp lãnh hải có chiều rộng tính từ đường cơ sở là:',
        options: ['12 hải lý', '24 hải lý', '200 hải lý'],
        answers: '24 hải lý',
        type: 'dragdrop',
        dragItems: ['12 hải lý', '24 hải lý', '200 hải lý'],
        correctItems: '24 hải lý',
      },
      {
        id: 'q2',
        question: 'Tại vùng tiếp giáp lãnh hải, Nhà nước ta thực hiện các quyền:',
        options: ['Quyền tuyệt đối', 'Quyền sở hữu', 'Quyền kiểm soát'],
        answers: 'Quyền kiểm soát',
        type: 'dragdrop',
        dragItems: ['Quyền tuyệt đối', 'Quyền sở hữu', 'Quyền kiểm soát'],
        correctItems: 'Quyền kiểm soát',
      },
      {
        id: 'q3',
        question: 'Việt Nam kiểm soát vùng tiếp giáp để ngăn ngừa vi phạm về: (Chọn các ý đúng)',
        options: ['Thuế quan', 'Y tế', 'Khai thác cá', 'Nhập cư', 'Thăm dò dầu khí'],
        answers: ['Thuế quan', 'Y tế', 'Nhập cư'],
        type: 'dragdrop',
        dragItems: ['Thuế quan', 'Y tế', 'Khai thác cá', 'Nhập cư', 'Thăm dò dầu khí'],
        correctItems: ['Thuế quan', 'Y tế', 'Nhập cư'],
      },
      {
        id: 'q4',
        question: 'Ranh giới ngoài của vùng tiếp giáp lãnh hải là ranh giới phía biển của:',
        options: ['Biên giới quốc gia', 'Vùng quyền chủ quyền', 'Đất liền'],
        answers: 'Vùng quyền chủ quyền',
        type: 'dragdrop',
        dragItems: ['Biên giới quốc gia', 'Vùng quyền chủ quyền', 'Đất liền'],
        correctItems: 'Vùng quyền chủ quyền',
      },
      {
        id: 'q5',
        question: 'Khi phát hiện tàu nước ngoài buôn lậu bỏ chạy ra vùng tiếp giáp, lực lượng chức năng có:',
        options: ['Quyền im lặng', 'Quyền truy đuổi', 'Quyền đứng nhìn'],
        answers: 'Quyền truy đuổi',
        type: 'dragdrop',
        dragItems: ['Quyền im lặng', 'Quyền truy đuổi', 'Quyền đứng nhìn'],
        correctItems: 'Quyền truy đuổi',
      },
    ],
    unlockCode: '3',
  },
  {
    id: 4,
    title: 'Chinh Phục Đặc Quyền Kinh Tế & Thềm Lục Địa',
    color: 'green',
    questions: [
      {
        id: 'q1',
        question: 'Vùng đặc quyền kinh tế bao gồm cột nước và đáy biển 200 hải lý, trong khi Thềm lục địa chỉ tính phần:',
        options: ['Mặt nước biển', 'Đáy biển và lòng đất dưới đáy biển', 'Vùng trời'],
        answers: 'Đáy biển và lòng đất dưới đáy biển',
        type: 'dragdrop',
        dragItems: ['Mặt nước biển', 'Đáy biển và lòng đất dưới đáy biển', 'Vùng trời'],
        correctItems: 'Đáy biển và lòng đất dưới đáy biển',
      },
      {
        id: 'q2',
        question: 'Tại vùng đặc quyền kinh tế, Việt Nam có quyền chủ quyền đối với việc khai thác:',
        options: ['Mọi tài nguyên thiên nhiên', 'Chỉ khoáng sản', 'Chỉ các loài cá'],
        answers: 'Mọi tài nguyên thiên nhiên',
        type: 'dragdrop',
        dragItems: ['Mọi tài nguyên thiên nhiên', 'Chỉ khoáng sản', 'Chỉ các loài cá'],
        correctItems: 'Mọi tài nguyên thiên nhiên',
      },
      {
        id: 'q3',
        question: 'Nếu Việt Nam không thăm dò, khai thác thềm lục địa thì:',
        options: ['Quốc tế được tự do khai thác', 'Không ai được quyền khai thác nếu không có sự đồng ý của Việt Nam'],
        answers: 'Không ai được quyền khai thác nếu không có sự đồng ý của Việt Nam',
        type: 'dragdrop',
        dragItems: ['Quốc tế được tự do khai thác', 'Không ai được quyền khai thác nếu không có sự đồng ý của Việt Nam'],
        correctItems: 'Không ai được quyền khai thác nếu không có sự đồng ý của Việt Nam',
      },
      {
        id: 'q4',
        question: 'Trong vùng đặc quyền kinh tế, tàu thuyền nước ngoài được hưởng quyền:',
        options: ['Thăm dò tài nguyên', 'Tự do hàng hải và hàng không', 'Xây dựng đảo nhân tạo'],
        answers: 'Tự do hàng hải và hàng không',
        type: 'dragdrop',
        dragItems: ['Thăm dò tài nguyên', 'Tự do hàng hải và hàng không', 'Xây dựng đảo nhân tạo'],
        correctItems: 'Tự do hàng hải và hàng không',
      },
      {
        id: 'q5',
        question: 'Điều gì là sai về quyền của nước ngoài ở vùng đặc quyền kinh tế?',
        options: ['Đánh bắt cá trái phép', 'Đặt cáp ngầm tự do', 'Nghiên cứu khoa học biển'],
        answers: 'Nghiên cứu khoa học biển',
        type: 'dragdrop',
        dragItems: ['Đánh bắt cá trái phép', 'Đặt cáp ngầm tự do', 'Nghiên cứu khoa học biển'],
        correctItems: 'Nghiên cứu khoa học biển',
      },
    ],
    unlockCode: '4',
  },
]

const colorClasses = {
  blue: 'from-blue-600 to-cyan-600',
  purple: 'from-purple-600 to-pink-600',
  cyan: 'from-cyan-500 to-blue-600',
  green: 'from-green-600 to-emerald-600',
}

const STATION_DURATION = 5 * 60 * 1000 // 5 phút (giây)

export default function ConsolidationPage() {
  const [currentStation, setCurrentStation] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Record<string, string | string[]>>>({})
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0])
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)
  const [unlockedStations, setUnlockedStations] = useState<number[]>([])
  const [unlockCode, setUnlockCode] = useState('')
  const [draggedItems, setDraggedItems] = useState<Record<string, string[]>>({})
  const [submittedStations, setSubmittedStations] = useState<Record<number, boolean>>({})
  const [failedStations, setFailedStations] = useState<Record<number, boolean>>({})
  const [showResultModal, setShowResultModal] = useState(false)
  const [stationPassed, setStationPassed] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(STATION_DURATION / 1000)
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false)
  const [selectedStation, setSelectedStation] = useState<number | null>(null)
  const dragRef = useRef<{ draggedItem: string; sourceIndex: number } | null>(null)
  // const router = useRouter()
  const { user/*, setUser, fetchUsers*/ } = useUser()

  const station = stationsData[currentStation]
  const question = station?.questions[currentQuestion]
  // const answerKey = `s${currentStation}q${currentQuestion}`
  const currentAnswer = answers[currentStation]?.[question.id] || ''

  // useEffect(() => {
  //   if (!user) {
  //     router.push('/')
  //   }
  // }, [user, router])

  useEffect(() => {
    const savedAnswer =
      answers[currentStation]?.[question.id]

    if (question?.type === 'dragdrop') {
      if (!savedAnswer) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraggedItems({})
        return
      }

      if (Array.isArray(savedAnswer)) {
        setDraggedItems({
          dropzone: savedAnswer,
        })
      } else {
        setDraggedItems({
          dropzone: [savedAnswer],
        })
      }
    }
  }, [currentStation, currentQuestion, answers, question?.id, question?.type])

  useEffect(() => {
    if (!user) return

    const failed: Record<number, boolean> = {}
    const submitted: Record<number, boolean> = {}

    // Nếu có endStep -> fail tại trạm đó
    if (user.endStep) {
      const step = Number(user.endStep) || 1

      const unlocked: number[] = Array.from(
        { length: step },
        (_, i) => i
      )

      // các trạm trước đó đã submit
      unlocked.forEach((i) => {
        submitted[i] = true
      })

      // chỉ khóa đúng trạm fail
      failed[step - 1] = true

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnlockedStations(unlocked)
      setFailedStations(failed)
      setSubmittedStations(submitted)

      return
    }

    // Không fail -> dùng passStep
    const step = Number(user.passStep) || 0

    const unlocked: number[] = Array.from(
      { length: step },
      (_, i) => i
    )

    // các trạm đã unlock coi như đã submit
    for (let i = 0; i < step - 1; i++) {
      submitted[i] = true
    }

    setCurrentStation(step - 1)

    setUnlockedStations(unlocked)
    setSubmittedStations(submitted)

  }, [user])

  useEffect(() => {
    if (user?.endStep || (!selectedStation && selectedStation !== 0)) return
    if (user?.timeStep) {
      const endTime =
        user.timeStep + STATION_DURATION;

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
      setTimeLeft(STATION_DURATION / 1000);
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)

          // hết giờ → tự động nộp
          // eslint-disable-next-line react-hooks/immutability
          handleSubmitStation()
          setIsTimeUp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStation])

  useEffect(() => {
    if (user?.endStep || !user || user.timeStep) return
    const handleTimeStep = async () => {
      // try {
      //   const data: UserType = {
      //     ...user,
      //     timeStep: Date.now(),
      //     updatedAt: new Date(),
      //   }
      //   await fetch(`/api/users`, {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       classId: user.classId,
      //       second: true,
      //     }),
      //   });
      //   setUser(data)
      //   fetchUsers()
      // } catch (error) {
      //   console.error("Failed to save user:", error);
      // }
    }
    handleTimeStep()
  }, [user])

  const handleAnswer = (answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStation]: {
        ...prev[currentStation],
        [question.id]: answer,
      },
    }))
  }

  const handleDragStart = (item: string, index: number) => {
    dragRef.current = { draggedItem: item, sourceIndex: index }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropZoneId: string) => {
    e.preventDefault()
    if (!dragRef.current) return

    const { draggedItem } = dragRef.current
    setDraggedItems((prev) => ({
      ...prev,
      [dropZoneId]: [...(prev[dropZoneId] || []), draggedItem],
    }))
  }

  const handleRemoveDraggedItem = (dropZoneId: string, index: number) => {
    setDraggedItems((prev) => ({
      ...prev,
      [dropZoneId]: prev[dropZoneId].filter((_, i) => i !== index),
    }))
  }

  const correctAnswersCount = (StationId: number) => {
    return (
      station?.questions.filter((q) => {
        const userAnswer = answers[StationId]?.[q.id]
        if (q.type === 'dragdrop') {
          if (typeof q.correctItems === 'string') {
            return userAnswer === q.correctItems
          } else {
            return (
              Array.isArray(userAnswer) &&
              userAnswer.length === q.correctItems?.length &&
              userAnswer.every((a) => q.correctItems?.includes(a))
            )
          }
        }
        return userAnswer === q.answers
      }).length
    )
  }


  // const isStationUnlocked = unlockedStations.includes(currentStation)
  // const canShowResults = correctAnswersCount >= 4

  const handleUnlockStation = async () => {
    try {
      const res = await fetch('/api/codes')
      const data = await res.json()

      // tìm mã trong database
      const foundCode = data.find(
        (c: Code) =>
          c.code === unlockCode
        // && c.stationCode === currentStation + 1
      )

      if (!foundCode) {
        toast.warning(`Mã mở khóa trạm ${currentStation + 1} chưa đúng!`)
        return
      }

      if (foundCode.used) {
        toast.error('Mã đã được sử dụng')
        return
      }

      setSelectedStation(currentStation)
      const nextStation = currentStation

      if (
        nextStation < stationsData.length &&
        !unlockedStations.includes(nextStation)
      ) {
        setUnlockedStations((prev) => [
          ...prev,
          nextStation,
        ])
      }

      // try {
      //   const passStep = currentStation + 2
      //   const data: UserType = {
      //     ...user,
      //     passStep,
      //     updatedAt: new Date(),
      //   }
      //   await fetch(`/api/users`, {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       classId: user?.classId,
      //       passStep,
      //     }),
      //   });
      //   setUser(data)
      //   fetchUsers()
      // } catch (error) {
      //   console.error("Failed to save user:", error);
      // }

      setShowUnlockDialog(false)
      setUnlockCode('')
      toast.success(`Đã mở khóa trạm ${currentStation + 1}!`)
      // put code used
      // await fetch('/api/codes', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     code: unlockCode
      //   })
      // })

    } catch (err) {
      console.log('Failed to fetch codes: ' + err)
    }
  }

  const handleNext = () => {
    if (currentQuestion < station.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setDraggedItems({})
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setDraggedItems({})
    }
  }

  const handleChangeStation = (stationId: number) => {
    if (failedStations[stationId]) return
    if (unlockedStations.includes(stationId)) {
      toast.warning('Đã mở khóa trạm này rồi!')
      return
    } else if (selectedStation) {
      toast.warning('Vui lòng làm xong trạm đang chọn!')
      return
    }
    setCurrentQuestion(0)
    setCurrentStation(stationId)
    setUnlockCode('')
    setShowUnlockDialog(true)
  }

  const handleSubmitStation = async () => {
    const passed = correctAnswersCount(currentStation) >= 4
    setScores(prev => {
      const newScores = [...prev]
      newScores[currentStation] = correctAnswersCount(currentStation)
      return newScores
    })
    setStationPassed(passed)
    setShowResultModal(true)
    if (!passed) {
      // setIsTimeUp(true)
      setFailedStations((prev) => ({
        ...prev,
        [currentStation]: true,
      }))

      // try {
      //   const endStep = currentStation + 1
      //   const data: UserType = {
      //     ...user,
      //     endStep,
      //     updatedAt: new Date(),
      //   }
      //   await fetch(`/api/users`, {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       classId: user?.classId,
      //       endStep,
      //     }),
      //   });
      //   setUser(data)
      //   fetchUsers()
      // } catch (error) {
      //   console.error("Failed to save user:", error);
      // }
    }
    setSubmittedStations((prev) => ({
      ...prev,
      [currentStation]: true,
    }))

    setSelectedStation(null)
    setTimeLeft(STATION_DURATION / 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Củng Cố Kiến Thức
            </h1>
          </div>
          <p className="text-gray-600">Chinh phục 4 trạm học tập với các câu hỏi kéo thả sáng tạo</p>
        </div>

        {/* Stations Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stationsData.map((st, idx) => {
            const isUnlocked = unlockedStations.includes(idx)
            const isFailed = failedStations[idx]
            const isPassed = submittedStations[idx]

            return (
              <button
                key={idx}
                onClick={() => handleChangeStation(idx)}
                // disabled={!isUnlocked || isFailed || isPassed}
                className={cn(
                  'p-4 rounded-lg font-bold text-center transition-all duration-300 transform',
                  isFailed ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105',
                  currentStation === idx
                    ? `bg-linear-to-br ${colorClasses[st.color as keyof typeof colorClasses]} text-white ring-2 ring-offset-2 ring-blue-300 shadow-lg`
                    : isPassed
                      ? 'bg-linear-to-br from-green-500 to-emerald-500 text-white border-2 border-green-300 shadow-md'
                      : isUnlocked
                        ? 'bg-white border-2 border-gray-200 text-gray-800 hover:border-blue-300'
                        : isFailed
                          ? 'bg-red-100 border-2 border-red-300 text-red-700'
                          : 'bg-gray-100 border-2 border-gray-300 text-gray-500'
                )}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {isFailed ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : isPassed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isUnlocked ? (
                    <Unlock className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                  Trạm {idx + 1}
                </div>
                <div className="text-xs">{st.title}</div>

                {/* Hiển thị điểm */}
                {(isFailed || isPassed) && (
                  <div
                    className={cn(
                      "mt-1 text-sm font-bold px-2 py-1 rounded-md",
                      isFailed ?
                        "bg-red-200 text-red-800 border border-red-400"
                        :
                        "bg-green-200 text-green-800 border border-green-400"
                    )}
                  >
                    {isFailed
                      ? `Chưa đạt: ${scores[idx]}/5 câu`
                      : `Đã đạt: ${scores[idx]}/5 câu`}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Main Station Content */}
        {!selectedStation && selectedStation !== 0 ? (
          <Card className="p-8 text-center shadow-lg bg-white border-blue-200 border">
            <Lock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Hãy chọn một trạm và nhập mã để mở khóa trạm!</h2>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="p-5 shadow-lg sticky top-4 bg-white border-blue-200 border">
                <h3 className="font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Danh sách câu
                </h3>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {station.questions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      className={cn(
                        'w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-110',
                        currentQuestion === idx
                          ? `bg-linear-to-br ${colorClasses[station.color as keyof typeof colorClasses]} text-white ring-2 ring-blue-300 shadow-md`
                          : answers[currentStation]?.[q.id]
                            ? 'bg-linear-to-br from-green-500 to-emerald-500 text-white border-2 border-green-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="text-sm text-gray-700 space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-linear-to-br from-green-500 to-emerald-500"></div>
                    <span>Đã trả lời ({Object.keys(answers[currentStation] || {}).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-200"></div>
                    <span>Chưa trả lời ({station.questions.length - Object.keys(answers[currentStation] || {}).length})</span>
                  </div>
                </div>
                {/* {currentStation === 3 ?
                  <Button
                    onClick={() => { router.push('/') }}
                    className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold"
                  >
                    Quay về làm bài trắc nghiệm ôn tập
                  </Button>
                  : <Button
                    onClick={() => { setShowUnlockDialog(true) }}
                    disabled={!submittedStations[currentStation] || unlockedStations.includes(currentStation + 1) || failedStations[currentStation]}
                    className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold"
                  >
                    {!submittedStations[currentStation]
                      ? 'Nộp bài trước'
                      : 'Mở khóa trạm'}
                  </Button>
                } */}
              </Card>
            </div>

            {/* Main Question Area */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <Card className="p-8 shadow-lg bg-white border-blue-200 border">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-white bg-blue-600 px-3 py-1 rounded-full">
                      Câu {currentQuestion + 1}/{station.questions.length}
                    </span>

                    {!isTimeUp &&
                      <div
                        className={cn(
                          "text-sm font-bold px-3 py-1 rounded-full",
                          timeLeft <= 30
                            ? "bg-red-600 text-white animate-pulse"
                            : "bg-orange-500 text-white"
                        )}
                      >
                        ⏱️ {formatTime(timeLeft)}
                      </div>
                    }
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-4 leading-relaxed">{question.question}</h2>

                {question.type === 'dragdrop' ? (
                  <div className="mb-8 space-y-6">
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'dropzone')}
                      className="border-3 border-dashed border-blue-300 bg-blue-50 rounded-lg p-6 min-h-32 flex flex-col justify-center items-center"
                    >
                      <p className="text-gray-600 font-semibold mb-4">Kéo câu trả lời vào đây</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {draggedItems['dropzone']?.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-linear-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md"
                          >
                            {item}
                            <button
                              onClick={!submittedStations[currentStation] ? () => handleRemoveDraggedItem('dropzone', idx) : () => { }}
                              className="hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Drag Items */}
                    <div className="space-y-3">
                      <p className="text-gray-600 font-semibold">Các lựa chọn:</p>
                      <div className="grid grid-cols-2 gap-3">
                        {question.dragItems?.map((item, idx) => (
                          <div
                            key={idx}
                            draggable={!submittedStations[currentStation]}
                            onDragStart={() =>
                              handleDragStart(item, idx)
                            }
                            onClick={() => {
                              if (submittedStations[currentStation]) return

                              setDraggedItems((prev) => ({
                                ...prev,
                                dropzone: [
                                  ...(prev["dropzone"] || []),
                                  item,
                                ],
                              }))
                            }}

                            className="bg-linear-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-4 font-semibold text-gray-700 cursor-grab hover:cursor-grabbing hover:border-blue-400 transition-all duration-200 transform hover:shadow-md"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const selected = draggedItems['dropzone'] || []
                        handleAnswer(selected.length === 1 ? selected[0] : selected)
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                    >
                      Xác Nhận
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 mb-10">
                    {question.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option.split('.')[0].trim())}
                        className={cn(
                          'w-full p-5 text-left rounded-lg font-semibold transition-all duration-200 border-2 transform hover:scale-102 hover:shadow-md',
                          currentAnswer === option.split('.')[0].trim()
                            ? `bg-linear-to-r ${colorClasses[station.color as keyof typeof colorClasses]} text-white border-transparent shadow-md`
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
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
                      disabled={currentQuestion === station.questions.length - 1}
                      className="px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all duration-300"
                    >
                      Câu tiếp
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>

                  <Button
                    onClick={() => setShowSubmitDialog(true)}
                    disabled={submittedStations[currentStation]}
                    className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Nộp Trạm
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Result Modal */}
        <AlertDialog open={showResultModal} onOpenChange={setShowResultModal}>
          <AlertDialogContent className="bg-white border-0 shadow-2xl">
            <div className="text-center">
              {stationPassed ? (
                <div className="mb-6 animate-bounce">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Star className="w-10 h-10 text-white animate-spin" />
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                  </div>
                </div>
              )}

              <AlertDialogTitle className={cn('text-3xl font-bold mb-2 text-balance', stationPassed ? 'text-green-600' : 'text-red-600')}>
                {stationPassed ? 'Chúc Mừng! 🎉' : 'Tiếc quá! 😢'}
              </AlertDialogTitle>

              <AlertDialogDescription className="text-lg text-gray-700 mb-4">
                {stationPassed
                  ? `Bạn đã trả lời đúng ${correctAnswersCount(currentStation)} câu! Bạn được điểm trạm này!`
                  : `Bạn chỉ trả lời đúng ${correctAnswersCount(currentStation)}/5 câu. Cần ${4 - correctAnswersCount(currentStation)} câu nữa để có điểm trạm này! .`}
              </AlertDialogDescription>
            </div>

            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => setShowResultModal(false)}
                className={stationPassed ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {stationPassed ? 'Tiếp Tục' : 'Đóng'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Unlock Dialog */}
        <AlertDialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
          <AlertDialogContent className="bg-white border-blue-200 border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl text-gray-800 flex items-center gap-2">
                <Unlock className="w-6 h-6 text-blue-600" />
                Nhập Mã Mở Khóa trạm {currentStation + 1}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="py-4">
              <input
                type="text"
                value={unlockCode}
                onChange={(e) => setUnlockCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã mở khóa"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-bold text-center text-lg tracking-wider focus:outline-none focus:border-blue-500"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleUnlockStation} className="bg-blue-600 hover:bg-blue-700">
                Mở Khóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={showSubmitDialog}
          onOpenChange={setShowSubmitDialog}
        >
          <AlertDialogContent>

            <AlertDialogHeader>
              <AlertDialogTitle>
                Xác nhận nộp bài
              </AlertDialogTitle>

              <AlertDialogDescription>
                Bạn đã trả lời:

                <span className="font-bold text-green-600 ml-1">
                  {Object.keys(answers[currentStation] || {}).length}/5 câu
                </span>

                <br />
                Bạn chỉ được nộp bài một lần.
                Bạn có chắc chắn muốn nộp bài?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>

              <AlertDialogCancel>
                Hủy
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={() => {
                  handleSubmitStation()
                  setShowSubmitDialog(false)
                }}
              >
                Xác nhận nộp
              </AlertDialogAction>

            </AlertDialogFooter>

          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}