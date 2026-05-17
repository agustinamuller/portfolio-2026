import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Agustina Müller — UX/UI & Product Designer',
    template: '%s — Agustina Müller',
  },
  description:
    'UX/UI & Product Designer from Argentina. Mobile apps, web platforms, design systems, and SaaS products.',
  openGraph: {
    title: 'Agustina Müller — UX/UI & Product Designer',
    description:
      'UX/UI & Product Designer from Argentina. Mobile apps, web platforms, design systems, and SaaS products.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agustina Müller — UX/UI & Product Designer',
    description:
      'UX/UI & Product Designer from Argentina. Mobile apps, web platforms, design systems, and SaaS products.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Cada vez que se refresca la página, vuelve al top (hero). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              window.scrollTo(0, 0);
            `,
          }}
        />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
