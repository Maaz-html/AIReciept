import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap, BarChart3, TrendingDown } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-platinum selection:bg-money-green/30 selection:text-money-green">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center group" href="/" aria-label="SpendSmart AI Home">
          <div className="w-8 h-8 bg-turquoise rounded-lg flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
            <TrendingDown className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-platinum">SpendSmart<span className="text-money-green">AI</span></span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-muted-text hover:text-turquoise transition-colors" href="/audit">
            Run Audit
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden w-full py-24 md:py-32 lg:py-48" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(68,127,152,0.12) 0%, transparent 70%)' }}>
          <div className="container relative px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-slate-blue mb-4 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                <span className="mr-1">✨</span> New: Multi-tool optimization engine
              </div>
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-platinum">
                  Stop overpaying <span className="text-money-green">for AI tools</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-text md:text-xl lg:text-2xl leading-relaxed">
                  Get a free, instant audit of your team&apos;s AI spend and discover hidden savings in minutes.
                </p>
              </div>
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
                <Button asChild size="lg" className="bg-money-green hover:bg-[#16a34a] text-black font-bold px-10 py-7 text-xl rounded-full transition-all hover:scale-105 shadow-xl shadow-money-green/20">
                  <Link href="/audit">Audit My AI Spend →</Link>
                </Button>
                <p className="mt-4 text-sm text-muted-text">No login required. Takes 2 minutes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Explainer Section */}
        <section className="w-full py-24 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
              {/* Step 1 */}
              <div className="flex flex-col items-center space-y-6 text-center p-8 rounded-xl bg-surface border border-border transition-all hover:border-t-turquoise shadow-[0_0_0_1px_#1E2D42]">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface2 shadow-inner">
                  <Zap className="h-8 w-8 text-glacier" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-platinum">Input your tools</h3>
                  <p className="text-muted-text">Quickly list the AI subscriptions your team currently pays for.</p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center space-y-6 text-center p-8 rounded-xl bg-surface border border-border transition-all hover:border-t-turquoise shadow-[0_0_0_1px_#1E2D42]">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface2 shadow-inner">
                  <BarChart3 className="h-8 w-8 text-glacier" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-platinum">Get instant audit</h3>
                  <p className="text-muted-text">Our engine compares your spend against optimal plans and list prices.</p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center space-y-6 text-center p-8 rounded-xl bg-surface border border-border transition-all hover:border-t-turquoise shadow-[0_0_0_1px_#1E2D42]">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface2 shadow-inner">
                  <TrendingDown className="h-8 w-8 text-glacier" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-platinum">See your savings</h3>
                  <p className="text-muted-text">Get a detailed breakdown of where you can cut costs without losing performance.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="w-full py-16 bg-surface border-y border-border">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
              {/* Stat 1 */}
              <div className="flex flex-col items-center text-center px-4 md:border-r border-border last:border-0">
                <span className="text-3xl font-extrabold text-money-green">$2.4M+</span>
                <span className="text-xs font-semibold tracking-widest text-muted-text uppercase mt-1">Savings Identified</span>
              </div>
              {/* Stat 2 */}
              <div className="flex flex-col items-center text-center px-4 md:border-r border-border last:border-0">
                <span className="text-3xl font-extrabold text-money-green">4,200+</span>
                <span className="text-xs font-semibold tracking-widest text-muted-text uppercase mt-1">Hours Reclaimed</span>
              </div>
              {/* Stat 3 */}
              <div className="flex flex-col items-center text-center px-4 md:border-r border-border last:border-0">
                <span className="text-3xl font-extrabold text-money-green">120+</span>
                <span className="text-xs font-semibold tracking-widest text-muted-text uppercase mt-1">AI Tools Covered</span>
              </div>
              {/* Stat 4 */}
              <div className="flex flex-col items-center text-center px-4 last:border-0">
                <span className="text-3xl font-extrabold text-money-green">100%</span>
                <span className="text-xs font-semibold tracking-widest text-muted-text uppercase mt-1">Private. No Login.</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-4 md:px-6 border-t border-border bg-background">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8 mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link className="flex items-center justify-center group" href="/">
              <span className="font-extrabold text-xl tracking-tight text-platinum">SpendSmart<span className="text-money-green">AI</span></span>
            </Link>
            <p className="text-sm text-muted-text text-center md:text-left">
              © 2026 SpendSmart AI. Optimized AI procurement for modern startups.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-muted-text">
              Built for <span className="text-platinum font-semibold">Credex</span> · <a href="https://credex.rocks" className="text-turquoise hover:text-slate-blue transition-colors underline underline-offset-4 decoration-turquoise/30">credex.rocks</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
