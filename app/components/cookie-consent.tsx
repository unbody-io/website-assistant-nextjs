'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    console.log('Cookie consent status:', consent)
    if (!consent) {
      setShowBanner(true)
      // Default to denied
      window.gtag?.('consent', 'default', {
        'analytics_storage': 'denied'
      })
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    window.gtag?.('consent', 'update', {
      'analytics_storage': 'granted'
    })
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowBanner(false)
  }

  // Debug render
  console.log('Rendering CookieConsent, showBanner:', showBanner)

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          We use cookies to analyze our traffic and improve your experience. 
          Would you like to accept analytics cookies?
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={declineCookies}>
            Decline
          </Button>
          <Button onClick={acceptCookies}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
} 