import type { Metadata } from 'next'
import { Outfit, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import Script from 'next/script'

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL('https://coldmailer.me'),
  title: 'ColdMailer | #1 Cold Email Automation Tool - Get 3x More Interviews',
  description: 'The modern standard for high-deliverability cold outreach. Automate personalized emails, rotate senders to bypass spam, and land your dream job or scale B2B sales with AI-driven precision.',
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
    title: "ColdMailer - Automate Your Email Outreach & Land More Interviews",
    description: "Send personalized emails at scale without hitting spam filters. The ultimate tool for job seekers and growth teams.",
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
    title: "ColdMailer | #1 Cold Email Automation Platform",
    description: "Land more interviews and leads with ColdMailer. Automate personalized emails and rotate multiple senders with ease.",
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
      <body className={`${outfit.variable} ${_geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
        <Script
          id="schema-org"
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
