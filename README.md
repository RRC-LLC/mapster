# Welcome to Mapster!

![Mapster screenshot](/public/SCREENSHOT.png)

This is the repository for the [Pinegrove Map Project](https://mapster.pinegroveband.com) - otherwise known as Mapster - an exhaustive, interactive, evolving archive of Pinegrove's touring history across the United States, crafted with care in collaboration with [Router](https://router.is/). It's built primarily with [Next.js](https://github.com/vercel/next.js), [Payload](https://github.com/payloadcms/payload), and [Leaflet](https://github.com/Leaflet/Leaflet) and is being made available under the [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.en.html) license for you to freely use and make your own.

## Environment Setup
### Prod

The codebase is configured for production using MongoDB, S3-compatible object storage for images + files, Resend for emails, and ReCAPTCHA for uploads. See `.env.example` for a list of the necessary environment variables.

### Dev

To configure your development environment, you will need to provide suitable alternatives for the above resources. We recommend running Mongo inside Docker and modifying the Payload upload configuration to utilize local storage.

If contributing to Mapster, you can use the seed script + csv in the `/data` folder. Make sure to disable the revalidateTag hooks when using the Payload CLI.

## Contribution Guide

We welcome upgrades, updates, and new features from the community. If you'd like to contribute, open a PR with a [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)-conforming title, using the following examples as a guide:

- `feat: add new feature`
- `fix: fix bug`
- `docs: add documentation`
- `refactor: refactor code`

## Feature Requests 

A (non-exhaustive) list of features we would love to see (and we're always grateful for additional suggestions):

- Email collection, review notifications, + feedback for media uploads using Payload hooks.
- Containerized development environment. The current requirements for setting up a local environment represent a high barrier to entry for contributors, so a simpler process would be a step in the right direction. 
- Content agnostic refactor. Mapster was purpose-built for Pinegrove and that certainly shows in its construction. Refactoring the codebase to better adapt to a variety of schemas and styles will serve to make self-hosting + customization more attainable.
