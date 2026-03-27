'use client'

import React, { createContext, useContext, useState } from 'react'

interface StudentInfo {
  name: string
  className: string
  quizStartTime?: number
}

interface StudentContextType {
  studentInfo: StudentInfo | null
  setStudentInfo: (info: StudentInfo) => void
  clearStudentInfo: () => void
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)

  const clearStudentInfo = () => {
    setStudentInfo(null)
  }

  return (
    <StudentContext.Provider value={{ studentInfo, setStudentInfo, clearStudentInfo }}>
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const context = useContext(StudentContext)
  if (context === undefined) {
    throw new Error('useStudent must be used within StudentProvider')
  }
  return context
}
