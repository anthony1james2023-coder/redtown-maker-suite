## Plan: Add Custom Domain Field to Publish Dialog

### What the user wants

Add a custom domain input to the publish flow so users can enter their own domain (e.g., `mygame.com`) before publishing, and see that domain as their live project URL after publishing.

### Changes

**File: `src/components/builder/PublishDialog.tsx**`

1. **Configure step** — Add a "Custom Domain" input field below the App Name input:
  - Optional text input with placeholder like `mycoolapp.com`
  - Helper text: "Leave blank to use default redtown.app domain"
  - Globe icon decoration
2. **Update `browserLink` logic** — If custom domain is provided, use it (`https://customdomain.com`); otherwise fall back to the existing `appname.redtown.app` URL.
3. **Publishing step** — Add a new task in the `publishTasks` array: "Configuring custom domain DNS..." between the CDN and security scan steps.
4. **Success step** — Display the custom domain prominently if provided:
  - Show the custom domain as the primary link
  - Add a badge/indicator showing "Custom Domain Active"
  - The copy/open buttons use the custom domain URL

### No other files need changes

The PublishDialog is self-contained; Builder.tsx and FathersBuilder.tsx just open/close it.

needs yo be availibale url 