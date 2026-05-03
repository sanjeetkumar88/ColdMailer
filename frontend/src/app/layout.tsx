import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://coldmailer.me'),
  title: 'ColdMailer - #1 Cold Email Automation Platform for Job Seekers & Teams',
  description: 'Scale your outreach with ColdMailer. Automate personalized cold emails, rotate multiple senders, and track analytics in real-time. The ultimate tool for job applications and B2B sales.',
  keywords: [
    "Cold Email Automation", "Job Application Tool", "Multi-sender Rotation",
    "Email Outreach Software", "B2B Sales Automation", "MailFlow", "ColdMailer",
    "Recruiter Outreach", "Automated Job Applications", "Sales Prospecting Tool"
  ],
  alternates: {
    canonical: 'https://coldmailer.me',
  },
  authors: [{ name: "ColdMailer Team" }],
  creator: "ColdMailer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coldmailer.me",
    title: "ColdMailer - Automate Your Email Outreach at Scale",
    description: "Send personalized emails to thousands of recipients without hitting spam filters. The standard for modern outreach.",
    siteName: "ColdMailer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ColdMailer Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ColdMailer - #1 Cold Email Automation Platform",
    description: "Scale your outreach with ColdMailer. Automate personalized cold emails and rotate multiple senders.",
    images: ["/og-image.png"],
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

import { Providers } from '@/components/providers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ColdMailer",
              "url": "https://coldmailer.me",
              "operatingSystem": "Web",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "The modern standard for high-deliverability cold outreach and job application automation. Scale your networking with multi-sender rotation and AI-driven personalization.",
              "featureList": [
                "Multi-sender Rotation",
                "AI-driven Personalization",
                "Automated Follow-ups",
                "Real-time Analytics",
                "Secure SMTP/OAuth Integration"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1248"
              }
            })
          }}
        />
      </body>
    </html>
  )
}
