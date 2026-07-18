import type { Metadata, Viewport } from 'next'
import {
  META_KEYWORDS,
  SITE_DESCRIPTION_RU,
  SITE_NAME,
  SITE_TITLE_RU,
  SITE_URL,
  buildFaqJsonLd,
  buildSoftwareAppJsonLd,
  buildWebApplicationJsonLd,
  buildWebSiteJsonLd,
} from '../seo.config'
import '../src/index.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE_RU,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION_RU,
  keywords: META_KEYWORDS.split(', '),
  authors: [{ name: SITE_NAME }],
  applicationName: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      ru: '/',
      en: '/',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: ['en_US'],
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_TITLE_RU,
    description: SITE_DESCRIPTION_RU,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BindLab — генератор биндов CS2',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE_RU,
    description: SITE_DESCRIPTION_RU,
    images: ['/og-image.png'],
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    yandex: 'index, follow',
  },
}

export const viewport: Viewport = {
  themeColor: '#05080e',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

function JsonLdScripts() {
  const blocks = [
    buildWebApplicationJsonLd(),
    buildWebSiteJsonLd(),
    buildFaqJsonLd(),
    buildSoftwareAppJsonLd(),
  ]
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Tektur:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <JsonLdScripts />
      </head>
      <body className="bg-surface-bg font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
