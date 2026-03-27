'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStudent } from '@/context/student-context'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const reviewContent = [
  {
    id: 'noi-thuy',
    title: '1. Nội thủy',
    content: `Theo Luật Biển Việt Nam 2012, tại chương II, điều 9 quy định:
"Nội thủy là vùng nước tiếp giáp bờ biển, ở phía trong đường cơ sở và là bộ phận lãnh thổ của Việt Nam".

Nội thủy là một phần lãnh thổ của một quốc gia, bao gồm các con sông, hồ, ao, đầm, vùng đầm lầy và các kênh đào, có chiều rộng từ đường cơ sở ở vùng ven biển đến khoảng 12 hải lý (22,2 km).

Quyền và nghĩa vụ của người dân trong vùng nội thủy:
• Người dân có quyền sử dụng tài nguyên trong vùng nội thủy để sinh hoạt, sản xuất và phát triển kinh tế.
• Người dân có nghĩa vụ bảo vệ tài nguyên và môi trường trong vùng nội thủy, đồng thời phải tuân thủ các quy định về bảo vệ môi trường và tài nguyên biển.
• Người dân cần phải đăng ký và được cấp phép sử dụng tài nguyên trong vùng nội thủy theo quy định của pháp luật.
• Người dân trong vùng nội thủy có quyền tham gia vào quá trình quản lý và sử dụng tài nguyên trong vùng.`,
  },
  {
    id: 'lanh-hai',
    title: '2. Lãnh hải - Chế độ pháp lý, Quyền chủ quyền',
    content: `Theo Luật Biển Việt Nam năm 2012, Lãnh hải là vùng biển có chiều rộng 12 hải lý tính từ đường cơ sở ra phía biển. Ranh giới ngoài của lãnh hải là biên giới quốc gia trên biển của Việt Nam.

Chế độ pháp lý của lãnh hải (Điều 12 khoản 1):
Nhà nước thực hiện chủ quyền đầy đủ và toàn vẹn đối với lãnh hải, vùng trời trên lãnh hải, đáy biển và lòng đất dưới đáy biển của lãnh hải phù hợp với Công ước của Liên hợp quốc về Luật Biển năm 1982.

Quyền đi qua không gây hại của tàu thuyền nước ngoài:
Theo Công ước Liên hợp quốc về Luật Biển năm 1982 Điều 17: Với điều kiện phải tuân theo Công ước này, tàu thuyền của tất cả các quốc gia, có biển hay không có biển, đều được hưởng quyền đi qua không gây hại trong lãnh hải.

Việc đi qua phải liên tục và nhanh chóng. Tuy nhiên, việc đi qua bao gồm cả việc dừng lại và neo đậu, nhưng chỉ trong chừng mực những việc này là những sự cố thông thường của hành trình hoặc do bất khả kháng hay gặp nạn, hoặc nhằm cứu giúp người, tàu thuyền hay phương tiện bay gặp nguy hiểm hay bị nạn.`,
  },
  {
    id: 'vung-tiep-giap',
    title: '3. Vùng tiếp giáp lãnh hải',
    content: `Vùng tiếp giáp lãnh hải là vùng biển nằm liền kề bên ngoài lãnh hải, chồng lấn với vùng đặc quyền kinh tế và thềm lục địa.

Vị trí địa lý:
• Vị trí: Nằm ngoài lãnh hải và tiếp liền với lãnh hải.
• Chiều rộng: Được quy định không quá 24 hải lý tính từ đường cơ sở dùng để tính chiều rộng lãnh hải.
• Khoảng cách: Vùng này rộng 12 hải lý tính từ ranh giới phía ngoài của lãnh hải.
• Vị trí so với các vùng biển khác: Chồng lấn với vùng đặc quyền kinh tế và thềm lục địa.

Là khu vực chuyển tiếp quan trọng, nơi quốc gia ven biển thực hiện các biện pháp an ninh, quốc phòng và bảo vệ các quyền lợi chuyên biệt.

Quyền truy đuổi tàu thuyền trên biển:
Theo luật biển Việt Nam năm 2012, lực lượng tuần tra, kiểm soát trên biển có quyền truy đuổi tàu thuyền nước ngoài khi đã phát tín hiệu yêu cầu dừng để kiểm tra nhưng tàu không chấp hành.

Theo Điều 48 Luật Biển Việt Nam 2012, các lực lượng tuần tra, kiểm soát trên biển có nhiệm vụ:
• Bảo vệ chủ quyền, quyền chủ quyền, quyền tài phán và lợi ích quốc gia
• Bảo đảm thi hành pháp luật Việt Nam
• Bảo vệ tài sản nhà nước, tài nguyên và môi trường biển
• Tham gia tìm kiếm cứu nạn, cứu hộ
• Xử lý các hành vi vi phạm pháp luật trên các vùng biển, đảo của Việt Nam`,
  },
  {
    id: 'vung-dac-quyen',
    title: '4. Vùng đặc quyền kinh tế & Thềm lục địa',
    content: `Theo Luật số: 18/2012/QH13 Luật Biển Việt Nam năm 2012

Điều 15. Vùng đặc quyền kinh tế:
Vùng đặc quyền kinh tế là vùng biển tiếp liền và nằm ngoài lãnh hải Việt Nam, hợp với lãnh hải thành một vùng biển có chiều rộng 200 hải lý tính từ đường cơ sở.

Điều 17. Thềm lục địa:
Thềm lục địa là vùng đáy biển và lòng đất dưới đáy biển, tiếp liền và nằm ngoài lãnh hải Việt Nam, trên toàn bộ phần kéo dài tự nhiên của lãnh thổ đất liền, các đảo và quần đảo của Việt Nam cho đến mép ngoài của rìa lục địa.

Trong vùng đặc quyền kinh tế, quốc gia ven biển có:
a) Các quyền chủ quyền về việc thăm dò và khai thác, bảo tồn và quản lý các nguồn tài nguyên thiên nhiên, sinh vật hoặc không sinh vật của vùng nước bên trên đáy biển, của đáy biển và lòng đất dưới đáy biển, cũng như về những hoạt động khác nhằm thăm dò và khai thác vùng này vì mục đích kinh tế, như việc sản xuất năng lượng từ nước, hải lưu và gió.

b) Quyền tài phán theo đúng những quy định của Công ước về việc:
• Lắp đặt và sử dụng các đảo nhân tạo, các thiết bị, công trình
• Nghiên cứu khoa học biển
• Bảo vệ và giữ gìn môi trường biển

c) Các quyền và nghĩa vụ khác do Công ước quy định.`,
  },
]

