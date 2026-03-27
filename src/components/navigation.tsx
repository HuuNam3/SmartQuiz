'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useStudent } from '@/context/student-context'

export default function Navigation() {
  const pathname = usePathname()
  const { studentInfo } = useStudent()

  const links = [
    { href: '/', label: 'Trang chủ', protected: false },
    { href: '/quiz', label: 'Trắc nghiệm', protected: true },
    { href: '/profile', label: 'Hồ sơ học sinh', protected: true },
  ]

  const visibleLinks = links.filter(link => {
    if (link.protected) {
      return studentInfo !== null
    }
    return true
  })

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Hệ thống Quản lý</div>
          <div className="flex gap-6">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
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
  )
}
