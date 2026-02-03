---
type: scenario
id: TS-102
title: show validation error for invalid phone input
story: US-100
labels: ["negative path"]
created_date: 2026-02-03
due_date: 2026-02-10
priority: medium
---

## Prerequisites
- User must be logged into their account.
- User must navigate to the settings page.
- The phone number field should be empty or contain invalid data to test validation.

## Test Steps
- Step 1: Open the settings page in the application.
- Step 2: Locate the phone number input field.
- Step 3: Enter an invalid phone number format, such as "12345" or "abcd1234".
- Step 4: Attempt to save the changes by clicking the "Save" button.
- Step 5: Observe the interface for any validation messages or errors related to the phone number input.

## Expected Behaviour
- The system should prevent the user from saving the changes.
- A clear validation error message should display near the phone number input field, indicating that the input is invalid.
- The message should guide the user on the correct format for the phone number (e.g., "Please enter a valid phone number format.").

