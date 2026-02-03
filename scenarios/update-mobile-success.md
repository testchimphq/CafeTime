---
type: scenario
id: TS-101
title: update mobile number successfully
story: US-100
created_date: 2026-02-03
priority: high
---

## Prerequisites
- User must be logged into the application.
- User must have access to the settings page.
- User must have a valid mobile number to enter for the update.

## Test Steps
- Navigate to the settings page from the user account dashboard.
- Locate the section labeled "Mobile Number."
- Observe the current mobile number displayed.
- Click on the "Edit" button next to the mobile number field.
- Enter a new valid mobile number in the input field (e.g., "123-456-7890").
- Confirm the new mobile number by re-entering it in the confirmation field (e.g., "123-456-7890").
- Click the "Save" button to update the mobile number.
- Wait for the operation to complete and observe any confirmation messages displayed.

## Expected Behaviour
- The application should successfully save the new mobile number.
- A confirmation message should be displayed, indicating that the mobile number has been updated (e.g., "Your mobile number has been updated successfully.").
- The updated mobile number should be reflected in the settings page, showing the new number instead of the old one.
- Any previous mobile number should no longer be displayed.

