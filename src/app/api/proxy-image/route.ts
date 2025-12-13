import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type') || 'image/png'
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename="download.png"',
      },
    })
  } catch (error) {
    console.error('Proxy image error:', error)
    return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 })
  }
}

