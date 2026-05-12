"use client"

import { useState, useEffect } from "react"
import { TOOLS, UseCase } from "@/lib/pricingData"
import { FormData, ToolInput } from "@/lib/auditEngine"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, ArrowRight, Info } from "lucide-react"
import Link from "next/link"

import { useRouter } from "next/navigation"

export default function AuditPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    tools: [{ toolId: TOOLS[0].id, planName: TOOLS[0].plans[0].name, monthlySpend: 0, seats: 1 }],
    teamSize: 1,
    primaryUseCase: 'mixed'
  })

  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('spendaudit_form')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setFormData(parsed)
      } catch (e) {
        console.error('Failed to load form data', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('spendaudit_form', JSON.stringify(formData))
    }
  }, [formData, isLoaded])

  const addTool = () => {
    setFormData(prev => ({
      ...prev,
      tools: [...prev.tools, {
        toolId: TOOLS[0].id,
        planName: TOOLS[0].plans[0].name,
        monthlySpend: 0,
        seats: 1
      }]
    }))
  }

  const removeTool = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index)
    }))
  }

  const updateTool = (index: number, updates: Partial<ToolInput>) => {
    setFormData(prev => {
      const newTools = [...prev.tools]
      const tool = { ...newTools[index], ...updates }

      // If toolId changed, reset planName to first plan of new tool
      if (updates.toolId) {
        const newTool = TOOLS.find(t => t.id === updates.toolId)
        if (newTool) {
          tool.planName = newTool.plans[0].name
        }
      }

      newTools[index] = tool
      return { ...prev, tools: newTools }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to submit audit')
      }

      const data = await response.json()
      router.push(`/results/${data.id}`)
    } catch (err: any) {
      console.error('Submission error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }


  if (!isLoaded) return <div className="min-h-screen bg-slate-950" />

  return (
    <div className="min-h-screen bg-background text-platinum py-12 px-4 md:px-6 selection:bg-money-green/30 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-surface2 rounded-lg flex items-center justify-center group-hover:bg-turquoise/10 border border-border group-hover:border-turquoise/30 transition-all">
              <span className="text-money-green font-bold">S</span>
            </div>
            <span className="font-extrabold tracking-tighter text-platinum">SpendSmart<span className="text-money-green">AI</span></span>
          </Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-platinum transition-colors">
            Exit Audit
          </Link>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-platinum">
            What AI tools is your team paying for?
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            Add all AI subscriptions. We'll identify seat consolidation, redundant tools, and plan optimization opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 px-4 mb-2 hidden md:grid">
              <div className="col-span-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">AI Tool</div>
              <div className="col-span-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Plan</div>
              <div className="col-span-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Monthly Spend</div>
              <div className="col-span-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Seats</div>
              <div className="col-span-1"></div>
            </div>

            {formData.tools.map((toolInput, index) => {
              const selectedTool = TOOLS.find(t => t.id === toolInput.toolId) || TOOLS[0]

              return (
                <Card key={index} className="bg-surface border-border shadow-2xl transition-all hover:bg-surface2/50 group">
                  <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      {/* Tool Selector */}
                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest md:hidden">AI Tool</Label>
                        <Select
                          value={toolInput.toolId}
                          onValueChange={(val) => updateTool(index, { toolId: val })}
                        >
                          <SelectTrigger id={`tool-${index}`} aria-label="Select AI Tool" className="bg-surface2 border-border text-platinum h-11 focus:ring-turquoise/20 focus:border-turquoise transition-all">
                            <SelectValue placeholder="Select tool" />
                          </SelectTrigger>
                          <SelectContent className="bg-surface2 border-border text-platinum">
                            {TOOLS.map(t => (
                              <SelectItem key={t.id} value={t.id} className="focus:bg-turquoise/10 focus:text-platinum cursor-pointer">{t.displayName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Plan Selector */}
                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest md:hidden">Plan</Label>
                        <Select
                          value={toolInput.planName}
                          onValueChange={(val) => updateTool(index, { planName: val })}
                        >
                          <SelectTrigger id={`plan-${index}`} aria-label="Select Plan" className="bg-surface2 border-border text-platinum h-11 focus:ring-turquoise/20 focus:border-turquoise transition-all">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent className="bg-surface2 border-border text-platinum">
                            {selectedTool.plans.map(p => (
                              <SelectItem key={p.name} value={p.name} className="focus:bg-turquoise/10 focus:text-platinum cursor-pointer">{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Monthly Spend */}
                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest md:hidden">Monthly Spend ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" aria-hidden="true">$</span>
                          <Input
                            id={`spend-${index}`}
                            aria-label="Monthly Spend in Dollars"
                            type="number"
                            min="0"
                            step="0.01"
                            value={toolInput.monthlySpend || ""}
                            onChange={(e) => updateTool(index, { monthlySpend: parseFloat(e.target.value) || 0 })}
                            className="pl-7 bg-surface2 border-border text-platinum h-11 focus:ring-turquoise/20 focus:border-turquoise transition-all"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      {/* Seats */}
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest md:hidden">Seats</Label>
                        <Input
                          id={`seats-${index}`}
                          aria-label="Number of Seats"
                          type="number"
                          min="1"
                          value={toolInput.seats || ""}
                          onChange={(e) => updateTool(index, { seats: parseInt(e.target.value) || 1 })}
                          className="bg-surface2 border-border text-platinum h-11 focus:ring-turquoise/20 focus:border-turquoise transition-all"
                          placeholder="1"
                        />
                      </div>

                      {/* Remove Button */}
                      <div className="md:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTool(index)}
                          className="text-muted-foreground hover:text-red-400 hover:bg-red-400/5 h-11 w-11 transition-all"
                          aria-label="Remove this tool"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            <Button
              type="button"
              variant="outline"
              onClick={addTool}
              className="w-full py-8 border-dashed border-border bg-surface/30 text-turquoise hover:text-slate-blue hover:border-turquoise hover:bg-surface/50 transition-all text-sm font-bold uppercase tracking-widest rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Another AI Tool
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
            <div className="space-y-3">
              <Label htmlFor="teamSize" className="text-sm font-bold text-platinum uppercase tracking-widest flex items-center gap-2">
                Total Team Size
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </Label>
              <Input
                id="teamSize"
                type="number"
                min="1"
                value={formData.teamSize || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                className="bg-surface2 border-border text-platinum h-12 text-lg focus:ring-turquoise/20 focus:border-turquoise transition-all"
                placeholder="Total headcount"
              />
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Include all employees and full-time contractors. This helps calculate per-seat efficiency metrics.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold text-platinum uppercase tracking-widest">Primary Use Case</Label>
              <Select
                value={formData.primaryUseCase}
                onValueChange={(val: UseCase) => setFormData(prev => ({ ...prev, primaryUseCase: val }))}
              >
                <SelectTrigger id="primaryUseCase" aria-label="Primary Use Case" className="bg-surface2 border-border text-platinum h-12 text-lg focus:ring-turquoise/20 focus:border-turquoise transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface2 border-border text-platinum">
                  <SelectItem value="coding" className="focus:bg-turquoise/10 focus:text-platinum">Software Development (Coding)</SelectItem>
                  <SelectItem value="writing" className="focus:bg-turquoise/10 focus:text-platinum">Content & Copywriting</SelectItem>
                  <SelectItem value="data" className="focus:bg-turquoise/10 focus:text-platinum">Data Analysis & BI</SelectItem>
                  <SelectItem value="research" className="focus:bg-turquoise/10 focus:text-platinum">Research & Strategy</SelectItem>
                  <SelectItem value="mixed" className="focus:bg-turquoise/10 focus:text-platinum">Mixed Use / Operations</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Choose the dominant work pattern for your team to get tailored tool recommendations.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm font-semibold">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center pt-12">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full md:w-auto min-w-[320px] bg-money-green hover:bg-money-green/90 text-black font-extrabold py-8 text-xl rounded-xl shadow-2xl shadow-money-green/10 transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-tighter"
            >
              {isSubmitting ? "Running Audit..." : "Run My Audit"}
              {!isSubmitting && <ArrowRight className="ml-2 h-6 w-6" />}
            </Button>
            <div className="flex items-center gap-2 mt-8 text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">
              <div className="w-1.5 h-1.5 rounded-full bg-money-green animate-pulse" />
              <span>Free Forever for Credex Customers</span>
            </div>
          </div>

        </form>
      </div>
    </div>

  )
}
