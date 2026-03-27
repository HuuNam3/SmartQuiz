'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ConfirmationModalProps {
  studentName: string
  studentClass: string
  onConfirm: () => void
  onEdit: () => void
}

export default function ConfirmationModal({
  studentName,
  studentClass,
  onConfirm,
  onEdit,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <div className="text-3xl">✓</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác nhận thông tin</h2>
          <p className="text-gray-600">Vui lòng kiểm tra lại thông tin của bạn</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-200">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Họ và tên</p>
              <p className="text-lg font-bold text-gray-800">{studentName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Lớp</p>
              <p className="text-lg font-bold text-gray-800">{studentClass}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Xác nhận và tiếp tục
          </Button>
          <Button
            onClick={onEdit}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Chỉnh sửa
          </Button>
        </div>
      </Card>
    </div>
  )
}
