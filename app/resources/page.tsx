'use client'

import AccordionPanel from '@/components/AccordionPanel'
import Link from 'next/link'

export default async function Resources() {
  return (
    <div className="mx-auto px-4 lg:px-10 w-full lg:w-[60%]">
      <h2 className="text-4xl mb-4 font-medium">Resources</h2>
      <div className="flex flex-col gap-y-2">
        <AccordionPanel questionText="What is Notion Calendar?">
          <div>
            Notion Calendar is a freemium tool made to sync your Notion
            Databases to your various calendars apps (Google Calendar, Outlook
            etc., basically anything that supports ICS files).
          </div>
        </AccordionPanel>
        <AccordionPanel questionText="How does it work?">
          <div>
            It works by looking through your Notion Databases once in a while
            and getting all the necessary data to generate an ICS file. You can
            even customize each field (title of the event, add reminders and
            more!).
          </div>
        </AccordionPanel>
        <AccordionPanel questionText="Is the app stable yet?">
          <div>
            Not yet! We are still in Alpha stage. Once we are ready, we&apos;ll
            deploy a public beta and then a stable version!
          </div>
        </AccordionPanel>
        <AccordionPanel questionText="Can I try the Premium plan for free?">
          <div>
            We have setup a free trial of 14 days for you! But since we&apos;re
            still in beta, you can email us at notioncalendar[@]afetiveau.com to
            get a free coupon code :)
          </div>
        </AccordionPanel>
        <AccordionPanel questionText="I paid for the premium plan but I don't have access to it on my account..">
          <div>
            First of all, we&apos;re sorry this happened. Please email us at
            notioncalendar[@]afetiveau.com and we&apos;ll resolve that as soon
            as possible.
          </div>
        </AccordionPanel>
        <AccordionPanel questionText="I want to cancel or change my plan, how do I do that?">
          <div>
            Log-in with the Notion Account you used to subscribe and in the
            top-right dropdown, click on &quot;Manage Premium
            Subscription&quot;. It will be bring you to our payment
            processor&apos;s website (Stripe.com) where you can do the changes.
          </div>
        </AccordionPanel>
        <AccordionPanel questionText="I have a question, how can I contact you?">
          <div>
            Send us an email at notioncalendar[@]afetiveau.com! We&aposll be
            happy to answer all your questions.
          </div>
        </AccordionPanel>
        <AccordionPanel questionText="I want to contribute?">
          <div>
            You can look at our{' '}
            <Link
              className="text-black underline underline-offset-4"
              href={'https://github.com/art29/notion-calendar'}
            >
              GitHub Repo
            </Link>{' '}
            and create issues or PRs!
          </div>
        </AccordionPanel>
      </div>
    </div>
  )
}