export default function ReviewPage() {
  const router = useRouter()
  const { studentInfo } = useStudent()

  useEffect(() => {
    if (!studentInfo) {
      router.push('/')
    }
  }, [studentInfo, router])

  if (!studentInfo) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">Ôn tập kiến thức</h1>
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm shadow-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-semibold text-teal-700">{studentInfo.name}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold text-cyan-700">{studentInfo.className}</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Đọc kỹ các nội dung bên dưới trước khi làm bài trắc nghiệm
          </p>
        </div>

        <Card className="p-6 shadow-xl bg-white/80 backdrop-blur-sm border-0 mb-6">
          <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-teal-800">Chủ đề: Luật Biển Việt Nam</h2>
            </div>
            <p className="text-teal-700 text-sm ml-11">
              Nội dung ôn tập về các vùng biển của Việt Nam theo Luật Biển Việt Nam năm 2012 và Công ước Liên hợp quốc về Luật Biển năm 1982.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full" defaultValue="noi-thuy">
            {reviewContent.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-800 hover:text-teal-600">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                    {item.content}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <Card className="p-6 shadow-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-amber-800">Lưu ý khi làm bài trắc nghiệm</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 text-amber-700">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Bài trắc nghiệm gồm <strong>10 câu hỏi</strong> được chọn ngẫu nhiên từ ngân hàng đề</span>
            </li>
            <li className="flex items-start gap-3 text-amber-700">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Thời gian làm bài: <strong>15 phút</strong></span>
            </li>
            <li className="flex items-start gap-3 text-amber-700">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Mỗi học sinh <strong>chỉ được làm bài 1 lần</strong></span>
            </li>
            <li className="flex items-start gap-3 text-amber-700">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>Sau khi nộp bài, bạn không thể làm lại</span>
            </li>
            <li className="flex items-start gap-3 text-amber-700">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Hãy đọc kỹ nội dung ôn tập trước khi bắt đầu làm bài</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
