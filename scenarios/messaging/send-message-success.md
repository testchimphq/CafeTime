---
type: scenario
id: TS-106
title: User sends a message
story: US-102
created_date: 2026-02-03
due_date: 2026-02-09
priority: high
---

## Prerequisites
- User is logged into the messaging application.
- User has a valid contact in their contact list to send a message to.
- The messaging application is connected to the internet.

## Test Steps
- Navigate to the messaging section of the application.
- Select a contact from the contact list (e.g., "John Doe").
- Tap on the text input field to open the keyboard.
- Enter the message text "Hello, John! How are you?".
- Press the 'Send' button to dispatch the message.

## Expected Behaviour
- The application displays the sent message "Hello, John! How are you?" in the conversation window immediately after pressing 'Send'.
- A confirmation indicator (such as a checkmark) appears next to the sent message, confirming that it has been delivered.
- The message appears in the recipient's conversation thread with a timestamp indicating when it was sent.

