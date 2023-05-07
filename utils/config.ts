interface Offer {
  title: string
  description: string
  price: number
  linePrice: string
}

interface Pricing {
  monthly: {
    offers: Offer[]
    cycle: string
  }
  yearly: {
    offers: Offer[]
    cycle: string
  }
}

export const pricing: Pricing = {
  monthly: {
    offers: [
      {
        title: 'Free',
        description: 'Access to one free calendar!',
        price: 0,
        linePrice: process.env.NEXT_PUBLIC_MONTHLY_LINE_PRICE_FREE ?? '',
      },
      {
        title: 'Premium',
        description: 'Access to unlimited calendars!',
        price: 1,
        linePrice: process.env.NEXT_PUBLIC_MONTHLY_LINE_PRICE_PREMIUM ?? '',
      },
    ],
    cycle: 'month',
  },
  yearly: {
    offers: [
      {
        title: 'Free',
        description: 'Access to one free calendar!',
        price: 0,
        linePrice: process.env.NEXT_PUBLIC_YEARLY_LINE_PRICE_FREE ?? '',
      },
      {
        title: 'Premium',
        description: 'Access to unlimited calendars!',
        price: 10,
        linePrice: process.env.NEXT_PUBLIC_YEARLY_LINE_PRICE_PREMIUM ?? '',
      },
    ],
    cycle: 'year',
  },
}
