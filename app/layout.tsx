import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeSwitcher } from "./components/theme-switcher"
import { GoogleAnalytics } from '@next/third-parties/google'
import { CookieConsent } from "./components/cookie-consent"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="unbody-theme"
        >
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <ThemeSwitcher />
          </div>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-80Y0X2Y0VX" />
        <CookieConsent />
      </body>
    </html>
  )
}

export const metadata = {
    generator: 'v0.dev'
};
