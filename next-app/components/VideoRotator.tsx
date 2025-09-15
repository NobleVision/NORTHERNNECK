'use client'

import { useState, useEffect, useRef } from 'react'

export default function VideoRotator() {
  const [videos, setVideos] = useState<string[]>([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [nextVideoIndex, setNextVideoIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [loading, setLoading] = useState(true)
  const currentVideoRef = useRef<HTMLVideoElement>(null)
  const nextVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        setVideos(data.videos)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const currentVideo = currentVideoRef.current
    const nextVideo = nextVideoRef.current

    if (currentVideo && nextVideo && videos.length > 1) {
      const handleEnded = () => {
        setIsTransitioning(true)
        nextVideo.play().catch(() => {})

        setTimeout(() => {
          setCurrentVideoIndex(nextVideoIndex)
          setNextVideoIndex((nextVideoIndex + 1) % videos.length)
          setIsTransitioning(false)
        }, 1000) // 1 second transition
      }

      currentVideo.addEventListener('ended', handleEnded)
      return () => currentVideo.removeEventListener('ended', handleEnded)
    }
  }, [videos, nextVideoIndex])

  useEffect(() => {
    const nextVideo = nextVideoRef.current
    if (nextVideo && videos.length > 0) {
      nextVideo.load()
    }
  }, [nextVideoIndex, videos])

  if (loading || videos.length === 0) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="text-white">Loading videos...</div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        ref={currentVideoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        autoPlay
        muted
        playsInline
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        <source src={videos[currentVideoIndex].replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {videos.length > 1 && (
        <video
          ref={nextVideoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
          muted
          playsInline
          preload="auto"
        >
          <source src={videos[nextVideoIndex]} type="video/mp4" />
          <source src={videos[nextVideoIndex].replace('.mp4', '.webm')} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}