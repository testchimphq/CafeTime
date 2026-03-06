---
type: scenario
id: TS-116
title: Unauthenticated User Redirects To Login
story: US-107
created_date: 2026-02-03
due_date: 2026-02-18
priority: high
---

## Prerequisites
- User is not authenticated or logged in.
- The application is accessible via the URL `https://cafetime-demo.web.app/`.
- Ensure the login page is fully loaded and all elements are rendered properly.

## Test Steps
- Navigate to the application homepage by entering the URL `https://cafetime-demo.web.app/`.
- Check if the user is automatically redirected to the Login Page.
- Confirm that the Login Page is displayed with the following elements:
 - The header/branding, which should read "CafeTime Portal".
 - The Sign In and Register tabs are present, indicating the user can choose to log in or create a new account.
 - Input fields for email and password, role selector, and the Sign In button are all visible.
- Ensure that the sign-in form is in the active state with no validation errors displayed.

## Expected Behaviour
- The user should be redirected to the Login Page upon accessing the application without authentication.
- The Login Page should display all required elements as specified, including:
 - Correct branding and navigation options.
 - Email input field, password input field, role selector, and the Sign In button all properly rendered.
- No error messages or validation indicators should be present on the page when it loads.

