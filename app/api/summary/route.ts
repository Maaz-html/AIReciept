import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { AuditResult } from '@/lib/auditEngine'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { auditResult }: { auditResult: AuditResult } = await req.json()

    if (!auditResult) {
      return NextResponse.json({ error: 'Audit result is required' }, { status: 400 })
    }

    const toolSummaries = auditResult.toolResults
      .map(
        (t) =>
          `- ${t.toolName}: Currently spending $${t.currentCost}/mo. Action: ${t.recommendedAction}`
      )
      .join('\n')

    const prompt = `
You are a financial advisor for a SaaS company. Your goal is to summarize a software spend audit.

Data:
${toolSummaries}

Total Monthly Savings: $${auditResult.totalMonthlySavings}
Total Annual Savings: $${auditResult.totalAnnualSavings}

Task:
Write a 100-word, friendly, numbers-forward summary paragraph of these findings.
Instructions:
- Start directly with a key insight.
- No filler phrases like "Based on the audit" or "Here is a summary".
- No greetings or sign-offs.
- Focus on the numbers and the impact.
- Keep it under 100 words.
`

    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      })

      const summary = message.content[0].type === 'text' ? message.content[0].text : ''

      return NextResponse.json({ summary })
    } catch (apiError) {
      console.error('Anthropic API Error:', apiError)
      
      // Fallback summary
      let fallbackSummary = ''
      if (auditResult.totalMonthlySavings > 0) {
        fallbackSummary = `You could be saving $${auditResult.totalMonthlySavings.toLocaleString()} every single month by optimizing your SaaS stack. By taking action on tools like ${auditResult.toolResults.find(t => !t.isOptimal)?.toolName || 'your core services'}, you'll reduce your annual burn by $${auditResult.totalAnnualSavings.toLocaleString()}. These optimizations are straightforward and can be implemented immediately to improve your margins.`
      } else {
        fallbackSummary = `Your SaaS spend is currently highly optimized, with no immediate savings identified across your core tools. You're effectively managing your subscriptions and staying within list price expectations, which puts you in the 'optimal' tier for efficiency. We'll keep monitoring for new discount opportunities or plan changes that could further benefit your bottom line.`
      }

      return NextResponse.json({ 
        summary: fallbackSummary,
        fallback: true 
      })
    }
  } catch (error) {
    console.error('Route Error:', error)
    // Absolute fallback to ensure no 500
    return NextResponse.json({ 
      summary: "We've completed your audit. Based on your current stack, there are opportunities to optimize your monthly spend and improve efficiency. Check the detailed breakdown below for specific actions you can take today.",
      fallback: true
    })
  }
}
