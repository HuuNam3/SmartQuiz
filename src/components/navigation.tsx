'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useUser } from '@/context/user-context'
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

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()

  // Ẩn navigation khi đang làm bài trắc nghiệm
  if (pathname === '/quiz') {
    return null
  }

  const links = [
    { href: '/', label: 'Trang chủ', protected: false, needsWarning: false },
    { href: '/review', label: 'Ôn tập', protected: true, needsWarning: false },
  ]

  // const visibleLinks = links.filter(link => {
  //   if (link.protected) {
  //     return studentInfo !== null
  //   }
  //   return true
  // })

  // const handleQuizClick = (e: React.MouseEvent, link: typeof links[0]) => {
  //   if (link.needsWarning && pathname !== '/quiz') {
  //     e.preventDefault()
  //     if (hasCompletedQuiz) {
  //       setShowCompletedWarning(true)
  //     } else {
  //       setShowQuizWarning(true)
  //     }
  //   }
  // }

  // const handleConfirmQuiz = () => {
  //   setShowQuizWarning(false)
  //   router.push('/quiz')
  // }

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-2xl font-bold">Củng cố bài học</span>
            </div>
            <div className="flex gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  // onClick={(e) => handleQuizClick(e, link)}
                  className={cn(
                    'px-4 py-2 rounded-lg transition-all duration-200',
                    pathname === link.href
                      ? 'bg-white text-blue-600 font-semibold'
                      : 'hover:bg-blue-500'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* <AlertDialog open={showQuizWarning} onOpenChange={setShowQuizWarning}>
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
              <li>Bài trắc nghiệm gồm <strong>10 câu hỏi</strong></li>
              <li>Thời gian làm bài: <strong>15 phút</strong></li>
              <li>Bạn có thể chọn đáp án cho tất cả các câu trước khi nộp bài</li>
              <li>Sau khi nộp bài, bạn không thể sửa lại đáp án</li>
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
      </AlertDialog> */}
    </>
  )
}
