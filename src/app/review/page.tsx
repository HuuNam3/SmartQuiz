'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useUser } from '@/context/user-context'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import MusicPlayer from '@/components/MusicPlayer'


const reviewContent = [
  {
    id: 'noi-thuy',
    title: '1. Nội thủy',
    content: `Theo Luật Biển Việt Nam 2012, tại chương II, điều 9,10 quy định:
"Nội thủy là vùng nước tiếp giáp bờ biển, ở phía trong đường cơ sở và là bộ phận lãnh thổ của Việt Nam".
Nhà nước thực hiện chủ quyền hoàn toàn, tuyệt đối và đầy đủ đối với nội thủy như trên lãnh thổ đất liền.

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
  const { user } = useUser()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-amber-50 to-yellow-50 pt-24 pb-12 px-4">
      <MusicPlayer name="Nen" loop={true} />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-red-600 to-rose-600 shadow-lg mb-4 ring-4 ring-yellow-300/70">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-red-700 via-rose-600 to-amber-500 bg-clip-text text-transparent mb-4">Ôn tập kiến thức</h1>
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-red-100">
            <span className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-semibold text-red-700">{user?.name}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold text-amber-700">{user?.class}</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Đọc kỹ các nội dung bên dưới trước khi làm bài trắc nghiệm
          </p>
        </div>

        <div className="mb-6">
          <div className="relative w-full aspect-16/7 rounded-2xl border-2 border-yellow-300 bg-white shadow-lg overflow-hidden">
            <Image
              src="/den_voi_truong_sa.png"
              alt="Banner biển đảo Trường Sa"
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white">
              <h2 className="text-xl sm:text-2xl font-bold drop-shadow-md">Biển đảo Việt Nam</h2>
              <p className="text-sm sm:text-base text-white/90 drop-shadow-md">Tự hào Tổ quốc - Vững vàng chủ quyền biển, đảo.</p>
            </div>
          </div>
        </div>

        <Card className="p-6 shadow-xl bg-white/80 backdrop-blur-sm border-0 mb-6">
          <div className="mb-6 p-4 bg-linear-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
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
                  {item.id === 'noi-thuy' ? (
                    <div className="max-w-4xl mx-auto font-sans">
                      <div className="bg-linear-to-r from-blue-700 via-indigo-800 to-blue-900 text-white p-5 rounded-2xl shadow-xl mb-5 border-l-8 border-yellow-300 ring-2 ring-blue-300/60">
                        <h4 className="text-xl font-extrabold mb-3 tracking-wide text-yellow-100">📌 Khái niệm</h4>
                        <p className="mb-2 text-white">
                          Theo <span className="font-semibold text-amber-300">Luật Biển Việt Nam 2012</span>, tại{' '}
                          <span className="font-semibold text-amber-300">Chương II, Điều 9 và Điều 10</span> quy định:
                        </p>
                        <p className="italic text-white">
                          <span className="font-semibold text-cyan-300">Nội thủy</span> là vùng nước tiếp giáp bờ biển, ở phía trong{' '}
                          <span className="font-semibold text-cyan-300">đường cơ sở</span> và là bộ phận{' '}
                          <span className="font-semibold text-cyan-300">lãnh thổ của Việt Nam</span>.
                        </p>
                        <p className="mt-2 text-white">
                          Nhà nước thực hiện <span className="font-semibold text-rose-300">chủ quyền hoàn toàn, tuyệt đối và đầy đủ</span> đối với{' '}
                          <span className="font-semibold text-cyan-300">nội thủy</span> như trên lãnh thổ đất liền.
                        </p>
                      </div>

                      <div className="mb-5">
                        <div className="relative w-full aspect-video rounded-xl border border-blue-200 bg-white shadow-sm overflow-hidden">
                          <Image
                            src="/phu_yen_1.jpg"
                            alt="Vùng biển ven bờ Phú Yên - minh họa vùng nội thủy"
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="object-cover"
                          />
                        </div>
                        <p className="mt-2 text-sm text-center text-gray-600 italic">
                          Bờ biển Phú Yên với nhiều tàu thuyền hoạt động ven bờ.
                        </p>
                      </div>

                      <div className="bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 p-4 rounded-xl shadow mb-4 border border-emerald-200">
                        <h4 className="font-bold text-lg mb-2 text-emerald-800">✅ Quyền của người dân</h4>
                        <p className="text-gray-700">
                          &emsp;Vùng nội thủy là nơi sinh sống và hoạt động của đông đảo người dân, vì vậy Luật Biển Việt Nam quy định rất rõ quyền và nghĩa vụ cụ thể của người dân trong vùng nội thủy:
                        </p>
                        <ul className="mt-3 space-y-2 text-gray-800">
                          <li className="rounded-lg border border-emerald-200 bg-white/90 px-3 py-2 shadow-sm">
                            🔹 Người dân có <span className="font-semibold text-blue-700">quyền sử dụng tài nguyên</span> trong vùng nội thủy để{' '}
                            <span className="font-semibold text-blue-700">sinh hoạt</span>, <span className="font-semibold text-blue-700">sản xuất</span> và{' '}
                            <span className="font-semibold text-blue-700">phát triển kinh tế</span>
                          </li>
                          <li className="rounded-lg border border-emerald-200 bg-white/90 px-3 py-2 shadow-sm">
                            🔹 Người dân có <span className="font-semibold text-rose-700">nghĩa vụ bảo vệ tài nguyên và môi trường</span> trong vùng nội thủy,
                            đồng thời phải <span className="font-semibold text-rose-700">tuân thủ các quy định</span> về bảo vệ môi trường và tài nguyên biển
                          </li>
                          <li className="rounded-lg border border-emerald-200 bg-white/90 px-3 py-2 shadow-sm">
                            🔹 Người dân cần phải <span className="font-semibold text-indigo-700">đăng ký</span> và được{' '}
                            <span className="font-semibold text-indigo-700">cấp phép sử dụng tài nguyên</span> trong vùng nội thủy theo{' '}
                            <span className="font-semibold text-indigo-700">quy định của pháp luật</span>
                          </li>
                          <li className="rounded-lg border border-emerald-200 bg-white/90 px-3 py-2 shadow-sm">
                            🔹 Người dân trong vùng nội thủy có <span className="font-semibold text-teal-700">quyền tham gia</span> vào quá trình{' '}
                            <span className="font-semibold text-teal-700">quản lý và sử dụng tài nguyên</span> trong vùng. Chính phủ và các cơ quan chức năng sẽ
                            tạo điều kiện để người dân tham gia vào các hoạt động như{' '}
                            <span className="font-semibold text-teal-700">xây dựng kế hoạch quản lý tài nguyên</span>,{' '}
                            <span className="font-semibold text-teal-700">giám sát hoạt động khai thác</span> và{' '}
                            <span className="font-semibold text-teal-700">bảo vệ tài nguyên biển</span>
                          </li>
                        </ul>
                      </div>

                      {/* <div className="bg-red-50 p-4 rounded-xl shadow mb-4">
                        <h4 className="font-semibold text-lg mb-2">🛡️ Nghĩa vụ</h4>
                        <ul className="list-disc ml-5 text-gray-700 space-y-1">
                          <li>Bảo vệ tài nguyên và môi trường</li>
                          <li>Tuân thủ quy định pháp luật</li>
                          <li>Đăng ký và xin phép khi khai thác tài nguyên</li>
                        </ul>
                      </div> */}

                      <div className="bg-yellow-50 p-4 rounded-xl shadow mt-6">
                        <h4 className="font-semibold text-lg mb-2">💬 Thông điệp</h4>
                        <p className="text-gray-700">
                          Hãy sử dụng hợp lý tài nguyên và cùng bảo vệ môi trường vùng nội thủy để phát triển bền vững.
                        </p>
                      </div>
                    </div>
                  ) : item.id === 'lanh-hai' ? (
                    <div className="max-w-4xl mx-auto font-sans space-y-4">
                      <div className="bg-linear-to-r from-indigo-600 to-blue-700 text-white p-5 rounded-2xl shadow-lg border-l-8 border-cyan-300">
                        <h4 className="text-xl font-bold mb-2">🧭 Khái niệm</h4>
                        <p className="text-white/95">
                          &emsp;Theo <span className="font-semibold text-amber-200">Luật Biển Việt Nam năm 2012</span>,{' '}
                          <span className="font-semibold text-cyan-200">lãnh hải</span> là vùng biển có chiều rộng{' '}
                          <span className="font-semibold text-yellow-200">12 hải lý</span> tính từ{' '}
                          <span className="font-semibold text-cyan-200">đường cơ sở</span> ra phía biển.{' '}
                          <span className="font-semibold text-cyan-200">Ranh giới ngoài của lãnh hải</span> là{' '}
                          <span className="font-semibold text-rose-200">biên giới quốc gia trên biển của Việt Nam</span>.
                        </p>
                      </div>

                      <div className="bg-linear-to-br from-sky-50 to-cyan-50 p-4 rounded-xl shadow border border-sky-200">
                        <h4 className="font-semibold text-lg mb-3 text-sky-900">⚖️ Chế độ pháp lý của lãnh hải (Điều 12)</h4>
                        <div className="space-y-2 text-gray-800">
                          <p className="rounded-lg border border-sky-200 bg-white/90 p-3">
                            1){' '}
                            <span className="inline-flex h-4 w-5 items-center justify-center rounded-sm bg-red-600 text-[9px] leading-none text-yellow-300 align-middle mr-1">
                              ★
                            </span>
                            Nhà nước thực hiện <span className="font-semibold text-rose-700">chủ quyền đầy đủ và toàn vẹn</span> đối với{' '}
                            <span className="font-semibold text-cyan-700">lãnh hải</span>, <span className="font-semibold text-cyan-700">vùng trời</span>,{' '}
                            <span className="font-semibold text-cyan-700">đáy biển</span> và <span className="font-semibold text-cyan-700">lòng đất dưới đáy biển</span>{' '}
                            của lãnh hải, phù hợp với <span className="font-semibold text-indigo-700">Công ước Liên hợp quốc về Luật biển năm 1982</span>.
                          </p>
                          <p className="rounded-lg border border-sky-200 bg-white/90 p-3">
                            2) 🚢 <span className="font-semibold text-emerald-700">Tàu thuyền của tất cả các quốc gia</span> được hưởng{' '}
                            <span className="font-semibold text-emerald-700">quyền đi qua không gây hại</span> trong lãnh hải Việt Nam. Đối với{' '}
                            <span className="font-semibold text-amber-700">tàu quân sự nước ngoài</span>, khi thực hiện quyền này phải{' '}
                            <span className="font-semibold text-amber-700">thông báo trước</span> cho cơ quan có thẩm quyền của Việt Nam.
                          </p>
                          <p className="rounded-lg border border-sky-200 bg-white/90 p-3">
                            3) 🕊️ Việc đi qua không gây hại của tàu thuyền nước ngoài phải thực hiện trên cơ sở{' '}
                            <span className="font-semibold text-violet-700">tôn trọng hòa bình, độc lập, chủ quyền, pháp luật Việt Nam</span> và{' '}
                            <span className="font-semibold text-violet-700">điều ước quốc tế</span> mà Việt Nam là thành viên.
                          </p>
                          <p className="rounded-lg border border-sky-200 bg-white/90 p-3">
                            4) ✈️ <span className="font-semibold text-fuchsia-700">Phương tiện bay nước ngoài</span> không được vào vùng trời trên lãnh hải Việt Nam,
                            trừ trường hợp được sự đồng ý của Chính phủ Việt Nam hoặc thực hiện theo điều ước quốc tế mà Việt Nam là thành viên.
                          </p>
                          <p className="rounded-lg border border-sky-200 bg-white/90 p-3">
                            5) 🏺 Nhà nước có <span className="font-semibold text-rose-700">chủ quyền</span> đối với mọi loại{' '}
                            <span className="font-semibold text-rose-700">hiện vật khảo cổ, lịch sử</span> trong lãnh hải Việt Nam.
                          </p>
                        </div>
                      </div>

                      <div className="">
                        <div className="relative w-full aspect-video rounded-lg border border-blue-100 bg-white shadow-sm overflow-hidden">
                          <Image
                            src="/lanhquyen.png"
                            alt="Minh họa lãnh hải và chủ quyền"
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="object-cover"
                          />
                        </div>
                        <p className="mt-2 text-sm text-center text-gray-600 italic">
                          Cần ngăn chặn các hành vi ảnh hưởng đến an ninh quốc gia.
                        </p>
                      </div>
                    </div>
                  ) : item.id === 'vung-tiep-giap' ? (
                    <div className="max-w-4xl mx-auto font-sans">

                      {/* Tiêu đề */}
                      <div className="bg-linear-to-r from-blue-700 via-indigo-800 to-blue-900 text-white p-5 rounded-2xl shadow-xl mb-5 border-l-8 border-yellow-300 ring-2 ring-blue-300/60">
                        <h3 className="text-xl font-extrabold mb-3 tracking-wide text-yellow-100">
                          🌊 VÙNG TIẾP GIÁP LÃNH HẢI
                        </h3>

                        <p>
                          📜 Theo{' '}
                          <span className="font-bold text-yellow-300">
                            Luật Biển Việt Nam năm 2012
                          </span>
                        </p>
                      </div>

                      {/* Khái niệm */}
                      <div className="bg-blue-50 p-4 rounded-xl shadow border border-blue-200 mb-4">
                        <h4 className="font-bold text-lg text-blue-800">
                          📘 Khái niệm vùng tiếp giáp lãnh hải
                        </h4>

                        <p className="mt-2">
                          <span className="font-semibold text-blue-900">
                            Vùng tiếp giáp lãnh hải
                          </span>{' '}
                          là vùng biển tiếp liền và nằm ngoài lãnh hải Việt Nam, có chiều rộng{' '}
                          <span className="font-bold text-blue-900">
                            🌊 12 hải lý
                          </span>{' '}
                          tính từ{' '}
                          <span className="font-semibold text-indigo-900">
                            ranh giới ngoài của lãnh hải
                          </span>.
                        </p>
                      </div>

                      {/* Điều 14 */}
                      <div className="bg-yellow-50 p-4 rounded-xl shadow border border-yellow-200 mb-4">
                        <h4 className="font-bold text-lg">
                          ⚖️ Điều 14. Chế độ pháp lý của vùng tiếp giáp lãnh hải
                        </h4>

                        <p className="mt-2">
                          1. Nhà nước thực hiện{' '}
                          <span className="font-semibold text-blue-900">
                            quyền chủ quyền
                          </span>,{' '}
                          <span className="font-semibold text-indigo-900">
                            quyền tài phán quốc gia
                          </span>{' '}
                          và các quyền khác quy định tại Điều 16 của Luật này đối với{' '}
                          <span className="font-semibold text-blue-900">
                            vùng tiếp giáp lãnh hải
                          </span>.
                        </p>

                        <p className="mt-2">
                          Như:
                        </p>

                        <p className="mt-2">
                          -{' '}
                          <span className="font-semibold text-blue-900">
                            Quyền chủ quyền
                          </span>{' '}
                          về việc thăm dò, khai thác, quản lý và bảo tồn tài nguyên thuộc vùng nước bên trên đáy biển, đáy biển và lòng đất dưới đáy biển; về các hoạt động khác nhằm thăm dò, khai thác vùng này vì mục đích kinh tế;
                        </p>

                        <p className="mt-2">
                          -{' '}
                          <span className="font-semibold text-indigo-900">
                            Quyền tài phán quốc gia
                          </span>{' '}
                          về lắp đặt và sử dụng đảo nhân tạo, thiết bị và công trình trên biển; nghiên cứu khoa học biển, bảo vệ và gìn giữ môi trường biển;
                        </p>

                        <p className="mt-2">
                          2. Nhà nước thực hiện{' '}
                          <span className="font-semibold text-amber-800">
                            kiểm soát
                          </span>{' '}
                          trong{' '}
                          <span className="font-semibold text-blue-900">
                            vùng tiếp giáp lãnh hải
                          </span>{' '}
                          nhằm{' '}
                          <span className="font-semibold text-indigo-900">
                            ngăn ngừa và xử lý hành vi vi phạm pháp luật
                          </span>{' '}
                          về{' '}
                          <span className="font-semibold text-blue-900">
                            hải quan, thuế, y tế, xuất nhập cảnh
                          </span>{' '}
                          xảy ra trên lãnh thổ hoặc trong lãnh hải Việt Nam.
                        </p>
                      </div>

                      {/* Quyền truy đuổi */}
                      <div className="bg-red-50 p-4 rounded-xl shadow border border-red-200">
                        <h4 className="font-bold text-lg text-red-700">
                          🚨 Quyền truy đuổi tàu thuyền trên biển
                        </h4>

                        <p className="mt-2">
                          Theo{' '}
                          <span className="font-semibold text-blue-900">
                            Điều 41 Luật Biển Việt Nam 2012
                          </span>:
                        </p>

                        <p className="mt-2">
                          1. Lực lượng tuần tra, kiểm soát trên biển có{' '}
                          <span className="font-semibold text-indigo-900">
                            quyền truy đuổi
                          </span>{' '}
                          tàu thuyền nước ngoài vi phạm các quy định của pháp luật Việt Nam nếu tàu thuyền này đang ở trong{' '}
                          <span className="font-semibold text-blue-900">
                            nội thủy, lãnh hải và vùng tiếp giáp lãnh hải Việt Nam
                          </span>.
                        </p>

                        <p className="mt-2">
                          Quyền truy đuổi được tiến hành sau khi lực lượng tuần tra, kiểm soát trên biển đã phát tín hiệu yêu cầu tàu thuyền vi phạm hay có dấu hiệu vi phạm pháp luật{' '}
                          <span className="font-semibold text-red-700">
                            dừng lại để tiến hành kiểm tra
                          </span>{' '}
                          nhưng tàu thuyền đó không chấp hành.
                        </p>

                        <p className="mt-2">
                          Việc truy đuổi có thể được tiếp tục ở ngoài ranh giới của lãnh hải hay vùng tiếp giáp lãnh hải Việt Nam nếu được tiến hành{' '}
                          <span className="font-semibold text-red-700">
                            liên tục, không ngắt quãng
                          </span>.
                        </p>
                      </div>
                      <div className="mt-2">
                        <div className="relative w-full aspect-video rounded-lg border border-cyan-100 bg-white shadow-sm overflow-hidden">
                          <Image
                            src="/tepgiaplh.png"
                            alt="Minh họa vùng tiếp giáp lãnh hải"
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="object-cover"
                          />
                        </div>
                        <p className="mt-2 text-sm text-center text-gray-600 italic">
                          Tăng cường tuần tra, kiểm soát để bảo vệ chủ quyền và lợi ích quốc gia trên biển.
                        </p>
                      </div>
                    </div>
                  ) : item.id === 'vung-dac-quyen' ? (
                    <div className="max-w-4xl mx-auto font-sans">

                      {/* Tiêu đề */}
                      <div className="bg-linear-to-r from-blue-700 via-indigo-800 to-blue-900 text-white p-5 rounded-2xl shadow-xl mb-5 border-l-8 border-yellow-300 ring-2 ring-blue-300/60">
                        <h3 className="text-xl font-extrabold mb-3 tracking-wide text-yellow-100">
                          🌊 VÙNG ĐẶC QUYỀN KINH TẾ & THỀM LỤC ĐỊA
                        </h3>

                        <p>
                          📜 Theo{' '}
                          <span className="font-bold text-yellow-300">
                            Luật số: 18/2012/QH13
                          </span>{' '}
                          Luật Biển Việt Nam năm 2012
                        </p>
                      </div>

                      {/* Điều 15 */}
                      <div className="bg-blue-50 p-4 rounded-xl shadow border border-blue-200 mb-4">
                        <h4 className="font-bold text-lg text-blue-800">
                          📘 Điều 15. Vùng đặc quyền kinh tế
                        </h4>

                        <p className="mt-2">
                          Vùng đặc quyền kinh tế là vùng biển tiếp liền và nằm ngoài lãnh hải Việt Nam, hợp với lãnh hải thành một vùng biển có chiều rộng{' '}
                          <span className="font-bold text-blue-900">
                            🌊 200 hải lý
                          </span>{' '}
                          tính từ{' '}
                          <span className="font-semibold text-indigo-900">
                            đường cơ sở
                          </span>.
                        </p>
                      </div>

                      {/* Điều 17 */}
                      <div className="bg-white p-4 rounded-xl shadow border border-blue-200 mb-4">
                        <h4 className="font-bold text-lg text-blue-800">
                          🧭 Điều 17. Thềm lục địa
                        </h4>

                        <p className="mt-2">
                          <span className="font-semibold text-blue-900">
                            Thềm lục địa
                          </span>{' '}
                          là vùng đáy biển và lòng đất dưới đáy biển, tiếp liền và nằm ngoài lãnh hải Việt Nam, trên toàn bộ phần kéo dài tự nhiên của lãnh thổ đất liền, các đảo và quần đảo của Việt Nam cho đến{' '}
                          <span className="font-semibold text-indigo-900">
                            mép ngoài của rìa lục địa
                          </span>.
                        </p>
                      </div>

                      {/* Điều 16 */}
                      <div className="bg-yellow-50 p-4 rounded-xl shadow border border-yellow-200 mb-4">
                        <h4 className="font-bold text-lg">
                          ⚖️ Điều 16. Chế độ pháp lý của vùng đặc quyền kinh tế
                        </h4>

                        <p className="mt-2">
                          1. Trong vùng đặc quyền kinh tế, Nhà nước thực hiện:
                        </p>

                        <p className="mt-2">
                          a){' '}
                          <span className="font-semibold text-blue-900">
                            🔑 Quyền chủ quyền
                          </span>{' '}
                          về việc thăm dò, khai thác, quản lý và bảo tồn tài nguyên thuộc vùng nước bên trên đáy biển, đáy biển và lòng đất dưới đáy biển; về các hoạt động khác nhằm thăm dò, khai thác vùng này vì mục đích kinh tế;
                        </p>

                        <p className="mt-2">
                          b){' '}
                          <span className="font-semibold text-indigo-900">
                            🏛️ Quyền tài phán quốc gia
                          </span>{' '}
                          về lắp đặt và sử dụng đảo nhân tạo, thiết bị và công trình trên biển; nghiên cứu khoa học biển, bảo vệ và gìn giữ môi trường biển;
                        </p>

                        <p className="mt-2">
                          c){' '}
                          <span className="font-semibold text-amber-800">
                            🌐 Các quyền và nghĩa vụ khác
                          </span>{' '}
                          phù hợp với pháp luật quốc tế.
                        </p>

                        <p className="mt-3">
                          2. Nhà nước tôn trọng quyền tự do hàng hải, hàng không; quyền đặt dây cáp, ống dẫn ngầm và hoạt động sử dụng biển hợp pháp của các quốc gia khác trong{' '}
                          <span className="font-semibold text-blue-900">
                            vùng đặc quyền kinh tế của Việt Nam
                          </span>{' '}
                          theo quy định của Luật này và{' '}
                          <span className="font-semibold text-indigo-900">
                            điều ước quốc tế
                          </span>{' '}
                          mà nước Cộng hòa xã hội chủ nghĩa Việt Nam là thành viên, không làm phương hại đến quyền chủ quyền, quyền tài phán quốc gia và lợi ích quốc gia trên biển của Việt Nam.
                        </p>

                        <p className="mt-2">
                          ⚠️ Việc lắp đặt dây cáp và ống dẫn ngầm phải có{' '}
                          <span className="font-bold text-red-700">
                            sự chấp thuận bằng văn bản
                          </span>{' '}
                          của{' '}
                          <span className="font-semibold text-red-700">
                            cơ quan nhà nước có thẩm quyền của Việt Nam
                          </span>.
                        </p>
                      </div>

                      {/* Điều 18 */}
                      <div className="bg-red-50 p-4 rounded-xl shadow border border-red-200">
                        <h4 className="font-bold text-lg text-red-700">
                          📌 Điều 18. Chế độ pháp lý của thềm lục địa
                        </h4>

                        <p className="mt-2">
                          1. Nhà nước thực hiện{' '}
                          <span className="font-semibold text-blue-900">
                            quyền chủ quyền
                          </span>{' '}
                          đối với{' '}
                          <span className="font-semibold text-indigo-900">
                            thềm lục địa
                          </span>{' '}
                          về thăm dò, khai thác tài nguyên.
                        </p>

                        <p className="mt-2">
                          2. Quyền chủ quyền quy định tại khoản 1 Điều này có tính chất đặc quyền,{' '}
                          <span className="font-bold text-red-700">
                            🚫 không ai có quyền
                          </span>{' '}
                          tiến hành hoạt động thăm dò thềm lục địa hoặc khai thác tài nguyên của thềm lục địa nếu không có{' '}
                          <span className="font-bold text-red-700">
                            sự đồng ý của Chính phủ Việt Nam
                          </span>.
                        </p>

                        <p className="mt-2">
                          3. Nhà nước có quyền{' '}
                          <span className="font-semibold text-blue-900">
                            khai thác lòng đất dưới đáy biển
                          </span>, cho phép và quy định việc khoan nhằm bất kỳ mục đích nào ở{' '}
                          <span className="font-semibold text-indigo-900">
                            thềm lục địa
                          </span>.
                        </p>

                        <p className="mt-2">
                          4. Nhà nước tôn trọng quyền đặt dây cáp, ống dẫn ngầm và hoạt động sử dụng biển hợp pháp khác của các quốc gia khác ở{' '}
                          <span className="font-semibold text-blue-900">
                            thềm lục địa Việt Nam
                          </span>{' '}
                          theo quy định của Luật này và các{' '}
                          <span className="font-semibold text-indigo-900">
                            điều ước quốc tế
                          </span>{' '}
                          mà nước Cộng hòa xã hội chủ nghĩa Việt Nam là thành viên.
                        </p>

                        <p className="mt-2">
                          ⚠️ Việc lắp đặt dây cáp và ống dẫn ngầm phải có{' '}
                          <span className="font-bold text-red-700">
                            sự chấp thuận bằng văn bản
                          </span>{' '}
                          của cơ quan nhà nước có thẩm quyền của Việt Nam.
                        </p>

                        <p className="mt-2">
                          5. Tổ chức, cá nhân nước ngoài được tham gia thăm dò, sử dụng, khai thác tài nguyên, nghiên cứu khoa học, lắp đặt thiết bị và công trình ở{' '}
                          <span className="font-semibold text-indigo-900">
                            thềm lục địa của Việt Nam
                          </span>{' '}
                          trên cơ sở{' '}
                          <span className="font-semibold text-amber-800">
                            điều ước quốc tế
                          </span>{' '}
                          mà nước Cộng hòa xã hội chủ nghĩa Việt Nam là thành viên.
                        </p>
                      </div>
                      <div className="mt-2">
                        <div className="relative w-full aspect-video rounded-lg border border-blue-100 bg-white shadow-sm overflow-hidden">
                          <Image
                            src="/vungdacquyen.png"
                            alt="Minh họa vùng đặc quyền kinh tế và thềm lục địa"
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="object-cover"
                            priority
                          />
                        </div>
                        <p className="mt-2 text-sm text-center text-gray-600 italic">
                          Khẳng định quyền chủ quyền của Việt Nam trong vùng đặc quyền kinh tế và thềm lục địa.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                      {item.content}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <Card className="p-6 shadow-xl bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-amber-800">Lưu ý khi làm bài trắc nghiệm</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 text-amber-700">
              <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Bài trắc nghiệm gồm <strong>6 câu hỏi</strong> được chọn ngẫu nhiên từ ngân hàng đề</span>
            </li>
            <li className="flex items-start gap-3 text-amber-700">
              <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Thời gian làm bài: <strong>6 phút</strong></span>
            </li>
            <li className="flex items-start gap-3 text-amber-700">
              <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Mỗi học sinh <strong>chỉ được làm bài 1 lần</strong></span>
            </li>
            <li className="flex items-start gap-3 text-amber-700">
              <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>Sau khi nộp bài, bạn không thể làm lại</span>
            </li>
            <li className="flex items-start gap-3 text-amber-700">
              <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Hãy đọc kỹ nội dung ôn tập trước khi bắt đầu làm bài</span>
            </li>
          </ul>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="px-8 py-6 text-lg font-semibold bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg"
            onClick={() => router.push('/consolidation')}
          >
            Bắt đầu Hải Trình Kì Bí
          </Button>
        </div>
      </div>
    </div>
  )
}
