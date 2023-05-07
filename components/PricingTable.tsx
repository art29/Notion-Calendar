'use client'

import { useState } from 'react'
import Button from '@/components/Button'
import { signIn } from 'next-auth/react'
import { Session } from 'next-auth'
import fetch from 'node-fetch'
import { getStripe } from '@/utils/stripeClient'
import { pricing } from '@/utils/config'

interface PricingTableProps {
  session: Session | null
  currentPlans: string[]
}

const PricingTable = ({ session, currentPlans }: PricingTableProps) => {
  const monthlyBilling: ('monthly' | 'yearly')[] = ['monthly', 'yearly']
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly',
  )

  const handleCheckout = async (linePrice: string) => {
    if (!!session) {
      await fetch('/api/checkout/session', {
        method: 'POST',
        body: JSON.stringify({
          line_price: linePrice,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.update_url) {
            window.location.href = data.update_url
          } else {
            const stripe = await getStripe()
            stripe?.redirectToCheckout({ sessionId: data.sessionId })
          }
        })
        .catch((err) => console.log(err))
    } else {
      await signIn('notion')
    }
  }

  return (
    <div className="my-3 w-full flex flex-col" id="pricing">
      <div className="rounded-lg flex px-3 py-2 bg-gray-900 mx-auto my-3">
        {monthlyBilling.map((bc) => (
          <button
            key={`${bc}-billing-title`}
            onClick={() => setBillingCycle(bc)}
            type="button"
            className={`${
              billingCycle === bc
                ? 'bg-gray-600 border-gray-800 shadow-sm text-white'
                : 'border border-transparent text-gray-400'
            } rounded-md m-1 py-2 text-sm font-medium px-8 md:whitespace-nowrap`}
          >
            {bc[0].toUpperCase() + bc.slice(1).toLowerCase()} Billing
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-y-3 md:gap-y-0 md:grid-cols-2 md:gap-x-3">
        {pricing[billingCycle].offers.map((p) => (
          <div
            key={`${billingCycle}-${p.price}`}
            className={`rounded-lg shadow-lg bg-gray-900 ${
              currentPlans.includes(p.linePrice) && 'ring-2 ring-pink-700'
            }`}
          >
            <div className="p-6">
              <h2 className="text-2xl leading-6 font-semibold text-white">
                {p.title}
              </h2>
              <p className="mt-4 text-gray-300">{p.description}</p>
              <p className="mt-4">
                <span className="text-4xl font-extrabold text-white">
                  ${p.price}
                </span>
                <span className="text-xl font-medium text-gray-100">
                  /{pricing[billingCycle].cycle}
                </span>
              </p>
              {currentPlans.includes(p.linePrice) ? (
                <Button
                  styling="mt-4 py-2 w-full"
                  type="button"
                  theme="light"
                  disabled={true}
                >
                  Your Current Plan!
                </Button>
              ) : (
                <Button
                  styling="mt-4 py-2 w-full"
                  type="button"
                  theme="light"
                  onClick={() => handleCheckout(p.linePrice)}
                >
                  Subscribe
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PricingTable
