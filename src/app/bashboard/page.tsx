'use client'

import { useEffect } from 'react'
import { ScoresTable } from '@/components/scores-table'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'

export default function Dashboard() {
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    if (!user || !(user?.classId === 'admin333') && user.admin) {
      router.push('/')
    }

  }, [user, router])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="border-0 shadow-xl">
        <ScoresTable />
      </Card>
    </div>
  )
}
