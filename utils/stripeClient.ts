import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  const key =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ?? ''
      : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST ?? ''

  if (!stripePromise) {
    stripePromise = loadStripe(key)
  }

  return stripePromise
}
