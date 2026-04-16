import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json(
      { error: 'Supabase環境変数が未設定です' },
      { status: 500 }
    )
  }

  try {
    const supabase = createClient(url, key)

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data ?? [])
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json(
      { error: 'Supabase環境変数が未設定です' },
      { status: 500 }
    )
  }

  try {
    const { name } = await req.json()

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        { error: '習慣名を入力してください' },
        { status: 400 }
      )
    }

    const supabase = createClient(url, key)

    const { data, error } = await supabase
      .from('habits')
      .insert({ name: String(name).trim() })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'unknown error' },
      { status: 500 }
    )
  }
}