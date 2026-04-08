'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useUser, UserType } from '@/context/user-context'
import MusicPlayer from '@/components/MusicPlayer'
import { toast } from "sonner"

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

// import * as XLSX from 'xlsx'
// import { saveAs } from 'file-saver'

const QUIZ_ACCESS_CODE = 'OT123456'

export default function Home() {
  const [classId, setClassId] = useState('')
  const [showQuizWarning, setShowQuizWarning] = useState(false)
  const [showCompletedWarning, setShowCompletedWarning] = useState(false)
  const [showAccessCodeDialog, setShowAccessCodeDialog] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [accessError, setAccessError] = useState('')
  const router = useRouter()
  const { fetchUsers, user, users, clearUser, setUser } = useUser()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (!user) return
    if(user.admin) return
    const interval = setInterval(() => {
      fetch(`/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: user.classId,
          ping: true,
        }),
      })
    }, 5 * 1000)

    return () => clearInterval(interval)
  }, [user])

  // const exportToExcel = () => {
  //   if (users.length === 0) {
  //     alert('Chưa có nhóm nào làm bài!')
  //     return
  //   }

  //   const data = users
  //     .filter((user) => !user.admin) // bỏ admin
  //     .sort((a, b) => a.group - b.group) // sort từ nhỏ đến lớn theo stt
  //     .map((record) => {
  //       const start = record.startTime
  //         ? new Date(record.startTime)
  //         : null

  //       const end = record.endTime
  //         ? new Date(record.endTime)
  //         : null

  //       let duration = ''

  //       if (record.startTime && record.endTime) {
  //         const diffMs = record.endTime - record.startTime
  //         const minutes = Math.floor(diffMs / 60000)
  //         const seconds = Math.floor((diffMs % 60000) / 1000)

  //         duration = `${minutes} phút ${seconds} giây`
  //       }


  //       return {
  //         'Nhóm': record.group,
  //         'Lớp': record.class,
  //         'Điểm trạm 1': getScore(record?.scoreStep?.[0]),
  //         'Điểm trạm 2': getScore(record?.scoreStep?.[1]),
  //         'Điểm trạm 3': getScore(record?.scoreStep?.[2]),
  //         'Điểm trạm 4': getScore(record?.scoreStep?.[3]),
  //         'Điểm ôn tập': record.score,
  //         'Tổng điểm': totalScore(record),

  //         'Ngày làm bài': start
  //           ? start.toLocaleDateString('vi-VN')
  //           : '',

  //         'Thời gian bắt đầu': start
  //           ? start.toLocaleTimeString('vi-VN')
  //           : '',

  //         'Thời gian kết thúc': end
  //           ? end.toLocaleTimeString('vi-VN')
  //           : '',

  //         'Thời gian làm bài': duration,
  //       }
  //     })

  //   const worksheet = XLSX.utils.json_to_sheet(data)

  //   const workbook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'KetQua')

  //   const fileName = `ket_qua_trac_nghiem_${new Date()
  //     .toLocaleDateString('vi-VN')
  //     .replace(/\//g, '-')}.xlsx`

  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: 'xlsx',
  //     type: 'array',
  //   })

  //   const blob = new Blob([excelBuffer], {
  //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   })

  //   saveAs(blob, fileName)
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers()

    // chuẩn hóa input
    const normalizedClassId = classId.trim().toLowerCase()

    const findUser = users.find(
      (u) =>
        u.classId?.trim().toLowerCase() === normalizedClassId
    )

    clearUser()
    if (!findUser) {
      toast.error('Mã nhóm chưa đúng!')
      return
    }

    if (findUser?.ping && !findUser?.admin) {
      const now = Date.now()
      const isOnline = (now - Number(new Date(findUser.ping))) < 30 * 1000
      console.log(isOnline)
      if (isOnline) {
        toast.error('Mã đã được sử dụng ở nơi khác!')
        return
      } else {
        await fetch(`/api/users`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId: findUser.classId,
            ping: true,
          }),
        })
      }
    }

    toast.success('xác nhận mã nhóm thành công!')
    if (classId !== 'admin333') {
      router.push('/review')
    } else {
      router.push('/bashboard')
    }
    setUser(findUser)
  }

  const handleQuizClick = () => {
    if (!user || !users) return

    if (user?.endTime) {
      setShowCompletedWarning(true)
    } else {
      setShowQuizWarning(true)
    }
  }

  const handleProfileClick = () => {
    if (!user) return
    router.push('/profile')
  }

  const handleConfirmQuiz = () => {
    setShowQuizWarning(false)
    setShowAccessCodeDialog(true)
  }

  const handleVerifyAccessCode = async () => {
    if (!user) return
    if (accessCode !== QUIZ_ACCESS_CODE) {
      toast.warning('Mã chưa chính xác!')
      return
    }

    try {
      if (user?.startTime) {
        setShowAccessCodeDialog(false)
        router.push('/quiz')
        return
      }

      const data: UserType = {
        ...user!,
        startTime: Date.now(),
        score: 0,
      }

      if (!user.admin) {
        await fetch(`/api/users`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId: user?.classId,
            score: 0,
            first: true,
          }),
        })
      }


      setUser(data)
      setShowAccessCodeDialog(false)
      setAccessCode('')
      setAccessError('')

      router.push('/quiz')

    } catch (error) {
      console.error("Failed to save profile:", error)
    }
  }

  // const renderButton = ():ReactNode => {
  //   if(ADMIN === user.classId) {
  //     return (
  //       <Button
  //         onClick={exportToExcel}
  //         className="w-full bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
  //       >
  //         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  //         </svg>
  //         Xuất file Excel (xlsx)
  //       </Button>
  //     )
  //   } else {
  //     return ''
  //   }
  // }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      {showQuizWarning && (
        <AlertDialog open={showQuizWarning} onOpenChange={setShowQuizWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl text-amber-600">Lưu ý quan trọng!</AlertDialogTitle>
              <AlertDialogDescription className="sr-only">
                Thông tin về bài trắc nghiệm trước khi bắt đầu làm bài
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="text-base space-y-2 text-muted-foreground">
              <span className="block font-semibold text-gray-800">Bạn sắp vào phần Trắc nghiệm:</span>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Bài trắc nghiệm gồm <strong>6 câu hỏi</strong></li>
                <li>Thời gian làm bài: <strong>6 phút</strong></li>
                <li>Bạn có thể chọn đáp án cho tất cả các câu trước khi nộp bài</li>
                <li>Sau khi nộp bài, bạn không thể sửa lại đáp án</li>
                <li>kiểm tra lại thông tin cá nhân xem đã chính xác chưa</li>
                <li>chỉ được làm bài 1 lần bạn nên ôn tập trước khi vào làm</li>
              </ul>
              <span className="block text-amber-600 font-medium mt-3">Bạn có chắc chắn muốn bắt đầu?</span>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmQuiz} className="bg-blue-600 hover:bg-blue-700">
                Bắt đầu làm bài
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {showAccessCodeDialog && (
        <AlertDialog
          open={showAccessCodeDialog}
          onOpenChange={setShowAccessCodeDialog}
        >
          <AlertDialogContent className="sm:max-w-md rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl text-blue-600 text-center">
                Nhập mã để bắt đầu làm bài
              </AlertDialogTitle>

              <AlertDialogDescription className="sr-only">
                Nhập mã truy cập trước khi làm bài
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">

              <Input
                placeholder="Nhập mã truy cập..."
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value.toUpperCase())
                  setAccessError('')
                }}
                className="
            text-center
            text-lg
            font-semibold
            tracking-widest
          "
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleVerifyAccessCode()
                  }
                }}
              />

              {accessError && (
                <p className="text-red-600 text-sm text-center font-medium">
                  {accessError}
                </p>
              )}

            </div>

            <AlertDialogFooter>

              <AlertDialogCancel
                onClick={() => {
                  setAccessCode('')
                  setAccessError('')
                }}
              >
                Hủy
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleVerifyAccessCode}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Xác nhận
              </AlertDialogAction>

            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {showCompletedWarning && (
        <AlertDialog open={showCompletedWarning} onOpenChange={setShowCompletedWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl text-red-600">Nhóm bạn đã hoàn thành bài trắc nghiệm!</AlertDialogTitle>
              <AlertDialogDescription className="sr-only">
                Thông báo về việc đã hoàn thành bài trắc nghiệm
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="text-base space-y-2 text-muted-foreground">
              <span className="block text-gray-700">Mỗi nhóm chỉ được làm bài trắc nghiệm <strong>1 lần</strong>.</span>
              <span className="block text-gray-600">Nhóm bạn đã hoàn thành bài làm của mình. Vui lòng xem kết quả trong phần Hồ sơ nhóm học sinh.</span>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Đóng</AlertDialogCancel>
              <AlertDialogAction onClick={() => { setShowCompletedWarning(false); router.push('/profile') }} className="bg-blue-600 hover:bg-blue-700">
                Xem hồ sơ
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Chào mừng đến với Hệ thống ôn tập chủ quyền Biển đảo Việt Nam</h1>
          <p className="text-lg text-gray-600">Vui lòng nhập thông tin của bạn để tiếp tục</p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Form Section - Only show if no student info */}
          {!user ? (
            <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Thông tin nhóm của học sinh</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Mã đại diện nhóm Học Sinh
                  </label>
                  <Input
                    id="classId"
                    type="text"
                    placeholder="Nhập mã nhóm của bạn"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Xác nhận
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.admin
                  ? 'bg-linear-to-br from-amber-500 to-orange-600'
                  : 'bg-linear-to-br from-emerald-500 to-teal-600'
                  }`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {user.admin ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    )}
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.admin ? 'Giáo viên' : 'Xin chào!'}
                  <MusicPlayer name="Nen" loop />
                </h2>
              </div>

              {!user.admin
                ? <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-600">Nhóm:</span>
                    <span className="font-semibold text-gray-800 ml-auto">{user.group}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-gray-600">Lớp:</span>
                    <span className="font-semibold text-gray-800 ml-auto">{user.class}</span>
                  </div>
                </div>
                : <div className="space-y-4 mb-6">
                  <div className="p-4 bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <p className="text-amber-800 font-semibold">Chế độ Giáo viên</p>
                    </div>
                    <p className="text-amber-700 text-sm"><strong className="text-lg">Bạn có thể làm mọi thứ như học sinh nhưng nó sẽ không lưu lại</strong></p>
                  </div>
                </div>
              }

              <Button
                onClick={clearUser}
                variant="outline"
                className="w-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Đăng xuất
              </Button>
            </Card>
          )}

          {/* Info Section */}
          <div className="space-y-6">
            <button
              onClick={handleQuizClick}
              disabled={!user}
              className={`w-full text-left transition-all duration-300 ${user
                ? 'cursor-pointer hover:shadow-2xl hover:scale-[1.02]'
                : 'cursor-not-allowed opacity-60'
                }`}
            >
              <Card className={`p-6 bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-xl border-0 ${user ? 'ring-2 ring-amber-200' : ''
                }`}>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Trắc nghiệm</h3>
                    <p className="text-gray-600 mb-4 text-sm">Kiểm tra kiến thức của bạn thông qua các bài trắc nghiệm được thiết kế bao quát và toàn diện.</p>
                    <p className={`text-sm font-semibold flex items-center gap-2 ${user ? 'text-amber-600' : 'text-gray-500'}`}>
                      {user ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          Bấm để bắt đầu làm bài
                        </>
                      ) : 'Vui lòng nhập thông tin để bắt đầu'}
                    </p>
                  </div>
                </div>
              </Card>
            </button>

            <button
              onClick={handleProfileClick}
              disabled={!user}
              className={`w-full text-left transition-all duration-300 ${user
                ? 'cursor-pointer hover:shadow-2xl hover:scale-[1.02]'
                : 'cursor-not-allowed opacity-60'
                }`}
            >
              <Card className={`p-6 bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 shadow-xl border-0 ${user ? 'ring-2 ring-purple-200' : ''
                }`}>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Hồ sơ nhóm của Học sinh</h3>
                    <p className="text-gray-600 mb-4 text-sm">Xem và quản lý thông tin hồ sơ của nhóm, kết quả học tập và các thành tích của nhóm bạn.</p>
                    <p className={`text-sm font-semibold flex items-center gap-2 ${user ? 'text-purple-600' : 'text-gray-500'}`}>
                      {user ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          Bấm để xem hồ sơ
                        </>
                      ) : 'Vui lòng nhập thông tin để xem hồ sơ'}
                    </p>
                  </div>
                </div>
              </Card>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
