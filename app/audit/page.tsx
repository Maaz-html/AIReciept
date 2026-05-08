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

export default function AuditPage() {
  const [formData, setFormData] = useState<FormData>({
    tools: [{ toolId: TOOLS[0].id, planName: TOOLS[0].plans[0].name, monthlySpend: 0, seats: 1 }],
    teamSize: 1,
    primaryUseCase: 'mixed'
  })

  const [isLoaded, setIsLoaded] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Data Submitted:", formData)
    // Tomorrow we wire up the API call
  }

  if (!isLoaded) return <div className="min-h-screen bg-slate-950" />

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-12 px-4 md:px-6 selection:bg-green-500/30">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
             <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-colors">
               <span className="text-green-500 font-bold">S</span>
             </div>
             <span className="font-bold tracking-tight">SpendSmart<span className="text-green-500">AI</span></span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">
            Exit Audit
          </Link>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            What AI tools is your team paying for?
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Add all AI subscriptions. We'll identify seat consolidation, redundant tools, and plan optimization opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 px-4 mb-2 hidden md:grid">
              <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Tool</div>
              <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</div>
              <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Spend</div>
              <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Seats</div>
              <div className="col-span-1"></div>
            </div>

            {formData.tools.map((toolInput, index) => {
              const selectedTool = TOOLS.find(t => t.id === toolInput.toolId) || TOOLS[0]
              
              return (
                <Card key={index} className="bg-slate-900/40 border-slate-800/50 shadow-lg backdrop-blur-sm transition-all hover:bg-slate-900/60 hover:border-slate-700/50">
                  <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      {/* Tool Selector */}
                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-slate-400 text-xs md:hidden">AI Tool</Label>
                        <Select 
                          value={toolInput.toolId} 
                          onValueChange={(val) => updateTool(index, { toolId: val })}
                        >
                          <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200 h-11 focus:ring-green-500/20">
                            <SelectValue placeholder="Select tool" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                            {TOOLS.map(t => (
                              <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Plan Selector */}
                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-slate-400 text-xs md:hidden">Plan</Label>
                        <Select 
                          value={toolInput.planName} 
                          onValueChange={(val) => updateTool(index, { planName: val })}
                        >
                          <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200 h-11 focus:ring-green-500/20">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                            {selectedTool.plans.map(p => (
                              <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Monthly Spend */}
                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-slate-400 text-xs md:hidden">Monthly Spend ($)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                          <Input 
                            type="number"
                            min="0"
                            step="0.01"
                            value={toolInput.monthlySpend || ""}
                            onChange={(e) => updateTool(index, { monthlySpend: parseFloat(e.target.value) || 0 })}
                            className="pl-7 bg-slate-950 border-slate-700 text-slate-200 h-11 focus:ring-green-500/20"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      {/* Seats */}
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-slate-400 text-xs md:hidden">Seats</Label>
                        <Input 
                          type="number"
                          min="1"
                          value={toolInput.seats || ""}
                          onChange={(e) => updateTool(index, { seats: parseInt(e.target.value) || 1 })}
                          className="bg-slate-950 border-slate-700 text-slate-200 h-11 focus:ring-green-500/20"
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
                          className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 h-11 w-11 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
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
              className="w-full py-8 border-dashed border-slate-700 bg-slate-900/20 text-slate-400 hover:text-green-400 hover:border-green-500/50 hover:bg-green-500/5 transition-all text-base rounded-2xl"
            >
              <Plus className="h-5 w-5 mr-2" /> Add Another AI Tool
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-800">
            <div className="space-y-3">
              <Label htmlFor="teamSize" className="text-base font-semibold text-slate-200 flex items-center gap-2">
                Total Team Size
                <Info className="h-3.5 w-3.5 text-slate-500" />
              </Label>
              <Input 
                id="teamSize"
                type="number"
                min="1"
                value={formData.teamSize || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                className="bg-slate-950 border-slate-700 text-slate-200 h-12 text-lg focus:ring-green-500/20"
                placeholder="Total headcount"
              />
              <p className="text-xs text-slate-500 leading-relaxed">
                Include all employees and full-time contractors. This helps calculate per-seat efficiency metrics.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-200">Primary Use Case</Label>
              <Select 
                value={formData.primaryUseCase} 
                onValueChange={(val: UseCase) => setFormData(prev => ({ ...prev, primaryUseCase: val }))}
              >
                <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200 h-12 text-lg focus:ring-green-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                  <SelectItem value="coding">Software Development (Coding)</SelectItem>
                  <SelectItem value="writing">Content & Copywriting</SelectItem>
                  <SelectItem value="data">Data Analysis & BI</SelectItem>
                  <SelectItem value="research">Research & Strategy</SelectItem>
                  <SelectItem value="mixed">Mixed Use / Operations</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose the dominant work pattern for your team to get tailored tool recommendations.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center pt-12">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full md:w-auto min-w-[320px] bg-green-600 hover:bg-green-500 text-white font-bold py-8 text-xl rounded-2xl shadow-2xl shadow-green-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Run My Audit <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2 mt-8 text-slate-500 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Free Forever for Credex Customers</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
