import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import {
  findOrCreateStripeCustomer,
  findStripeCustomer,
  isUserSubscribed,
  stripe,
} from '@/utils/stripe'

export async function POST(request: Request) {
  // @ts-ignore
  const userSession = await getServerSession(authOptions)
  if (!userSession?.user.id) {
    return NextResponse.json(
      { error: 'account non authenticated' },
      { status: 403 },
    )
  }

  const res = await request.json()
  if (!res.line_price) {
    return NextResponse.json({ error: 'missing line price' }, { status: 422 })
  }

  const customer = await findOrCreateStripeCustomer(userSession)
  if (!customer) {
    return NextResponse.json(
      { error: 'An error occurred, try again later' },
      { status: 500 },
    )
  }

  const userSubscribed = await isUserSubscribed()
  if (
    userSubscribed.isSubscribed &&
    userSubscribed?.plans?.length &&
    userSubscribed.fullPlanData?.length
  ) {
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      flow_data: {
        // @ts-ignore TODO: Once stable, remove this
        type: 'subscription_update_confirm',
        subscription_update_confirm: {
          recurring_items: [
            {
              id: userSubscribed.fullPlanData[0].items.data[0].id,
              price: res.line_price,
            },
          ],
          subscription: userSubscribed.plans[0],
        },
      },
      return_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/dashboard`,
    })

    return NextResponse.json({ update_url: url }, { status: 200 })
  } else {
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer,
      line_items: [
        {
          price: res.line_price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata: {},
      },
      payment_method_collection: 'if_required',
      success_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/`,
    })

    return NextResponse.json({ sessionId: stripeSession.id }, { status: 200 })
  }
}

export async function GET(request: Request) {
  // @ts-ignore
  const userSession = await getServerSession(authOptions)
  if (!userSession?.user.id) {
    return NextResponse.json(
      { error: 'Account non authenticated' },
      { status: 403 },
    )
  }

  const customer = await findStripeCustomer(userSession.user.id)
  if (!customer) {
    return NextResponse.json(
      { error: 'An error occurred, try again later' },
      { status: 500 },
    )
  }

  const { url } = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/dashboard`,
  })

  return NextResponse.json({ url: url }, { status: 200 })
}
