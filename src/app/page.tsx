'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useUser, UserType } from '@/context/user-context'
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function Home() {
  const [classId, setClassId] = useState('')
  const [group, setGroup] = useState('')
  const [showQuizWarning, setShowQuizWarning] = useState(false)
  const [showCompletedWarning, setShowCompletedWarning] = useState(false)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editClassId, setEditClassId] = useState('')
  const [editGroup, setEditGroup] = useState('')
  const [pendingUser, setPendingUser] = useState<UserType | null>(null)
  const [, setVerifyMode] = useState<'login' | 'profile'>('login')
  const router = useRouter()
  const { fetchUsers, user, users, clearUser, setUser } = useUser()

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // const handleOpenVerifyDialog = () => {
  //   if (user) {
  //     setEditClassId(user.classId)
  //     setEditGroup(user.group || '')
  //     setShowVerifyDialog(true)
  //   }
  // }

  const handleEditInfo = async () => {
    if (!editGroup) {
      toast.warning('vui lòng chọn nhóm!')
      return
    }

    try {
      await fetch(`/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: editClassId,
          group: editGroup,
        }),
      });

      setUser({
        ...user!,
        classId: editClassId,
        group: editGroup
      })

      setShowVerifyDialog(false)
      setIsEditMode(false)
      toast.success('cập nhật thông tin thành công!')
      fetchUsers()
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error('cập nhật thông tin thất bại!')
    }
  }

  const exportToExcel = () => {
    if (users.length === 0) {
      alert('Chưa có học sinh nào làm bài!')
      return
    }

    const data = users
      .filter((user) => !user.admin) // bỏ admin
      .map((record, index) => {
        const start = record.startTime
          ? new Date(record.startTime)
          : null

        const end = record.endTime
          ? new Date(record.endTime)
          : null

        let duration = ''

        if (record.startTime && record.endTime) {
          const diffMs = record.endTime - record.startTime
          const minutes = Math.floor(diffMs / 60000)
          const seconds = Math.floor((diffMs % 60000) / 1000)

          duration = `${minutes} phút ${seconds} giây`
        }

        return {
          STT: index + 1,
          'Họ và tên': record.name,
          'Lớp': record.class,
          'Điểm': record.score,

          'Ngày làm bài': start
            ? start.toLocaleDateString('vi-VN')
            : '',

          'Thời gian bắt đầu': start
            ? start.toLocaleTimeString('vi-VN')
            : '',

          'Thời gian kết thúc': end
            ? end.toLocaleTimeString('vi-VN')
            : '',

          'Thời gian làm bài': duration,
        }
      })

    const worksheet = XLSX.utils.json_to_sheet(data)

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KetQua')

    const fileName = `ket_qua_trac_nghiem_${new Date()
      .toLocaleDateString('vi-VN')
      .replace(/\//g, '-')}.xlsx`

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    saveAs(blob, fileName)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!group) {
      toast.warning('vui lòng chọn nhóm!')
      return
    }
    const findUserGroup = users.find(
      (u) => u.classId === classId && u.group
    )
    clearUser()
    const findUser = users.find((u) => u.classId === classId)

    if (!findUserGroup) {
      if (!findUser) {
        toast.error('mã học sinh chưa đúng!')
        return
      }
      // Show verification dialog for new login
      const userToVerify = {
        ...findUser,
        group
      }
      setPendingUser(userToVerify)
      setEditClassId(userToVerify.classId)
      setEditGroup(userToVerify.group)
      setVerifyMode('login')
      setShowVerifyDialog(true)
    } else {
      // Show verification dialog for existing user
      setPendingUser(findUserGroup)
      setEditClassId(findUserGroup.classId)
      setEditGroup(findUserGroup.group || '')
      setVerifyMode('login')
      setShowVerifyDialog(true)
    }
  }

  const handleConfirmVerify = async () => {
    if (!pendingUser) return

    try {
      await fetch(`/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: pendingUser.classId,
          group: pendingUser.group,
        }),
      });

      setUser(pendingUser)
      setShowVerifyDialog(false)
      setIsEditMode(false)
      setPendingUser(null)
      toast.success('xác nhận thông tin thành công!')
      fetchUsers()
    } catch (error) {
      console.error("Failed to verify profile:", error);
      toast.error('xác nhận thông tin thất bại!')
    }
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

  const handleConfirmQuiz = async () => {
    if (user?.startTime) {
      setShowQuizWarning(false)
      router.push('/quiz')
      return
    }
    try {
      const data: UserType = {
        ...user!,
        startTime: Date.now(),
        score: 0,
      }
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
      });
      setUser(data)
      setShowQuizWarning(false)
      router.push('/quiz')
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  }

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

      {showVerifyDialog && (
        <AlertDialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl text-blue-600">
                {isEditMode ? 'Sửa thông tin học sinh' : 'Xác nhận thông tin học sinh'}
              </AlertDialogTitle>
              <AlertDialogDescription className="sr-only">
                {isEditMode ? 'Sửa thông tin của bạn' : 'Xác nhận lại thông tin học sinh'}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">
              {!isEditMode ? (
                <>
                  {pendingUser?.name && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                      <p className="text-sm text-gray-600 mb-1">Tên học sinh:</p>
                      <p className="font-semibold text-gray-800 text-lg">{pendingUser.name}</p>
                    </div>
                  )}
                  {pendingUser?.class && (
                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <p className="text-sm text-gray-600 mb-1">Lớp:</p>
                      <p className="font-semibold text-gray-800 text-lg">{pendingUser.class}</p>
                    </div>
                  )}
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Mã học sinh:</p>
                    <p className="font-semibold text-gray-800 text-lg">{editClassId}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Nhóm:</p>
                    <p className="font-semibold text-gray-800 text-lg">{editGroup}</p>
                  </div>
                  <p className="text-sm text-gray-700 text-center mt-4 font-medium">Thông tin của bạn đã chính xác chưa?</p>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã Học Sinh
                    </label>
                    <Input
                      type="text"
                      value={editClassId}
                      onChange={(e) => setEditClassId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nhóm
                    </label>
                    <Select
                      value={editGroup}
                      onValueChange={(value) => setEditGroup(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn nhóm của bạn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nhóm 1">Nhóm 1</SelectItem>
                        <SelectItem value="Nhóm 2">Nhóm 2</SelectItem>
                        <SelectItem value="Nhóm 3">Nhóm 3</SelectItem>
                        <SelectItem value="Nhóm 4">Nhóm 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <AlertDialogFooter>
              {!isEditMode ? (
                <>
                  <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                  <Button
                    onClick={() => setIsEditMode(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Sửa thông tin
                  </Button>
                  <AlertDialogAction onClick={handleConfirmVerify} className="bg-green-600 hover:bg-green-700">
                    Xác nhận
                  </AlertDialogAction>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditMode(false)}
                    variant="outline"
                  >
                    Quay lại
                  </Button>
                  <Button
                    onClick={handleEditInfo}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Lưu thay đổi
                  </Button>
                </>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {showCompletedWarning && (
        <AlertDialog open={showCompletedWarning} onOpenChange={setShowCompletedWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl text-red-600">Bạn đã hoàn thành bài trắc nghiệm!</AlertDialogTitle>
              <AlertDialogDescription className="sr-only">
                Thông báo về việc đã hoàn thành bài trắc nghiệm
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="text-base space-y-2 text-muted-foreground">
              <span className="block text-gray-700">Mỗi học sinh chỉ được làm bài trắc nghiệm <strong>1 lần</strong>.</span>
              <span className="block text-gray-600">Bạn đã hoàn thành bài làm của mình. Vui lòng xem kết quả trong phần Hồ sơ học sinh.</span>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Chào mừng đến với Hệ thống Quản lý Học sinh</h1>
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
                <h2 className="text-2xl font-bold text-gray-800">Thông tin học sinh</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Mã Học Sinh
                  </label>
                  <Input
                    id="classId"
                    type="text"
                    placeholder="Nhập mã của bạn"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
                    Nhóm
                  </label>
                  <Select
                    value={group}
                    onValueChange={(value) => setGroup(value)}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn nhóm của bạn" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Nhóm 1">Nhóm 1</SelectItem>
                      <SelectItem value="Nhóm 2">Nhóm 2</SelectItem>
                      <SelectItem value="Nhóm 3">Nhóm 3</SelectItem>
                      <SelectItem value="Nhóm 4">Nhóm 4</SelectItem>
                    </SelectContent>
                  </Select>

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
                  {user.admin ? 'Quản trị viên' : 'Xin chào!'}
                </h2>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-600">Mã học sinh:</span>
                  <span className="font-semibold text-gray-800 ml-auto">{user.classId}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-gray-600">Nhóm:</span>
                  <span className="font-semibold text-gray-800 ml-auto">{user.group}</span>
                </div>
              </div>

              {/* <Button
                onClick={handleOpenVerifyDialog}
                className="w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Xác nhận lại thông tin
              </Button> */}

              {user.admin && (
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <p className="text-amber-800 font-semibold">Chế độ Quản trị viên</p>
                    </div>
                    <p className="text-amber-700 text-sm">Số học sinh đã làm bài: <strong className="text-lg">{users.filter(
                      (u) => !u.admin && u.endTime !== undefined
                    ).length}</strong></p>
                  </div>
                  <Button
                    onClick={exportToExcel}
                    className="w-full bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Xuất file Excel (xlsx)
                  </Button>
                </div>
              )}

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
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Hồ sơ Học sinh</h3>
                    <p className="text-gray-600 mb-4 text-sm">Xem và quản lý thông tin hồ sơ cá nhân, kết quả học tập và các thành tích của bạn.</p>
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
