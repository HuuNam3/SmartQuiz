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
  title: 'Củng cố kiến thức bài học',
  description: 'Ứng dụng củng cố kiến thức bài học',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: 'https://filethpt.hcm.edu.vn/UploadImages/Config/thptlethihonggam/Logo%20LTHG.GIF',
        media: '(prefers-color-scheme: light)',
      },
      // {
      //   url: '/icon-dark-32x32.png',
      //   media: '(prefers-color-scheme: dark)',
      // },
      // {
      //   url: '/icon.svg',
      //   type: 'image/svg+xml',
      // },
    ],
  },
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
