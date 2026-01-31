---
type: scenario
id: TS-110
title: Name Field Validates Letters Only
story: US-100
---

## Prerequisites
- User is logged in and is on the Settings page.
- The application is accessible at `https://cafetime-demo.web.app/dashboard/settings`.

## Test Steps
- Navigate to the settings page by entering the URL in the browser.
- Enter an invalid name `12345` in the Name input field.
- Fill the Mobile Phone input field with a valid number `+15551234568`.
- Click the "Update Profile" button to submit the form.

## Expected Behaviour
- The application should display a validation message that states "Name can only contain letters and spaces".
- The form should prevent submission; the profile should not be updated with the invalid name.
