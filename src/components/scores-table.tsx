'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChevronDown,
  Download,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Loader2,
  MapPin,
  Flag,
  Target,
  Trophy,
} from 'lucide-react'

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useUser, UserType } from '@/context/user-context'
import MusicPlayer from './MusicPlayer'

export function ScoresTable() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const { fetchUsers, users } = useUser()

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers()
    }, 5 * 1000)

    return () => clearInterval(interval)
  }, [fetchUsers])

  function getGroupColorObj(nhom: number) {
    const colors = {
      1: {
        bg: 'bg-blue-100 dark:bg-blue-900/40',
        border: 'border-2 border-blue-500',
        glow: 'shadow-xl shadow-blue-500/40',
        text: 'text-blue-700 dark:text-blue-400',
        badge: 'bg-blue-500 text-white',
      },
      2: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/40',
        border: 'border-2 border-emerald-500',
        glow: 'shadow-xl shadow-emerald-500/40',
        text: 'text-emerald-700 dark:text-emerald-400',
        badge: 'bg-emerald-500 text-white',
      },
      3: {
        bg: 'bg-purple-100 dark:bg-purple-900/40',
        border: 'border-2 border-purple-500',
        glow: 'shadow-xl shadow-purple-500/40',
        text: 'text-purple-700 dark:text-purple-400',
        badge: 'bg-purple-500 text-white',
      },
      4: {
        bg: 'bg-orange-100 dark:bg-orange-900/40',
        border: 'border-2 border-orange-500',
        glow: 'shadow-xl shadow-orange-500/40',
        text: 'text-orange-700 dark:text-orange-400',
        badge: 'bg-orange-500 text-white',
      },
    }

    return colors[nhom as keyof typeof colors] || colors[1]
  }

  function getScoreBadge(
    score?: number,
    total: number = 5
  ) {
    if (score === undefined || score === -1) {
      return (
        <Badge className="bg-gray-400/20 text-gray-600">
          Chưa có
        </Badge>
      )
    }

    const percent = score / total

    if (percent === 1)
      return (
        <Badge className="bg-green-500/20 text-green-700">
          Xuất Sắc
        </Badge>
      )

    if (percent >= 0.8)
      return (
        <Badge className="bg-blue-500/20 text-blue-700">
          Tốt
        </Badge>
      )

    if (percent >= 0.6)
      return (
        <Badge className="bg-amber-500/20 text-amber-700">
          Khá
        </Badge>
      )

    if (percent >= 0.4)
      return (
        <Badge className="bg-orange-500/20 text-orange-700">
          Trung Bình
        </Badge>
      )

    return (
      <Badge className="bg-red-500/20 text-red-700">
        Yếu
      </Badge>
    )
  }

  function cellStyle() {
    return `
    border
    border-slate-200
    dark:border-slate-700
    bg-white
    dark:bg-slate-900
    rounded-xl
    px-3
    py-3
    transition-all
    duration-200
  `
  }

  function getStationResult(score?: number) {
    if (score === undefined || score === -1) return ''

    return score >= 4 ? 'Đạt' : 'Chưa đạt'
  }

  function getStationDetail(score?: number) {
    if (score === undefined || score === -1) return ''
    return `${score}/5`
  }

  function getReviewDetail(score?: number) {
    if (score === undefined || score === -1) return ''
    return `${score}/6`
  }

  const getScore = (score?: number) => {
    if (score === undefined || score === -1) return ''
    return score
  }

  const totalScore = (user: UserType): number => {
    if (!user.scoreStep && !user.score) return 0
    let total = 0
    const score = user.score || 0
    user.scoreStep?.forEach((s) => {
      if (s >= 4) total++
    })

    return Number(total + score)
  }

  function calculateRanks(users: UserType[]) {
    const filtered = users
      .filter((u) => !u.admin)
      .map((u) => ({
        id: u.classId + u.group,
        total: totalScore(u),
      }))

    filtered.sort((a, b) => b.total - a.total)

    const ranks: Record<string, number> = {}

    let currentRank = 1

    filtered.forEach((item, index) => {
      if (index > 0) {
        const prev = filtered[index - 1]

        if (item.total < prev.total) {
          currentRank = index + 1
        }
      }

      ranks[item.id] = currentRank
    })

    return ranks
  }

  function formatDuration(start?: number, end?: number) {
    if (!start || !end) return ''

    const diff = end - start

    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)

    return `${minutes} phút ${seconds} giây`
  }

  function getDate(start?: number) {
    if (!start) return ''
    return new Date(start).toLocaleDateString('vi-VN')
  }

  function getTime(start?: number) {
    if (!start) return ''
    return new Date(start).toLocaleTimeString('vi-VN')
  }

  function getActiveCheckpoint(
    continueStep?: number
  ): number | null {
    if (
      continueStep === undefined ||
      continueStep === -1
    )
      return null

    return continueStep
  }

  const exportToExcel = () => {
    if (users.length === 0) {
      alert('Chưa có nhóm nào làm bài!')
      return
    }

    const data = users
      .filter((u) => !u.admin)
      .sort((a, b) => a.group - b.group)
      .map((u) => ({
        'Nhóm': u.group,
        'Lớp': u.class,
        'Điểm trạm 1': getScore(u.scoreStep?.[0]),
        'Điểm trạm 2': getScore(u.scoreStep?.[1]),
        'Điểm trạm 3': getScore(u.scoreStep?.[2]),
        'Điểm trạm 4': getScore(u.scoreStep?.[3]),
        'Điểm ôn tập': u.score,
        'Tổng điểm': totalScore(u),
        'Ngày làm bài': getDate(u.startTime),
        'Thời gian bắt đầu': getTime(u.startTime),
        'Thời gian kết thúc': getTime(u.endTime),
        'Thời gian làm bài': formatDuration(
          u.startTime,
          u.endTime
        ),
      }))

    const ws = XLSX.utils.json_to_sheet(data)

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      'KetQua'
    )

    const buffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    })

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    saveAs(
      blob,
      `ket_qua_${new Date()
        .toLocaleDateString('vi-VN')
        .replace(/\//g, '-')}.xlsx`
    )
  }

  function getRankDisplay(rank?: number) {
    if (!rank) return null

    if (rank === 1)
      return (
        <div className="flex items-center justify-center gap-1 font-bold px-3 py-1 rounded-lg bg-yellow-500 text-white shadow-md">
          🥇 Hạng 1
        </div>
      )

    if (rank === 2)
      return (
        <div className="flex items-center justify-center gap-1 font-bold px-3 py-1 rounded-lg bg-gray-400 text-white shadow-md">
          🥈 Hạng 2
        </div>
      )

    if (rank === 3)
      return (
        <div className="flex items-center justify-center gap-1 font-bold px-3 py-1 rounded-lg bg-orange-500 text-white shadow-md">
          🥉 Hạng 3
        </div>
      )

    if (rank === 4)
      return (
        <div className="flex items-center justify-center gap-1 font-bold px-3 py-1 rounded-lg bg-blue-500 text-white shadow-md">
          🎖 Hạng 4
        </div>
      )

    return (
      <div className="flex items-center justify-center gap-1 font-bold px-3 py-1 rounded-lg bg-slate-200 text-slate-700 shadow-sm">
        Hạng {rank}
      </div>
    )
  }

  const stationConfig = [
    {
      icon: MapPin,
      headerColor: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Flag,
      headerColor: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      icon: Target,
      headerColor: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: Trophy,
      headerColor: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ]

  return (
    <div className="p-6">
      <MusicPlayer name="Tongket" loop />
      <div className="mb-6 flex justify-between">
        <h2 className="text-xl font-semibold">
          Bảng Điểm Chi Tiết
        </h2>

        <Button
          onClick={exportToExcel}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="
    text-base
    border-separate
    border-spacing-y-2
    border-spacing-x-2
  ">
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead
                className="
    border
    border-slate-200
    dark:border-slate-700
    bg-slate-100
    dark:bg-slate-800
    rounded-xl
    text-center
    font-bold
  "
              >
                <Users className="h-4 w-4 inline mr-2" />
                Nhóm
              </TableHead>

              <TableHead
                className="
    border
    border-slate-200
    dark:border-slate-700
    bg-slate-100
    dark:bg-slate-800
    rounded-xl
    text-center
    font-bold
  "
              >Lớp</TableHead>

              {stationConfig.map((s, i) => {
                const Icon = s.icon

                return (
                  <TableHead
                    key={i}
                    className={`text-center font-bold ${s.headerColor}`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Icon className="h-4 w-4" />
                      Trạm {i + 1}
                    </div>
                  </TableHead>
                )
              })}

              <TableHead className="text-center text-indigo-600 font-bold">
                <div className="flex items-center justify-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  Ôn Tập
                </div>
              </TableHead>

              <TableHead className="text-center text-rose-600 font-bold">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Tổng
                </div>
              </TableHead>

              <TableHead className="text-center text-amber-600 font-bold">
                <div className="flex items-center justify-center gap-1">
                  <Award className="h-4 w-4" />
                  Hạng
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users
              .filter((u) => !u.admin)
              .sort((a, b) => totalScore(b) - totalScore(a))
              .flatMap((row) => {
                const colors = getGroupColorObj(row.group)
                const activeCheckpoint = getActiveCheckpoint(row.continueStep)
                const ranks = calculateRanks(users)

                const id =
                  row.classId + row.group

                const rows = [
                  <motion.tr
                    key={id}
                    layout
                    transition={{
                      duration: 1.5,
                      ease: 'linear',
                    }}
                    className="
                      cursor-pointer
                      transition-all
                      duration-300
                      hover:scale-[1.01]
                      "
                    onClick={() =>
                      setExpandedRow(
                        expandedRow === id
                          ? null
                          : id
                      )
                    }
                  >
                    <TableCell>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${expandedRow === id
                          ? 'rotate-180'
                          : ''
                          }`}
                      />
                    </TableCell>

                    <TableCell>
                      <div
                        className={`
      inline-flex
      items-center
      justify-center
      w-10
      h-10
      rounded-full
      font-bold
      text-lg
      ${colors.badge}
      shadow-md
    `}
                      >
                        {row.group}
                      </div>
                    </TableCell>

                    <TableCell>
                      {row.class}
                    </TableCell>

                    <TableCell
                      className={`
    ${cellStyle()}
    text-center
    text-sm
    font-bold
    ${stationConfig[0].bg}
    ${activeCheckpoint === 0
                          ? `${colors.bg} ${colors.border} ${colors.glow} animate-station-active`
                          : ''
                        }
  `}
                    >
                      {activeCheckpoint === 0 ? (
                        <div className="flex items-center gap-1">
                          <Loader2
                            className={`
                            h-4 w-4
                            animate-spin
                            ${colors.text}
                          `}
                          />

                          <span
                            className={`
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                ${colors.text}
                              `}
                          >
                            Đang làm
                          </span>
                        </div>
                      ) : (
                        getStationResult(row.scoreStep?.[0])
                      )}
                    </TableCell>

                    <TableCell
                      className={`
    ${cellStyle()}
    text-center
    text-sm
    font-bold
    ${stationConfig[1].bg}
    ${activeCheckpoint === 1
                          ? `${colors.bg} ${colors.border} ${colors.glow} animate-station-active`
                          : ''
                        }
  `}
                    >
                      {activeCheckpoint === 1 ? (
                        <div className="flex items-center gap-1">
                          <Loader2
                            className={`
                            h-4 w-4
                            animate-spin
                            ${colors.text}
                          `}
                          />

                          <span
                            className={`
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                ${colors.text}
                              `}
                          >
                            Đang làm
                          </span>
                        </div>
                      ) : (
                        getStationResult(row.scoreStep?.[1])
                      )}
                    </TableCell>

                    <TableCell
                      className={`
    ${cellStyle()}
    text-center
    text-sm
    font-bold
    ${stationConfig[2].bg}
    ${activeCheckpoint === 2
                          ? `${colors.bg} ${colors.border} ${colors.glow} animate-station-active`
                          : ''
                        }
  `}
                    >
                      {activeCheckpoint === 2 ? (
                        <div className="flex items-center gap-1">
                          <Loader2
                            className={`
                            h-4 w-4
                            animate-spin
                            ${colors.text}
                          `}
                          />

                          <span
                            className={`
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                ${colors.text}
                              `}
                          >
                            Đang làm
                          </span>
                        </div>
                      ) : (
                        getStationResult(row.scoreStep?.[2])
                      )}
                    </TableCell>

                    <TableCell
                      className={`
    ${cellStyle()}
    text-center
    text-sm
    font-bold
    ${stationConfig[3].bg}
    ${activeCheckpoint === 3
                          ? `${colors.bg} ${colors.border} ${colors.glow} animate-station-active`
                          : ''
                        }
  `}
                    >
                      {activeCheckpoint === 3 ? (
                        <div className="flex items-center gap-1">
                          <Loader2
                            className={`
      h-4 w-4
      animate-spin
      ${colors.text}
    `}
                          />

                          <span
                            className={`
      text-xs
      font-semibold
      uppercase
      tracking-wide
      ${colors.text}
    `}
                          >
                            Đang làm
                          </span>
                        </div>
                      ) : (
                        getStationResult(row.scoreStep?.[3])
                      )}
                    </TableCell>

                    <TableCell
                      className={`
    ${cellStyle()}
    text-center
    text-sm
    font-bold
    ${stationConfig[0].bg}
  `}
                    >
                      {row.score}
                    </TableCell>

                    <TableCell >
                      <span
                        className={`
      px-6
      py-4
      rounded-lg
      font-bold
      text-xl
      text-white
      ${colors.badge}
      border
      ${colors.border}
    `}
                      >
                        {totalScore(row)} Điểm
                      </span>
                    </TableCell>

                    <TableCell>
                      {getRankDisplay(ranks[id])}
                    </TableCell>
                  </motion.tr>,
                ]

                if (expandedRow === id) {
                  rows.push(
                    <TableRow key={id + '-ex'}>
                      <TableCell colSpan={11}>
                        <div className="grid grid-cols-6 gap-4 py-4">
                          {[0, 1, 2, 3].map(
                            (i) => (
                              <div
                                key={i}
                                className="p-4 border rounded-lg"
                              >
                                <p className="text-xs uppercase mb-1">
                                  Trạm {i + 1}
                                </p>

                                <div className="flex items-center gap-2">
                                  <div className="text-2xl font-bold">
                                    {getStationDetail(row.scoreStep?.[i])}
                                  </div>

                                  {getScoreBadge(
                                    row.scoreStep?.[
                                    i
                                    ]
                                    , 5)}
                                </div>
                              </div>
                            )
                          )}

                          <div className="p-4 border rounded-lg">
                            <p className="text-xs uppercase mb-1">
                              Ôn tập
                            </p>

                            <div className="flex items-center gap-2">
                              <div className="text-2xl font-bold">
                                {getReviewDetail(row.score)}
                              </div>

                              {getScoreBadge(
                                row.score
                                , 6)}
                            </div>
                          </div>

                          <div className="p-4 border rounded-lg bg-primary/10">
                            <p className="text-xs uppercase mb-1">
                              Tổng
                            </p>

                            <p className="text-3xl font-bold text-primary">
                              {totalScore(row)} Điểm
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                }

                return rows
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}