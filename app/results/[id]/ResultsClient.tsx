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
  ArrowRight,
  Info
} from "lucide-react"
import Link from "next/link"

interface ResultsClientProps {
  id: string
  initialAudit: { results: AuditResult }
}

export default function ResultsClient({ id, initialAudit }: ResultsClientProps) {
  const audit = initialAudit
  const [copied, setCopied] = useState(false)
  const [summary, setSummary] = useState<string>("")
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)

  const fetchSummary = async (auditResult: AuditResult) => {
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

  useEffect(() => {
    if (audit) {
      setTimeout(() => fetchSummary(audit.results), 0)
    }
  }, [audit])

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
    <div className="min-h-screen bg-background text-platinum py-12 px-4 md:px-6 selection:bg-money-green/30 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-surface2 rounded-lg flex items-center justify-center group-hover:bg-turquoise/10 border border-border group-hover:border-turquoise/30 transition-all">
               <span className="text-money-green font-bold">S</span>
             </div>
             <span className="font-extrabold tracking-tighter text-platinum">SpendSmart<span className="text-money-green">AI</span></span>
          </Link>
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-platinum transition-colors">
            <Link href="/audit">Run Another Audit</Link>
          </Button>
        </div>

        {/* TOP HERO - PREMIUM GRADIENT */}
        <div className="text-center space-y-6 py-16 px-8 rounded-[2rem] bg-linear-to-br from-turquoise via-surface to-money-green border border-border shadow-2xl relative overflow-hidden group">
          {/* Decorative glass elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-background/40 backdrop-blur-[100px] z-0" />
          
          <div className="space-y-4 relative z-10">
            <p className="text-money-green font-bold tracking-[0.3em] uppercase text-[10px]">Spend Audit Complete</p>
            {hasSavings ? (
              <div className="space-y-4">
                <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter text-platinum leading-none">
                  Save ${results.totalMonthlySavings.toLocaleString()}<span className="text-muted-foreground text-3xl md:text-5xl font-medium">/mo</span>
                </h1>
                <div className="inline-block px-6 py-2 bg-money-green/20 border border-money-green/30 rounded-full">
                  <p className="text-xl md:text-2xl font-bold text-money-green">
                    That&apos;s ${results.totalAnnualSavings.toLocaleString()} per year
                  </p>
                </div>
              </div>
            ) : (
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-platinum">
                Your AI spend is already <span className="text-money-green">optimized</span> 🎉
              </h1>
            )}
          </div>
        </div>

        {/* PER-TOOL BREAKDOWN */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-money-green" />
              Per-Tool Breakdown
            </h2>
            <div className="h-px flex-1 bg-border ml-4" />
          </div>
          
          <div className="grid gap-6">
            {results.toolResults.map((tool, idx) => (
              <Card key={idx} className="bg-surface border-border shadow-xl transition-all hover:bg-surface2/50 group overflow-visible">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="space-y-6 flex-1">
                      <div className="flex items-center flex-wrap gap-3">
                        <h3 className="text-2xl font-extrabold text-platinum tracking-tight leading-none min-w-[120px]">
                          {tool.toolName || "Unknown Tool"}
                        </h3>
                        {tool.isOptimal ? (
                          <Badge className="bg-money-green/10 text-money-green border-money-green/20 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <ShieldCheck className="h-3 w-3" /> Already Optimal
                          </Badge>
                        ) : (
                          <Badge className="bg-turquoise/10 text-turquoise border-turquoise/20 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Action Required</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 border-t border-border pt-6">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Current Spend</p>
                          <p className="text-2xl font-extrabold text-platinum">${tool.currentCost}<span className="text-muted-foreground text-sm font-medium">/mo</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Potential Savings</p>
                          <p className={`text-2xl font-extrabold ${tool.potentialMonthlySavings > 0 ? 'text-money-green' : 'text-muted-foreground'}`}>
                            ${tool.potentialMonthlySavings}<span className="text-muted-foreground text-sm font-medium">/mo</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-5/12 p-6 rounded-2xl bg-surface2 border border-border space-y-3 relative group-hover:border-turquoise/30 transition-all">
                      <div className="flex items-center gap-2 text-turquoise">
                        <Info className="h-4 w-4" />
                        <p className="text-xs font-bold uppercase tracking-widest">Recommended Action</p>
                      </div>
                      <p className="text-base text-platinum font-bold leading-snug">
                        {tool.recommendedAction}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
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
        <div className="space-y-6 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-money-green" />
              AI Executive Summary
            </h2>
            <div className="h-px flex-1 bg-border ml-4" />
          </div>
          
          <Card className="bg-surface2 border-border border-l-4 border-l-turquoise overflow-hidden relative group">
            <CardContent className="p-8 md:p-10">
              {summaryLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-surface rounded w-3/4" />
                  <div className="h-4 bg-surface rounded w-full" />
                  <div className="h-4 bg-surface rounded w-5/6" />
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute -top-4 -left-4 text-6xl text-turquoise/10 font-serif">“</span>
                  <p className="text-xl text-platinum leading-relaxed font-medium italic relative z-10">
                    {summary}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* CREDEX PROMO BLOCK (High Savings) */}
        {results.savingsTier === 'high' && (
          <Card className="bg-surface border-2 border-money-green/50 shadow-[0_0_50px_-12px_rgba(34,197,94,0.2)] overflow-hidden relative rounded-[2rem]">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <TrendingDown className="h-48 w-48 text-money-green" />
            </div>
            <CardContent className="p-10 space-y-8 relative z-10">
              <div className="space-y-3">
                <Badge className="bg-money-green/10 text-money-green border-money-green/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Capture Savings</Badge>
                <h2 className="text-4xl font-extrabold tracking-tighter text-platinum">Ready to capture these savings?</h2>
                <p className="text-muted-foreground text-lg max-w-xl font-medium">
                  Credex sells discounted AI credits from companies that overforecast. Get the same tools for less.
                </p>
              </div>
              <Button asChild size="lg" className="bg-money-green hover:bg-money-green/90 text-black font-extrabold px-10 h-16 rounded-2xl text-lg shadow-xl transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] uppercase tracking-tighter">
                <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
                  Book a Credex Consultation <ArrowRight className="ml-2 h-6 w-6" />
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* HONEST MESSAGE BLOCK (Optimal) */}
        {results.savingsTier === 'optimal' && (
          <div className="p-12 rounded-[2rem] bg-surface border border-border text-center space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-b from-money-green/5 to-transparent pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="w-16 h-16 bg-money-green/10 rounded-2xl flex items-center justify-center mx-auto border border-money-green/20 mb-4">
                <CheckCircle2 className="h-8 w-8 text-money-green" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tighter text-platinum">You&apos;re spending well.</h2>
              <p className="text-muted-foreground text-lg font-medium">No obvious optimisations right now based on our current data.</p>
            </div>
            
            <div className="max-w-md mx-auto p-1.5 bg-surface2 rounded-2xl border border-border flex items-center shadow-inner relative z-10 group-focus-within:border-turquoise/50 transition-all">
              <Label htmlFor="notifyEmail" className="sr-only">Notify Email</Label>
              <Input 
                id="notifyEmail"
                placeholder="Enter your email" 
                className="bg-transparent border-0 focus-visible:ring-0 text-platinum text-lg placeholder:text-muted-foreground/50"
              />
              <Button className="bg-platinum hover:bg-white text-background font-bold rounded-xl px-8 h-12 shadow-lg transition-all active:scale-[0.95]">Notify Me</Button>
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest relative z-10">We&apos;ll alert you when new optimization rules apply to your stack.</p>
          </div>
        )}

        {/* SHARE SECTION */}
        <div className="space-y-6 pt-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Share your audit</h2>
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="flex-1 flex items-center gap-4 p-5 rounded-2xl bg-surface border border-border group transition-all hover:border-turquoise/30 shadow-xl">
              <p className="text-sm text-muted-foreground font-medium break-all line-clamp-1 flex-1">
                {shareUrl}
              </p>
              <Button 
                onClick={copyToClipboard}
                size="sm"
                variant="ghost" 
                className="h-10 gap-2 text-platinum hover:text-turquoise hover:bg-turquoise/5 border border-transparent hover:border-turquoise/20 rounded-xl px-4"
                aria-label={copied ? "Link copied to clipboard" : "Copy audit link to clipboard"}
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-money-green" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                <span className="font-bold text-xs uppercase tracking-widest">{copied ? "Copied!" : "Copy Link"}</span>
              </Button>
            </div>
            <Button 
              asChild
              className="h-auto py-5 px-10 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-extrabold rounded-2xl flex items-center gap-3 transition-all hover:scale-[1.02] shadow-xl"
              aria-label="Share your results on X (Twitter)"
            >
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span className="uppercase tracking-widest text-xs">Share on X</span>
              </a>
            </Button>
          </div>
        </div>

        {/* EMAIL CAPTURE FORM */}
        <Card className="bg-surface border-border shadow-2xl overflow-hidden rounded-[2rem] pt-4">
          <CardHeader className="p-10 pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-extrabold tracking-tight text-platinum">Get a copy of this report</CardTitle>
                <CardDescription className="text-muted-foreground text-lg font-medium">We&apos;ll send the full breakdown and optimization guide to your inbox.</CardDescription>
              </div>
              <div className="w-16 h-16 bg-turquoise/10 rounded-3xl flex items-center justify-center border border-turquoise/20 shadow-inner">
                <Mail className="h-8 w-8 text-turquoise" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            {emailSuccess ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-money-green/10 rounded-full flex items-center justify-center mx-auto border border-money-green/20">
                  <CheckCircle2 className="h-10 w-10 text-money-green" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-platinum">Email Sent!</h3>
                  <p className="text-muted-foreground font-medium">Check your inbox for the full optimization report.</p>
                </div>
                <Button variant="outline" onClick={() => setEmailSuccess(false)} className="border-border text-muted-foreground hover:text-platinum rounded-xl">Send to another email</Button>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Email Address <span className="text-money-green">*</span></Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email" 
                      required 
                      placeholder="you@company.com"
                      className="bg-surface2 border-border h-14 text-lg focus:ring-turquoise/20 focus:border-turquoise transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="company" className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Company Name</Label>
                    <Input 
                      id="company"
                      name="company"
                      placeholder="Acme Inc"
                      className="bg-surface2 border-border h-14 text-lg focus:ring-turquoise/20 focus:border-turquoise transition-all"
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="role" className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Your Role</Label>
                    <Input 
                      id="role"
                      name="role"
                      placeholder="CTO, Engineering Manager, etc."
                      className="bg-surface2 border-border h-14 text-lg focus:ring-turquoise/20 focus:border-turquoise transition-all"
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
                </div>
                
                <div className="flex flex-col items-center gap-6">
                  <Button 
                    disabled={emailSubmitting}
                    className="w-full h-16 bg-platinum hover:bg-white text-background font-extrabold text-xl rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xl shadow-platinum/5 uppercase tracking-tighter"
                  >
                    {emailSubmitting ? "Sending Report..." : "Email Me the Report"}
                    {!emailSubmitting && <ArrowRight className="ml-2 h-6 w-6" />}
                  </Button>
                  <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    No spam, just savings.
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="text-center pb-20 border-t border-border pt-12">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">
            Analysis provided by <span className="text-platinum">SpendSmart AI</span> · Powered by <span className="text-platinum">Credex</span>
          </p>
        </div>
      </div>
    </div>

  )
}
