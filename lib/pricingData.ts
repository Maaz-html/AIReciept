export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export type Plan = {
  name: string
  pricePerUser: number
  minSeats?: number
  bestFor: UseCase[]
  notes?: string
}

export type Tool = {
  id: string
  displayName: string
  plans: Plan[]
}

export const TOOLS: Tool[] = [
  {
    id: 'cursor',
    displayName: 'Cursor',
    plans: [
      { name: 'Hobby', pricePerUser: 0, bestFor: ['coding'] },
      { name: 'Pro', pricePerUser: 20, bestFor: ['coding'] },
      { name: 'Business', pricePerUser: 40, bestFor: ['coding'] },
      { name: 'Enterprise', pricePerUser: -1, bestFor: ['coding'], notes: 'Custom pricing' },
    ],
  },
  {
    id: 'github-copilot',
    displayName: 'GitHub Copilot',
    plans: [
      { name: 'Individual', pricePerUser: 10, bestFor: ['coding'] },
      { name: 'Business', pricePerUser: 19, bestFor: ['coding'] },
      { name: 'Enterprise', pricePerUser: 39, bestFor: ['coding'] },
    ],
  },
  {
    id: 'claude',
    displayName: 'Claude',
    plans: [
      { name: 'Free', pricePerUser: 0, bestFor: ['writing', 'research'] },
      { name: 'Pro', pricePerUser: 20, bestFor: ['writing', 'research', 'data'] },
      { name: 'Max', pricePerUser: 100, bestFor: ['research', 'data'] },
      { name: 'Team', pricePerUser: 30, minSeats: 5, bestFor: ['mixed'] },
      { name: 'Enterprise', pricePerUser: -1, bestFor: ['mixed'], notes: 'Custom pricing' },
      { name: 'API Direct', pricePerUser: -1, bestFor: ['data', 'coding'], notes: 'Pay-as-you-go' },
    ],
  },
  {
    id: 'chatgpt',
    displayName: 'ChatGPT',
    plans: [
      { name: 'Plus', pricePerUser: 20, bestFor: ['writing', 'research', 'data'] },
      { name: 'Team', pricePerUser: 30, minSeats: 2, bestFor: ['mixed'] },
      { name: 'Enterprise', pricePerUser: -1, bestFor: ['mixed'], notes: 'Custom pricing' },
      { name: 'API Direct', pricePerUser: -1, bestFor: ['data', 'coding'], notes: 'Pay-as-you-go' },
    ],
  },
  {
    id: 'anthropic-api',
    displayName: 'Anthropic API',
    plans: [
      { name: 'Pay-as-you-go', pricePerUser: -1, bestFor: ['coding', 'data'] },
    ],
  },
  {
    id: 'openai-api',
    displayName: 'OpenAI API',
    plans: [
      { name: 'Pay-as-you-go', pricePerUser: -1, bestFor: ['coding', 'data'] },
    ],
  },
  {
    id: 'gemini',
    displayName: 'Gemini',
    plans: [
      { name: 'Pro', pricePerUser: 20, bestFor: ['research', 'writing'] },
      { name: 'Ultra', pricePerUser: 30, bestFor: ['data', 'research'] },
      { name: 'API', pricePerUser: -1, bestFor: ['coding', 'data'] },
    ],
  },
  {
    id: 'windsurf',
    displayName: 'Windsurf',
    plans: [
      { name: 'Free', pricePerUser: 0, bestFor: ['coding'] },
      { name: 'Pro', pricePerUser: 15, bestFor: ['coding'] },
      { name: 'Team', pricePerUser: 35, bestFor: ['coding'] },
    ],
  },
]
