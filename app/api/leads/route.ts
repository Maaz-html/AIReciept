import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, company, role, audit_id } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        email,
        company_name: company,
        role,
        audit_id: audit_id,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase Lead Error:', error)
      return NextResponse.json({ error: 'Failed to save lead', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Lead API Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
