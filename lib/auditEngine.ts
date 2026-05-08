import { TOOLS, UseCase } from './pricingData'

export type ToolInput = {
  toolId: string
  planName: string
  seats: number
  monthlySpend: number
}

export type FormData = {
  tools: ToolInput[]
  teamSize: number
  primaryUseCase: UseCase
}

export type ToolAuditResult = {
  toolId: string
  toolName: string
  currentCost: number
  recommendedAction: string
  potentialMonthlySavings: number
  isOptimal: boolean
  reasoning: string
}

export type AuditResult = {
  toolResults: ToolAuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  savingsTier: 'high' | 'medium' | 'low' | 'optimal'
}

export function runAudit(formData: FormData): AuditResult {
  const toolResults: ToolAuditResult[] = formData.tools.map((input) => {
    const tool = TOOLS.find((t) => t.id === input.toolId)
    const plan = tool?.plans.find((p) => p.name === input.planName)

    const toolName = tool?.displayName || input.toolId
    const currentCost = input.monthlySpend
    let recommendedAction = 'Your current setup is already optimal.'
    let potentialMonthlySavings = 0
    let isOptimal = true
    let reasoning = 'Based on our current database, your plan is priced correctly.'

    if (!tool || !plan) {
      return {
        toolId: input.toolId,
        toolName,
        currentCost,
        recommendedAction: 'Tool or plan not found in database.',
        potentialMonthlySavings: 0,
        isOptimal: true,
        reasoning: 'We do not have pricing data for this specific configuration.',
      }
    }

    // Rule C: Paying more than list price
    if (plan.pricePerUser !== -1 && input.monthlySpend > plan.pricePerUser * input.seats) {
      const listPrice = plan.pricePerUser * input.seats
      recommendedAction = `You are paying more than the list price of $${listPrice}. Contact billing for a review.`
      potentialMonthlySavings = input.monthlySpend - listPrice
      isOptimal = false
      reasoning = `The standard price for ${input.seats} seats on the ${input.planName} plan is $${listPrice}.`
    }

    // Rule A: Team plan with ≤2 seats → recommend Pro/Plus downgrade
    if (input.planName === 'Team' && input.seats <= 2) {
      const individualPlan = tool.plans.find(p => p.name === 'Plus' || p.name === 'Pro')
      if (individualPlan && individualPlan.pricePerUser !== -1) {
        const individualCost = individualPlan.pricePerUser * input.seats
        if (individualCost < currentCost - potentialMonthlySavings) {
          recommendedAction = `Downgrade to ${individualPlan.name} as you have ≤2 seats. Save on team overhead.`
          potentialMonthlySavings = currentCost - individualCost
          isOptimal = false
          reasoning = `The ${input.planName} plan is designed for teams; individual plans are cheaper for ≤2 users.`
        }
      }
    }

    // Rule B: Coding use case on ChatGPT or Claude → recommend Cursor Pro
    if (formData.primaryUseCase === 'coding' && (input.toolId === 'chatgpt' || input.toolId === 'claude')) {
      const cursorPro = TOOLS.find(t => t.id === 'cursor')?.plans.find(p => p.name === 'Pro')
      if (cursorPro) {
        const cursorCost = cursorPro.pricePerUser * input.seats
        if (cursorCost < currentCost - potentialMonthlySavings) {
          recommendedAction = `Switch to Cursor Pro for a better coding experience and lower cost.`
          potentialMonthlySavings = currentCost - cursorCost
          isOptimal = false
          reasoning = `Cursor Pro includes advanced coding features that replace the need for separate ChatGPT/Claude Plus subscriptions.`
        }
      }
    }

    return {
      toolId: input.toolId,
      toolName,
      currentCost,
      recommendedAction,
      potentialMonthlySavings: Math.max(0, potentialMonthlySavings),
      isOptimal,
      reasoning,
    }
  })

  const totalMonthlySavings = toolResults.reduce((sum, res) => sum + res.potentialMonthlySavings, 0)
  const totalAnnualSavings = totalMonthlySavings * 12

  let savingsTier: 'high' | 'medium' | 'low' | 'optimal' = 'optimal'
  if (totalMonthlySavings > 500) {
    savingsTier = 'high'
  } else if (totalMonthlySavings >= 100) {
    savingsTier = 'medium'
  } else if (totalMonthlySavings > 0) {
    savingsTier = 'low'
  }

  return {
    toolResults,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsTier,
  }
}

