'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useStudent } from '@/context/student-context'

type user = {
  name: string,
  className: string,
  score: number,
  updatedAt: string,
}

export default function ProfilePage() {
  const router = useRouter()
  // const [users, setUsers] = useState<user[]>([]);
  const [user, setUser] = useState<user>()
  const { studentInfo, clearStudentInfo, quizResult, hasCompletedQuiz } = useStudent()

  useEffect(() => {
    if (!studentInfo) {
      router.push('/')
    }

  }, [studentInfo, router])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();

        const foundUser = data.find(
          (u: user) =>
            u.name === studentInfo?.name &&
            u.className === studentInfo?.className
        );

        setUser(foundUser);
        console.log(foundUser);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  if (!studentInfo) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Hồ sơ Học sinh
          </h1>
        </div>

        {/* Student Info Card */}
        <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0 mb-6">
          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600 mb-1">Họ và tên</p>
                <p className="text-xl font-bold text-gray-800">{studentInfo.name}</p>
              </div>
            </div>

            {/* Class */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-600 mb-1">Lớp</p>
                <p className="text-xl font-bold text-gray-800">{studentInfo.className}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quiz Result Card */}
        <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Kết quả Trắc nghiệm</h2>
          </div>

          {user ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center">
                  <p className="text-sm opacity-90 mb-1">Số câu đúng</p>
                  <p className="text-3xl font-bold">{user.score}/10</p>
                </div>
                <div className={`p-4 rounded-xl text-white text-center ${(user.score / 10) * 100 >= 80
                  ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                  : (user.score / 10) * 100 >= 50
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                    : 'bg-gradient-to-br from-red-500 to-rose-600'
                  }`}>
                  <p className="text-sm opacity-90 mb-1">Điểm số</p>
                  <p className="text-3xl font-bold">
                    {((user.score / 10) * 10).toFixed(1)}
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-xl text-center ${(user.score / 10) * 100 >= 80
                ? 'bg-emerald-50 border-2 border-emerald-200'
                : (user.score / 10) * 100 >= 50
                  ? 'bg-amber-50 border-2 border-amber-200'
                  : 'bg-red-50 border-2 border-red-200'
                }`}>
                <p className={`text-lg font-semibold ${(user.score / 10) * 100 >= 80 ? 'text-emerald-700' :
                  (user.score / 10) * 100 >= 50 ? 'text-amber-700' : 'text-red-700'
                  }`}>
                  {(user.score / 10) * 100 >= 80
                    ? 'Xuất sắc! Bạn đã nắm vững kiến thức.'
                    : (user.score / 10) * 100 >= 50
                      ? 'Khá tốt! Hãy tiếp tục ôn tập thêm.'
                      : 'Cần cố gắng thêm! Hãy xem lại phần ôn tập.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-1">Bạn chưa làm bài trắc nghiệm</p>
              <p className="text-sm text-gray-500">Hãy vào phần Ôn tập để xem nội dung, sau đó làm bài Trắc nghiệm.</p>
            </div>
          )}
        </Card>

        {/* Logout Button */}
        <div className="text-center">
          <Button
            onClick={() => {
              clearStudentInfo()
              router.push('/')
            }}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  )
}
