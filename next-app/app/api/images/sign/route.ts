import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'
import { z } from 'zod'

const signUploadSchema = z.object({
  folder: z.string().optional().default('rental-spaces'),
  public_id: z.string().optional(),
  transformation: z.string().optional(),
  eager: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = signUploadSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }
    const { folder, public_id, transformation, eager } = parsed.data

    const timestamp = Math.round(new Date().getTime() / 1000)
    
    // Build params for signature
    const params: Record<string, any> = {
      timestamp,
      folder,
    }
    
    if (public_id) params.public_id = public_id
    if (transformation) params.transformation = transformation
    if (eager) params.eager = eager

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!)

    return NextResponse.json({
      success: true,
      data: {
        signature,
        timestamp,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        folder,
        ...(public_id && { public_id }),
        ...(transformation && { transformation }),
        ...(eager && { eager }),
      }
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}
