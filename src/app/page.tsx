'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useStudent } from '@/context/student-context'
import ConfirmationModal from '@/components/confirmation-modal'

export default function Home() {
  const [name, setName] = useState('')
  const [className, setClassName] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showQuizWarning, setShowQuizWarning] = useState(false)
  const [showProfileWarning, setShowProfileWarning] = useState(false)
  const router = useRouter()
  const { studentInfo, setStudentInfo } = useStudent()

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
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
          {/* Form Section */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin học sinh</h2>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
              >
                Xác nhận
              </Button>
            </form>
          </Card>

          {/* Info Section */}
          <div className="space-y-6">
            <button
              onClick={handleQuizClick}
              disabled={!studentInfo}
              className={`w-full text-left transition-all duration-200 ${
                studentInfo
                  ? 'cursor-pointer hover:shadow-xl hover:scale-105'
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <Card className={`p-6 bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg border-2 ${
                studentInfo ? 'border-blue-400' : 'border-dashed border-blue-300'
              }`}>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📝</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Trắc nghiệm</h3>
                    <p className="text-gray-600 mb-4 text-sm">Kiểm tra kiến thức của bạn thông qua các bài trắc nghiệm được thiết kế bao quát và toàn diện.</p>
                    <p className={`text-sm font-semibold ${studentInfo ? 'text-blue-600' : 'text-gray-500'}`}>
                      {studentInfo ? 'Bấm để bắt đầu làm bài' : 'Vui lòng nhập thông tin để bắt đầu'}
                    </p>
                  </div>
                </div>
              </Card>
            </button>

            <button
              onClick={handleProfileClick}
              disabled={!studentInfo}
              className={`w-full text-left transition-all duration-200 ${
                studentInfo
                  ? 'cursor-pointer hover:shadow-xl hover:scale-105'
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <Card className={`p-6 bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg border-2 ${
                studentInfo ? 'border-blue-400' : 'border-dashed border-blue-300'
              }`}>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">👤</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Hồ sơ Học sinh</h3>
                    <p className="text-gray-600 mb-4 text-sm">Xem và quản lý thông tin hồ sơ cá nhân, kết quả học tập và các thành tích của bạn.</p>
                    <p className={`text-sm font-semibold ${studentInfo ? 'text-blue-600' : 'text-gray-500'}`}>
                      {studentInfo ? 'Bấm để xem hồ sơ' : 'Vui lòng nhập thông tin để xem hồ sơ'}
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
