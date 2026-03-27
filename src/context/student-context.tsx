'use client'

import React, { createContext, useContext, useState } from 'react'

interface StudentInfo {
  name: string
  className: string
  quizStartTime?: number
}

interface QuizResult {
  score: number
  totalQuestions: number
  completedAt: Date
}

interface StudentRecord {
  name: string
  className: string
  score: number
  totalQuestions: number
  completedAt: Date
}

interface StudentContextType {
  studentInfo: StudentInfo | null
  setStudentInfo: (info: StudentInfo) => void
  clearStudentInfo: () => void
  quizResult: QuizResult | null
  setQuizResult: (result: QuizResult) => void
  hasCompletedQuiz: boolean
  isAdmin: boolean
  allStudentRecords: StudentRecord[]
  addStudentRecord: (record: StudentRecord) => void
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [allStudentRecords, setAllStudentRecords] = useState<StudentRecord[]>([])

  const clearStudentInfo = () => {
    setStudentInfo(null)
    setQuizResult(null)
  }

  const hasCompletedQuiz = quizResult !== null
  
  // Check if current user is admin
  const isAdmin = studentInfo?.name === 'admin' && studentInfo?.className === 'admin123'

  const addStudentRecord = (record: StudentRecord) => {
    setAllStudentRecords(prev => [...prev, record])
  }

  return (
    <StudentContext.Provider value={{ 
      studentInfo, 
      setStudentInfo, 
      clearStudentInfo,
      quizResult,
      setQuizResult,
      hasCompletedQuiz,
      isAdmin,
      allStudentRecords,
      addStudentRecord
    }}>
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
