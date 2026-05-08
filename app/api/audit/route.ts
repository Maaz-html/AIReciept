import { NextResponse } from 'next/server'
import { runAudit, FormData } from '@/lib/auditEngine'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    const body: FormData = await request.json()
    const results = runAudit(body)

    const { data, error } = await supabaseAdmin
      .from('audits')
      .insert({
        form_data: body,
        results: results,
        total_monthly_savings: results.totalMonthlySavings,
        total_annual_savings: results.totalAnnualSavings,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase Error:', error.message, error.details, error.hint)
      return NextResponse.json({ 
        error: 'Failed to save audit to database', 
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      id: data.id, 
      results: results 
    })
  } catch (err) {
    console.error('Audit API Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
