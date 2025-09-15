'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import JRGrahamLayout from '@/components/JRGrahamLayout'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page
    router.push('/home')
  }, [router])

  return (
    <JRGrahamLayout>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Redirecting to home page...</p>
        </div>
      </div>
    </JRGrahamLayout>
  )
}
