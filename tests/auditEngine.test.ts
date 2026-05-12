import { describe, it, expect } from 'vitest'
import { runAudit, FormData } from '../lib/auditEngine'

describe('runAudit', () => {
  it('should recommend downgrade for Team plan with 1 seat', () => {
    const formData: FormData = {
      tools: [{
        toolId: 'chatgpt',
        planName: 'Team',
        seats: 1,
        monthlySpend: 30
      }],
      teamSize: 1,
      primaryUseCase: 'mixed'
    }
    
    const results = runAudit(formData)
    expect(results.totalMonthlySavings).toBeGreaterThan(0)
    expect(results.toolResults[0].isOptimal).toBe(false)
    expect(results.toolResults[0].recommendedAction).toContain('Downgrade')
  })

  it('should return 0 savings if already on cheapest appropriate plan', () => {
    const formData: FormData = {
      tools: [{
        toolId: 'chatgpt',
        planName: 'Plus',
        seats: 1,
        monthlySpend: 20
      }],
      teamSize: 1,
      primaryUseCase: 'mixed'
    }
    
    const results = runAudit(formData)
    expect(results.totalMonthlySavings).toBe(0)
    expect(results.toolResults[0].isOptimal).toBe(true)
  })

  it('should calculate annual savings as monthly savings * 12', () => {
    const formData: FormData = {
      tools: [{
        toolId: 'chatgpt',
        planName: 'Team',
        seats: 1,
        monthlySpend: 100 // Overpaying significantly to trigger savings
      }],
      teamSize: 1,
      primaryUseCase: 'mixed'
    }
    
    const results = runAudit(formData)
    expect(results.totalAnnualSavings).toBe(results.totalMonthlySavings * 12)
  })

  it('should recommend Cursor Pro for coding use case on ChatGPT Plus', () => {
    const formData: FormData = {
      tools: [{
        toolId: 'chatgpt',
        planName: 'Plus',
        seats: 1,
        monthlySpend: 20
      }],
      teamSize: 1,
      primaryUseCase: 'coding'
    }
    
    const results = runAudit(formData)
    expect(results.toolResults[0].recommendedAction).toContain('Cursor')
  })

  it('should set savingsTier to high when total monthly savings > 500', () => {
    const formData: FormData = {
      tools: [{
        toolId: 'chatgpt',
        planName: 'Team',
        seats: 1,
        monthlySpend: 600 // High overpayment
      }],
      teamSize: 1,
      primaryUseCase: 'mixed'
    }
    
    const results = runAudit(formData)
    expect(results.savingsTier).toBe('high')
  })

  it('should not crash and return 0 savings for empty tools array', () => {
    const formData: FormData = {
      tools: [],
      teamSize: 1,
      primaryUseCase: 'mixed'
    }
    
    const results = runAudit(formData)
    expect(results.totalMonthlySavings).toBe(0)
    expect(results.toolResults).toHaveLength(0)
  })
})
