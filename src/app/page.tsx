'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useStudent } from '@/context/student-context'
import ConfirmationModal from '@/components/confirmation-modal'

export default function Home() {
  const [name, setName] = useState('')
  const [className, setClassName] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showQuizWarning, setShowQuizWarning] = useState(false)
  const [showProfileWarning, setShowProfileWarning] = useState(false)
  const router = useRouter()
  const { studentInfo, setStudentInfo, isAdmin, allStudentRecords, clearStudentInfo } = useStudent()

  const exportToExcel = () => {
    if (allStudentRecords.length === 0) {
      alert('Chưa có học sinh nào làm bài!')
      return
    }
    
    // Create CSV content
    const headers = ['STT', 'Họ và tên', 'Lớp', 'Điểm', 'Ngày làm bài']
    const rows = allStudentRecords.map((record, index) => [
      index + 1,
      record.name,
      record.className,
      `${record.score}/${record.totalQuestions}`,
      record.completedAt.toLocaleDateString('vi-VN')
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    // Add BOM for UTF-8 encoding
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ket_qua_trac_nghiem_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && className.trim()) {
      // Hiển thị modal xác nhận thay vì redirect ngay
      setShowConfirmation(true)
    }
  }

  const handleConfirm = () => {
    // Chỉ lưu thông tin, không chuyển hướng
    setStudentInfo({
      name,
      className,
    })
    setShowConfirmation(false)
  }

  const handleEdit = () => {
    setShowConfirmation(false)
  }

  const handleQuizClick = () => {
    if (!studentInfo) return
    setShowQuizWarning(true)
  }

  const handleProfileClick = () => {
    if (!studentInfo) return
    setShowProfileWarning(true)
  }

  const handleQuizConfirm = () => {
    setShowQuizWarning(false)
    const quizStartTime = Date.now()
    setStudentInfo({
      ...studentInfo!,
      quizStartTime,
    })
    router.push('/quiz')
  }

  const handleProfileConfirm = () => {
    setShowProfileWarning(false)
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      {showConfirmation && (
        <ConfirmationModal
          studentName={name}
          studentClass={className}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
        />
      )}

      {showQuizWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <Card className="p-8 max-w-md shadow-2xl bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Xác nhận vào Trắc nghiệm</h2>
            <p className="text-gray-600 mb-2">Học sinh: <span className="font-semibold">{studentInfo?.name}</span></p>
            <p className="text-gray-600 mb-6">Lớp: <span className="font-semibold">{studentInfo?.className}</span></p>
            <p className="text-gray-700 mb-6">Bạn có muốn vào làm bài trắc nghiệm? Thời gian làm bài là 15 phút.</p>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowQuizWarning(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Hủy
              </Button>
              <Button
                onClick={handleQuizConfirm}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Vào làm bài
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showProfileWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <Card className="p-8 max-w-md shadow-2xl bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Xem Hồ sơ Học sinh</h2>
            <p className="text-gray-600 mb-2">Học sinh: <span className="font-semibold">{studentInfo?.name}</span></p>
            <p className="text-gray-600 mb-6">Lớp: <span className="font-semibold">{studentInfo?.className}</span></p>
            <p className="text-gray-700 mb-6">Bạn có muốn xem hồ sơ cá nhân của mình?</p>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowProfileWarning(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Hủy
              </Button>
              <Button
                onClick={handleProfileConfirm}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Xem hồ sơ
              </Button>
            </div>
          </Card>
        </div>
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
          {!studentInfo ? (
            <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Thông tin học sinh</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
                    Lớp
                  </label>
                  <Input
                    id="className"
                    type="text"
                    placeholder="Nhập lớp của bạn (vd: 10A, 11B)"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isAdmin 
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                }`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isAdmin ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    )}
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isAdmin ? 'Quản trị viên' : 'Xin chào!'}
                </h2>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-600">Họ và tên:</span>
                  <span className="font-semibold text-gray-800 ml-auto">{studentInfo.name}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-gray-600">Lớp:</span>
                  <span className="font-semibold text-gray-800 ml-auto">{studentInfo.className}</span>
                </div>
              </div>
              
              {isAdmin && (
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <p className="text-amber-800 font-semibold">Chế độ Quản trị viên</p>
                    </div>
                    <p className="text-amber-700 text-sm">Số học sinh đã làm bài: <strong className="text-lg">{allStudentRecords.length}</strong></p>
                  </div>
                  <Button
                    onClick={exportToExcel}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Xuất file Excel (CSV)
                  </Button>
                </div>
              )}

              <Button
                onClick={clearStudentInfo}
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
              disabled={!studentInfo}
              className={`w-full text-left transition-all duration-300 ${
                studentInfo
                  ? 'cursor-pointer hover:shadow-2xl hover:scale-[1.02]'
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <Card className={`p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-xl border-0 ${
                studentInfo ? 'ring-2 ring-amber-200' : ''
              }`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Trắc nghiệm</h3>
                    <p className="text-gray-600 mb-4 text-sm">Kiểm tra kiến thức của bạn thông qua các bài trắc nghiệm được thiết kế bao quát và toàn diện.</p>
                    <p className={`text-sm font-semibold flex items-center gap-2 ${studentInfo ? 'text-amber-600' : 'text-gray-500'}`}>
                      {studentInfo ? (
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
              disabled={!studentInfo}
              className={`w-full text-left transition-all duration-300 ${
                studentInfo
                  ? 'cursor-pointer hover:shadow-2xl hover:scale-[1.02]'
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <Card className={`p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 shadow-xl border-0 ${
                studentInfo ? 'ring-2 ring-purple-200' : ''
              }`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Hồ sơ Học sinh</h3>
                    <p className="text-gray-600 mb-4 text-sm">Xem và quản lý thông tin hồ sơ cá nhân, kết quả học tập và các thành tích của bạn.</p>
                    <p className={`text-sm font-semibold flex items-center gap-2 ${studentInfo ? 'text-purple-600' : 'text-gray-500'}`}>
                      {studentInfo ? (
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
