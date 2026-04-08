'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'

export default function ProfilePage() {
  const router = useRouter()
  const { user, clearUser, users, setUser } = useUser()

  useEffect(() => {
    if (!user || user.admin) {
      router.push('/')
    }

  }, [user, router])

  useEffect(() => {
    const findUser = users.find((u) => u.classId === user?.classId)
    clearUser()
    if (findUser) {
      setUser({
        ...findUser,
      })
    }
  }, [user?.classId, setUser, users, clearUser])

  if (!user) {
    return null
  }

  const totalScore = (): number => {
    const score = user.score || 0
    let total = 0
    user.scoreStep?.forEach(idx => {
      if (idx >= 4) {
        total++
      }
    })
    return total + score
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-purple-500 to-pink-500 shadow-lg mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Hồ sơ của nhóm
          </h1>
        </div>

        {/* Student Info Card */}
        <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0 mb-6">
          <div className="space-y-6">

            {/* Class */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-600 mb-1">Lớp</p>
                <p className="text-xl font-bold text-gray-800">{user.class}</p>
              </div>
            </div>
          </div>

          {/* Group */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-purple-50 to-pink-50 border border-purple-100">
            <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-1a4 4 0 00-3-3.87M9 20H4v-1a4 4 0 013-3.87m10-4a4 4 0 11-8 0 4 4 0 018 0zM5 10a4 4 0 118 0 4 4 0 01-8 0z"
                />
              </svg>
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-purple-600 mb-1">
                Nhóm
              </p>

              <p className="text-xl font-bold text-gray-800">
                {user.group}
              </p>
            </div>
          </div>
        </Card>

        {/* Quiz Result Card */}
        <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Kết quả Trắc nghiệm</h2>
          </div>

          {user.endTime ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-white text-center">
                  <p className="text-sm opacity-90 mb-1">Số câu đúng</p>
                  <p className="text-3xl font-bold">{user.score}/6</p>
                </div>
                <div className={`p-4 rounded-xl text-white text-center ${(totalScore() / 10) * 100 >= 80
                  ? 'bg-linear-to-br from-emerald-500 to-green-600'
                  : (totalScore() / 10) * 100 >= 50
                    ? 'bg-linear-to-br from-amber-500 to-orange-600'
                    : 'bg-linear-to-br from-red-500 to-rose-600'
                  }`}>
                  <p className="text-sm opacity-90 mb-1">Tổng Điểm số</p>
                  <p className="text-3xl font-bold">
                    {totalScore()}
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-xl text-center ${(totalScore() / 10) * 100 >= 80
                ? 'bg-emerald-50 border-2 border-emerald-200'
                : (totalScore() / 10) * 100 >= 50
                  ? 'bg-amber-50 border-2 border-amber-200'
                  : 'bg-red-50 border-2 border-red-200'
                }`}>
                <p className={`text-lg font-semibold ${(totalScore() / 10) * 100 >= 80 ? 'text-emerald-700' :
                  (totalScore() / 10) * 100 >= 50 ? 'text-amber-700' : 'text-red-700'
                  }`}>
                  {(totalScore() / 10) * 100 >= 80
                    ? 'Xuất sắc! Bạn đã nắm vững kiến thức.'
                    : (totalScore() / 10) * 100 >= 50
                      ? 'Khá tốt! Hãy tiếp tục ôn tập thêm.'
                      : 'Cần cố gắng thêm! Hãy xem lại phần ôn tập.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-1">Bạn chưa làm bài trắc nghiệm</p>
              <p className="text-sm text-gray-500">Hãy vào phần Ôn tập để xem nội dung, sau đó làm bài Trắc nghiệm.</p>
            </div>
          )}
        </Card>

        {/* Station Score Card */}
        <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m0-4V7m6 10v-6m0-4V7M5 21h14"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Điểm từng trạm
            </h2>
          </div>

          {user?.scoreStep?.map((score: number, index: number) => {
            const maxScorePerStation = 5
            const passScore = 4

            let bg = ""
            let status = ""
            let label = ""

            if (score === -1) {
              bg = "bg-gray-100 border-gray-200 text-gray-600"
              status = "Chưa làm"
            } else {
              const ratio = score / maxScorePerStation

              // FAIL (0-3 điểm) -> đỏ
              if (score < passScore) {
                if (ratio <= 0.2) {
                  bg = "bg-red-700 border-red-800 text-white"
                } else if (ratio <= 0.4) {
                  bg = "bg-red-600 border-red-700 text-white"
                } else if (ratio <= 0.6) {
                  bg = "bg-red-500 border-red-600 text-white"
                } else {
                  bg = "bg-red-400 border-red-500 text-white"
                }

                status = "Không đạt"
              }

              // PASS (4-5 điểm) -> xanh
              else {
                if (ratio < 1) {
                  bg = "bg-emerald-400 border-emerald-500 text-emerald-900"
                } else {
                  bg = "bg-emerald-600 border-emerald-700 text-white"
                }

                status = "Đạt"
              }

              label = `${score} / ${maxScorePerStation}`
            }

            return (
              <div
                key={index}
                className={`p-5 rounded-2xl border ${bg}
                  shadow-md hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.553-1.894L9 1m0 19l6-2m-6 2V1m6 17l5.447-2.724A2 2 0 0021 15.382V5.618a2 2 0 00-1.553-1.894L15 1m0 17V1"
                      />
                    </svg>
                  </div>

                  <p className="font-semibold">
                    Trạm {index + 1}
                  </p>
                </div>

                {score !== -1 && (
                  <p className="text-2xl font-bold mb-1">
                    {label}
                  </p>
                )}

                <p className="text-sm opacity-90">
                  {status}
                </p>
              </div>
            )
          })}
        </Card>

        {/* Logout Button */}
        <div className="text-center">
          <Button
            onClick={() => {
              clearUser()
              router.push('/')
            }}
            className="bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
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
