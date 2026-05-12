import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { Resend } from 'resend'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const resend = new Resend(process.env.RESEND_API_KEY)

// Setup Upstash Ratelimit
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, company_name, role, team_size, audit_id, monthly_savings, website } = body

    // Honeypot check
    if (website) {
      console.log('Honeypot triggered')
      return NextResponse.json({ ok: true })
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const { success } = await ratelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // Basic validation
    if (!email || !audit_id) {
      return NextResponse.json({ error: 'Email and audit ID are required' }, { status: 400 })
    }

    // Save to Supabase using supabaseAdmin to bypass RLS
    const { error: dbError } = await supabaseAdmin
      .from('leads')
      .insert({
        email,
        company_name,
        role,
        team_size,
        audit_id,
        created_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('Supabase Error:', dbError.message, dbError.details)
      return NextResponse.json({ 
        error: 'Failed to save lead', 
        message: dbError.message,
        details: dbError.details 
      }, { status: 500 })
    }

    // Send email via Resend
    const host = req.headers.get('host')
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const origin = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
    const resultsUrl = `${origin}/results/${audit_id}`
    
    console.log('Sending email with resultsUrl:', resultsUrl)
    
    let htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Your AI Spend Audit Report</h1>
        <p>Hello,</p>
        <p>Thank you for using SpendSmart AI. We've analyzed your SaaS stack and identified potential optimizations.</p>
        <p><strong>Total Potential Monthly Savings: $${monthly_savings.toLocaleString()}</strong></p>
    `

    if (monthly_savings > 500) {
      htmlContent += `
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #166534;"><strong>Note:</strong> Because your savings potential is high, a Credex advisor may reach out to help you capture these discounts.</p>
        </div>
      `
    }

    htmlContent += `
        <p>You can view your full interactive report at any time here:</p>
        <p><a href="${resultsUrl}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View My Report</a></p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #6b7280; font-size: 12px;">SpendSmart AI · Powered by Credex</p>
      </div>
    `

    const { error: emailError } = await resend.emails.send({
      from: 'SpendSmart AI <onboarding@resend.dev>',
      to: email,
      subject: 'Your AI Spend Audit Report',
      html: htmlContent,
    })

    if (emailError) {
      console.error('Resend Error:', emailError)
      // Not failing the whole request if email fails, but maybe we should.
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Leads Route Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
