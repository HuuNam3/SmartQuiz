'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import { useState } from 'react'
import { cn } from '@/lib/utils'
// import { useUser } from '@/context/user-context'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog'
import { Anchor } from 'lucide-react'


export default function Navigation() {
  const pathname = usePathname()
  // const router = useRouter()
  // const { user } = useUser()

  // Ẩn navigation khi đang làm bài trắc nghiệm
  if (pathname === '/quiz') {
    return null
  }

  const links = [
    { href: '/', label: 'Trang chủ', protected: false, needsWarning: false },
    { href: '/review', label: 'Ôn tập', protected: true, needsWarning: false },
    // { href: '/consolidation', label: 'Làm bài ôn tập', protected: false, needsWarning: false },
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
      <nav className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1bfd14] flex items-center justify-center">
                <Anchor className="text-[#fcee17] w-full h-full" />
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 64a32 32 0 1 0 0 64 32 32 0 1 0 0-64zM192 96c0-53 43-96 96-96s96 43 96 96c0 41.8-26.7 77.4-64 90.5l0 257.9c62.9-14.3 110.2-69.7 111.9-136.5l-16.1 14.1c-10 8.7-25.1 7.7-33.9-2.3s-7.7-25.1 2.3-33.9l64-56c9-7.9 22.6-7.9 31.6 0l64 56c10 8.7 11 23.9 2.3 33.9s-23.9 11-33.9 2.3L496 307.9C493.9 421 401.6 512 288 512S82.1 421 80 307.9L63.8 322.1c-10 8.7-25.1 7.7-33.9-2.3s-7.7-25.1 2.3-33.9l64-56c9-7.9 22.6-7.9 31.6 0l64 56c10 8.7 11 23.9 2.3 33.9s-23.9 11-33.9 2.3l-16.1-14.1c1.8 66.8 49.1 122.2 111.9 136.5l0-257.9c-37.3-13.2-64-48.7-64-90.5z" /></svg> */}
              </div>
              <span className="text-2xl font-bold"> Củng cố bài học</span>
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
      </nav >

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
