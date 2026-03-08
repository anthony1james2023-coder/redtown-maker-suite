# Plan: Add Google Sign-In

## Overview

Add Google OAuth sign-in using Lovable Cloud's managed Google Auth. Users will see a "Sign in with Google" button in the navbar. No API keys or external setup needed.

## Steps

1. **Configure Social Auth** — Use the Configure Social Login tool to generate the `src/integrations/lovable` module and install `@lovable.dev/cloud-auth-js` for Google OAuth.
2. **Create Auth context** — Build a `src/contexts/AuthContext.tsx` with `onAuthStateChange` listener to track the current user session globally across the app.
3. **Create Login page** — New `/login` page with a "Sign in with Google" button using `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })`.
4. **Update Navbar** — Show the user's avatar/name when logged in with a dropdown (profile, sign out), or a "Sign In" button when logged out.
5. **Link projects to users** — Add a `user_id` column to the `projects` table (nullable for existing data), update RLS policies so logged-in users see their own projects, and update the builder's save logic to attach `user_id`.

## Technical Notes

- Lovable Cloud manages Google OAuth automatically — no credentials needed.
- The `lovable.auth.signInWithOAuth()` function handles the full OAuth flow.
- Existing projects (without `user_id`) will remain accessible to [everyone.no](http://everyone.no)

Sign in with Google redtown 2