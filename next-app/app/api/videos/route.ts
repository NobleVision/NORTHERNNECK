import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const videoDir = path.join(process.cwd(), 'public', 'video')
    const files = fs.readdirSync(videoDir)
    const videos = files.filter(file => file.endsWith('.mp4') || file.endsWith('.webm')).map(file => `/video/${file}`)
    return NextResponse.json({ videos })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list videos' }, { status: 500 })
  }
}