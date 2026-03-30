import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { UserProvider } from '@/context/user-context'
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Hệ thống Quản lý Học sinh',
  description: 'Ứng dụng quản lý thông tin học sinh',
  generator: 'v0.app',
  // icons: {
  //   icon: [
  //     {
  //       url: '/icon-light-32x32.png',
  //       media: '(prefers-color-scheme: light)',
  //     },
  //     {
  //       url: '/icon-dark-32x32.png',
  //       media: '(prefers-color-scheme: dark)',
  //     },
  //     {
  //       url: '/icon.svg',
  //       type: 'image/svg+xml',
  //     },
  //   ],
  // apple: '/apple-icon.png',
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi"
      className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <UserProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Toaster />
          <Footer />
        </UserProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
