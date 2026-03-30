'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

export type UserType = {
  classId: string
  name: string
  class: string
  admin?: boolean
  group?: string
  score: number
  startTime?: number
  endTime?: number
  updatedAt: Date
}

type UserContextType = {
  users: UserType[]
  setUsers: (users: UserType[]) => void
  user: UserType | undefined
  setUser: (user: UserType) => void
  clearUser: () => void
  loading: boolean
  fetchUsers: () => void
}

// ===== Create Context =====
const UserContext = createContext<UserContextType | undefined>(undefined)

// ===== Provider =====
export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserType[]>([])
  const [user, setUser] = useState<UserType | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch('/api/users')
      const data = await res.json()
      console.log(data)
      setUsers(data)
    } catch (err) {
      console.log('Failed to fetch users' + err)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearUser = useCallback(() => {
    setUser(undefined)
  }, [])

  return (
    <UserContext.Provider
      value={{ users, setUsers, user, setUser, clearUser, loading, fetchUsers }}
    >
      {children}
    </UserContext.Provider>
  )
}

// ===== Hook =====
export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }

  return context
}
