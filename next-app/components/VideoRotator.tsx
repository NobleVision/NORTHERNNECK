'use client'

import { useState, useEffect, useRef } from 'react'

export default function VideoRotator() {
  const [videos, setVideos] = useState<string[]>([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

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
    const video = videoRef.current
    if (video && videos.length > 0) {
      const handleEnded = () => {
        // Fade out
        setOpacity(0)
        // After fade out, change video and fade in
        setTimeout(() => {
          setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
          setOpacity(1)
        }, 500) // Match the CSS transition duration
      }

      video.addEventListener('ended', handleEnded)
      return () => video.removeEventListener('ended', handleEnded)
    }
  }, [videos])

  useEffect(() => {
    const video = videoRef.current
    if (video && videos.length > 0) {
      video.load()
      video.play().catch(() => {}) // Handle autoplay restrictions
    }
  }, [currentVideoIndex, videos])

  if (loading || videos.length === 0) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="text-white">Loading videos...</div>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      style={{ opacity }}
      autoPlay
      muted
      playsInline
    >
      <source src={videos[currentVideoIndex]} type="video/mp4" />
      <source src={videos[currentVideoIndex].replace('.mp4', '.webm')} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  )
}