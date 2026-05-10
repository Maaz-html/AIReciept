import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Parse params
    const savings = searchParams.get('savings')
    const tools = searchParams.get('tools')
    const tier = searchParams.get('tier') || 'default'

    const savingsNum = savings ? parseInt(savings) : 0
    const toolsNum = tools ? parseInt(tools) : 0
    const annualSavings = savingsNum * 12

    const formattedSavings = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(savingsNum)

    const formattedAnnual = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(annualSavings)

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            padding: '80px',
            position: 'relative',
          }}
        >
          {/* Top Left Wordmark */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#ffffff' }}>SpendSmart</span>
            <span style={{ color: '#22c55e' }}>AI</span>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {savingsNum > 0 ? (
              <>
                <div
                  style={{
                    fontSize: '96px',
                    fontWeight: 900,
                    color: '#22c55e',
                    marginBottom: '10px',
                    letterSpacing: '-0.05em',
                  }}
                >
                  Save {formattedSavings}/mo
                </div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  Potential annual savings: {formattedAnnual}
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 500,
                    color: '#64748b',
                  }}
                >
                  across {toolsNum} AI tools
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: '72px',
                    fontWeight: 900,
                    color: '#ffffff',
                    textAlign: 'center',
                    marginBottom: '20px',
                    letterSpacing: '-0.03em',
                  }}
                >
                  Optimize Your AI Spend
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 500,
                    color: '#64748b',
                    textAlign: 'center',
                  }}
                >
                  Free 2-minute audit for startups
                </div>
              </>
            )}
          </div>

          {/* Bottom Right Wordmark */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              fontSize: '18px',
              color: '#475569',
            }}
          >
            Free audit at spendsmart.ai
          </div>
          
          {/* Subtle Accent Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, rgba(10,10,10,0) 70%)',
              borderRadius: '50%',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
