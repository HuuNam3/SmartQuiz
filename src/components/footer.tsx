export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-3">Về Hệ Thống</h3>
            <p className="text-blue-200 text-sm">
              Hệ thống quản lý học sinh toàn diện, giúp học sinh kiểm tra kiến thức và quản lý thông tin cá nhân một cách hiệu quả.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><a href="/" className="hover:text-white transition">Trang Chủ</a></li>
              <li><a href="/quiz" className="hover:text-white transition">Trắc Nghiệm</a></li>
              <li><a href="/profile" className="hover:text-white transition">Hồ Sơ Học Sinh</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-3">Liên Hệ</h3>
            <p className="text-blue-200 text-sm">
              Email: <a href="mailto:info@hethong.edu" className="hover:text-white transition">info@hethong.edu</a>
            </p>
            <p className="text-blue-200 text-sm mt-2">
              Điện thoại: <a href="tel:+84-123-456-789" className="hover:text-white transition">+84 (123) 456-789</a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800"></div>

        {/* Copyright */}
        <div className="mt-8 text-center text-blue-200 text-sm">
          <p>&copy; {currentYear} Hệ Thống Quản Lý Học Sinh. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
