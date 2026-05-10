"use client"

import { useState, useEffect } from "react"
import { AuditResult } from "@/lib/auditEngine"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  TrendingDown, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Copy, 
  TrendingUp,
  ShieldCheck,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

interface ResultsClientProps {
  id: string
  initialAudit: any
}

export default function ResultsClient({ id, initialAudit }: ResultsClientProps) {
  const [audit, setAudit] = useState<any>(initialAudit)
  const [copied, setCopied] = useState(false)
  const [summary, setSummary] = useState<string>("")
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)

  useEffect(() => {
    if (audit) {
      fetchSummary(audit.results)
    }
  }, [audit])

  async function fetchSummary(auditResult: AuditResult) {
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditResult }),
      })
      if (response.ok) {
        const data = await response.json()
        setSummary(data.summary)
      }
    } catch (err) {
      console.error("Summary error:", err)
    } finally {
      // Artificial delay for "wow" factor/loading states if it's too fast
      setTimeout(() => setSummaryLoading(false), 1500)
    }
  }

  const copyToClipboard = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailSubmitting(true)
    
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const company = formData.get('company') as string
    const role = formData.get('role') as string
    const website = formData.get('website') as string // Honeypot

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          company_name: company,
          role,
          audit_id: id,
          monthly_savings: audit.results.totalMonthlySavings,
          website, // Honeypot
        }),
      })

      if (response.ok) {
        setEmailSuccess(true)
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Lead submission failed with status:', response.status, errorData)
        alert(`Something went wrong (Error ${response.status}). Try again.`)
      }
    } catch (err) {
      console.error('Lead error:', err)
      alert("Something went wrong. Try again.")
    } finally {
      setEmailSubmitting(false)
    }
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-6">
        <div className="p-4 bg-red-500/10 rounded-full">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold">Audit not found</h1>
        <Button asChild variant="outline">
          <Link href="/audit">Start New Audit</Link>
        </Button>
      </div>
    )
  }

  const results: AuditResult = audit.results
  const hasSavings = results.totalMonthlySavings > 0
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_BASE_URL}/results/${id}`
  const twitterText = encodeURIComponent(`I found $${results.totalMonthlySavings}/mo in AI savings with this free audit tool 🤯`)
  const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(shareUrl)}`

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold tracking-tight">SpendSmart<span className="text-green-500">AI</span></span>
          </Link>
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Link href="/audit">Run Another Audit</Link>
          </Button>
        </div>

        {/* TOP HERO */}
        <div className="text-center space-y-6 py-12 px-6 rounded-[2rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="space-y-2 relative">
            <p className="text-green-500 font-semibold tracking-widest uppercase text-xs">Spend Audit Complete</p>
            {hasSavings ? (
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-green-500">
                  Save ${results.totalMonthlySavings.toLocaleString()}<span className="text-slate-400">/mo</span>
                </h1>
                <p className="text-2xl md:text-3xl font-bold text-slate-300">
                  That's ${results.totalAnnualSavings.toLocaleString()} per year
                </p>
              </div>
            ) : (
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
                Your AI spend is already optimized 🎉
              </h1>
            )}
          </div>
        </div>

        {/* PER-TOOL BREAKDOWN */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            Per-Tool Breakdown
          </h2>
          <div className="grid gap-4">
            {results.toolResults.map((tool, idx) => (
              <Card key={idx} className={`bg-slate-900/50 border-slate-800 transition-all ${tool.isOptimal ? 'hover:border-green-500/30' : 'hover:border-blue-500/30'}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{tool.toolName}</h3>
                        {tool.isOptimal ? (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 flex items-center gap-1 px-2 py-0">
                            <ShieldCheck className="h-3 w-3" /> Already Optimal
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-blue-400 border-blue-400/30">Action Required</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Current Spend</p>
                          <p className="text-lg font-bold">${tool.currentCost}/mo</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Potential Savings</p>
                          <p className={`text-lg font-bold ${tool.potentialMonthlySavings > 0 ? 'text-green-500' : 'text-slate-400'}`}>
                            ${tool.potentialMonthlySavings}/mo
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-1/2 p-4 rounded-xl bg-slate-950/50 border border-slate-800/50 space-y-2">
                      <p className="text-sm font-bold text-slate-300">Recommended Action:</p>
                      <p className="text-sm text-slate-400 leading-relaxed italic">
                        "{tool.recommendedAction}"
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {tool.reasoning}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI SUMMARY SECTION */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-300">
            <TrendingDown className="h-5 w-5 text-green-500" />
            AI Executive Summary
          </h2>
          
          <Card className="bg-slate-900/40 border-slate-800/50 overflow-hidden relative group">
            {/* Background decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-green-500/10 transition-colors" />
            
            <CardContent className="p-6 md:p-8">
              {summaryLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-800 rounded w-full" />
                  <div className="h-4 bg-slate-800 rounded w-5/6" />
                </div>
              ) : (
                <p className="text-lg text-slate-300 leading-relaxed font-medium italic">
                  "{summary}"
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* CREDEX PROMO BLOCK (High Savings) */}
        {results.savingsTier === 'high' && (
          <Card className="bg-slate-900 border-2 border-green-500/50 shadow-[0_0_40px_-15px_rgba(34,197,94,0.3)] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <TrendingDown className="h-32 w-32 text-green-500" />
            </div>
            <CardContent className="p-8 space-y-6 relative">
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight">Ready to capture these savings?</h2>
                <p className="text-slate-400 text-lg max-w-xl">
                  Credex sells discounted AI credits from companies that overforecast. Get the same tools for less.
                </p>
              </div>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 h-14 rounded-xl text-lg">
                <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
                  Book a Credex Consultation <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* HONEST MESSAGE BLOCK (Optimal) */}
        {results.savingsTier === 'optimal' && (
          <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">You're spending well.</h2>
              <p className="text-slate-400">No obvious optimisations right now based on our current data.</p>
            </div>
            <div className="max-w-md mx-auto p-1 bg-slate-950 rounded-2xl border border-slate-800 flex items-center">
              <Input 
                placeholder="Enter your email" 
                className="bg-transparent border-0 focus-visible:ring-0 text-slate-200"
              />
              <Button className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl px-6">Notify Me</Button>
            </div>
            <p className="text-xs text-slate-500">We'll alert you when new optimization rules apply to your stack.</p>
          </div>
        )}

        {/* SHARE SECTION */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-300">Share your audit</h2>
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800 group transition-colors hover:border-slate-700">
              <p className="text-sm text-slate-400 font-mono break-all line-clamp-1 flex-1">
                {shareUrl}
              </p>
              <Button 
                onClick={copyToClipboard}
                size="sm"
                variant="ghost" 
                className="h-8 gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="w-20 text-left">{copied ? "✓ Copied!" : "Copy Link"}</span>
              </Button>
            </div>
            <Button 
              asChild
              className="h-auto py-4 px-8 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold rounded-xl flex items-center gap-2"
            >
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Share on Twitter
              </a>
            </Button>
          </div>
        </div>

        {/* EMAIL CAPTURE FORM */}
        <Card className="bg-slate-900/50 border-slate-800 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-900 border-b border-slate-800 p-8">
            <CardTitle className="text-2xl">Get a copy of this report</CardTitle>
            <CardDescription className="text-slate-400">We'll send the full breakdown and optimization guide to your inbox.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {emailSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold">Email Sent!</h3>
                <p className="text-slate-400">Check your inbox for the full report.</p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address <span className="text-red-400">*</span></Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email" 
                    required 
                    placeholder="you@company.com"
                    className="bg-slate-950 border-slate-700 h-12 focus:ring-green-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-slate-300">Company Name</Label>
                  <Input 
                    id="company"
                    name="company"
                    placeholder="Acme Inc"
                    className="bg-slate-950 border-slate-700 h-12 focus:ring-green-500/20"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="role" className="text-slate-300">Your Role</Label>
                  <Input 
                    id="role"
                    name="role"
                    placeholder="CTO, Engineering Manager, etc."
                    className="bg-slate-950 border-slate-700 h-12 focus:ring-green-500/20"
                  />
                </div>
                {/* Honeypot field - visually hidden */}
                <div className="sr-only" aria-hidden="true">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    placeholder="Your website"
                  />
                </div>
                <Button 
                  disabled={emailSubmitting}
                  className="md:col-span-2 h-14 bg-slate-100 hover:bg-white text-slate-950 font-bold text-lg rounded-xl transition-all active:scale-[0.98]"
                >
                  {emailSubmitting ? "Sending..." : "Email Me the Report"}
                </Button>
                <p className="md:col-span-2 text-center text-xs text-slate-500">
                  By submitting, you agree to our privacy policy. No spam, ever.
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="text-center pb-12">
          <p className="text-slate-500 text-sm">
            Analysis provided by <span className="text-slate-300 font-semibold">SpendSmart AI</span> · Powered by <span className="text-slate-300 font-semibold">Credex</span>
          </p>
        </div>
      </div>
    </div>
  )
}
