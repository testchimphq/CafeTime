---
type: scenario
id: TS-111
title: Successful Settings Update Displays Notification
story: US-100
created_date: 2026-01-31
priority: high
---

## Prerequisites
- The user must be logged in to the application and on the Settings page.
- The user has access to the mobile number field in the profile information form.
- The application is running, and the user interface is fully loaded.

## Test Steps
- Navigate to the Settings page by entering the URL `https://cafetime-demo.web.app/dashboard/settings`.
- Enter a valid mobile number in the mobile phone input field: `+15551234568`.
- Click the "Update Profile" button to submit the form.
- Wait for the success notification to become visible.

## Expected Behaviour
- After submitting the form with a valid mobile number, the app should display a success notification stating "Profile Updated."
- The mobile number input field should retain the value `+15551234568` indicating the update was successful.
