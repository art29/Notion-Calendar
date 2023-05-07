# Notion Calendar

Notion Calendar is a Next 13 app that lets you create ICS calendar files from your Notion Databases that can be used in Google Calendar, Outlook etc.

This is particularly useful when you have a database with a lot of dates (Travel Planner, School Schedule, Assignments Planner etc.)

## Getting Started

1. Clone this repo
2. Setup a PSQL database
3. Create a .env file from the .env.sample file
4. Run `yarn` to install all dependencies
5. Run `npx prisma db push` to update the DB with the needed tables
6. Create a Notion OAuth Integration here: [https://developers.notion.com/docs/create-a-notion-integration](https://developers.notion.com/docs/create-a-notion-integration) and add the keys the .env file
7. Run the dev server with `yarn dev`
8. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contribute

Feel free to make PRs to add new features or open issues if you find any issues.

## License

This app is under the AGPL-3 license.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
