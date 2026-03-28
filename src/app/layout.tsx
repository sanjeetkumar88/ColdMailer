import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ColdMailer - Email Automation Platform',
  description: 'Send personalized emails to multiple recipients efficiently. Perfect for job applications and outreach.',
  keywords: [
    "Cold Email", "Email Automation", "Job Application Automated", 
    "Mass Email", "Sales Outreach", "Networking", "ColdMailer"
  ],
  authors: [{ name: "ColdMailer Team" }],
  creator: "ColdMailer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coldmailer.com",
    title: "ColdMailer - Automate Your Email Outreach",
    description: "Send personalized emails to multiple recipients efficiently. Perfect for job seekers, freelancers, and marketers.",
    siteName: "ColdMailer",
  },
  twitter: {
    card: "summary_large_image",
    title: "ColdMailer - Automate Your Email Outreach",
    description: "Send personalized emails to multiple recipients efficiently.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
