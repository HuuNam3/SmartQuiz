'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useStudent } from '@/context/student-context'

interface StudentProfile {
  name: string
  className: string
  studentId: string
  email: string
  phone: string
  gpa: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const { studentInfo, clearStudentInfo } = useStudent()

  // Redirect nếu chưa nhập thông tin
  useEffect(() => {
    if (!studentInfo) {
      router.push('/')
    }
  }, [studentInfo, router])

  const [profile, setProfile] = useState<StudentProfile>({
    name: studentInfo?.name || 'Nguyễn Văn A',
    className: studentInfo?.className || '10A1',
    studentId: 'HS001234',
    email: 'student@example.com',
    phone: '0912345678',
    gpa: '8.5',
  })

  const [editData, setEditData] = useState<StudentProfile>(profile)

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(profile)
  }

  const handleSave = () => {
    setProfile(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleChange = (field: keyof StudentProfile, value: string) => {
    setEditData({ ...editData, [field]: value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">👤 Hồ sơ Học sinh</h1>

        <Card className="p-8 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
            {!isEditing && (
              <Button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Chỉnh sửa
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <Input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lớp
                  </label>
                  <Input
                    type="text"
                    value={editData.className}
                    onChange={(e) => handleChange('className', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã học sinh
                  </label>
                  <Input
                    type="text"
                    value={editData.studentId}
                    onChange={(e) => handleChange('studentId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <Input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm GPA
                  </label>
                  <Input
                    type="text"
                    value={editData.gpa}
                    onChange={(e) => handleChange('gpa', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                >
                  Lưu
                </Button>
                <Button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                >
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Họ và tên</p>
                  <p className="text-lg font-semibold text-gray-800">{profile.name}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Lớp</p>
                  <p className="text-lg font-semibold text-gray-800">{profile.className}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Mã học sinh</p>
                  <p className="text-lg font-semibold text-gray-800">{profile.studentId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Số điện thoại</p>
                  <p className="text-lg font-semibold text-gray-800">{profile.phone}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Điểm GPA</p>
                  <p className="text-lg font-semibold text-blue-600">{profile.gpa}/10</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Reset Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => {
              clearStudentInfo()
              router.push('/')
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Nhập lại thông tin
          </Button>
        </div>

        {/* Statistics Card */}
        <Card className="p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Thống kê Học tập</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Bài tập hoàn thành</p>
              <p className="text-3xl font-bold text-blue-600">24</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Điểm cao nhất</p>
              <p className="text-3xl font-bold text-green-600">9.5</p>
            </div>
            <div className="bg-yellow-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Lần làm trắc nghiệm</p>
              <p className="text-3xl font-bold text-yellow-600">12</p>
            </div>
            <div className="bg-purple-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Xếp hạng lớp</p>
              <p className="text-3xl font-bold text-purple-600">5</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
