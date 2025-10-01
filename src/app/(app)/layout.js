import localFont from 'next/font/local';
import './globals.css'
import './leaflet.css'
// import './vendor.css'

const Pinegrove = localFont({
  src: '../../../public/fonts/PinegroveNeue-Regular.ttf',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pg',
})

const SpecialElite = localFont({
  src: '../../../public/fonts/SpecialElite-Regular.ttf',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-se',
})

const APP_NAME = "Pinegrove | Mapster";
const APP_DEFAULT_TITLE = "Pinegrove | Mapster";
const APP_DESCRIPTION = "Pinegrove is an American rock band formed in Montclair, New Jersey in 2010.";

export const viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#414F4E" }],
  colorScheme: 'dark',
  viewport:
  "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
}

export const metadata = {
    metadataBase: new URL('https://groveography.vercel.app/'),
    applicationName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
    },
    description: APP_DESCRIPTION,
    icons: {
      icon: '/icon-192x192.png',
      shortcut: '/icon-192x192.png',
      apple: '/icon-192x192.png',
    },
    robots: "noindex",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: APP_DEFAULT_TITLE,
    },
    formatDetection: {
      telephone: false,
    },
    generator: 'Next.js',
    manifest: "/manifest.json",
    applicationName: APP_NAME,
    referrer: 'origin-when-cross-origin',
    keywords: ['music', 'rock',],
    authors: [{ name: 'Router', url: 'https://router.is' }],
    openGraph: {
      title: APP_DEFAULT_TITLE,
      description: APP_DESCRIPTION,
      url: 'https://groveography.vercel.app/',
      siteName: APP_NAME,
      images: [
        {
          url: '/og_image.png',
          width: 1200,
          height: 630,
          alt: 'Pinegrove Map',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: APP_DEFAULT_TITLE,
      description: APP_DESCRIPTION,
      images: ['/og_image.png'],
    },
  }


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${Pinegrove.variable} ${SpecialElite.variable} font-serif w-full h-full overscroll-none`}>
        {children}
      </body>
    </html>
  )
}
