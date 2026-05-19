// src/app/api/upload-image/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated (you can add more checks here)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'product' or 'blog'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Initialize Supabase client with SERVICE ROLE KEY (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Service role key - has admin privileges
    )

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const bucket = type === 'blog' ? 'blog' : 'products'
    const filePath = `${type}/${fileName}`

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    // For products, save the image record to database
    if (type === 'product') {
      const productId = formData.get('product_id') as string
      const altText = formData.get('alt_text') as string || ''
      const displayOrder = parseInt(formData.get('display_order') as string) || 0

      const { error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: publicUrl,
          alt_text: altText,
          display_order: displayOrder,
        })

      if (dbError) {
        console.error('Database insert error:', dbError)
        // Note: RLS policy will NOT apply here because we're using service role
        return NextResponse.json(
          { error: dbError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      publicUrl,
      filePath,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}