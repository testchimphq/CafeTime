---
type: scenario
id: TS-105
title: Sending empty messages is prevented
story: US-102
created_date: 2026-02-03
due_date: 2026-02-14
priority: high
---

## Prerequisites
- The user must be logged into the messaging application.
- The messaging application is installed and functioning properly.

## Test Steps
- Navigate to the messaging interface within the application.
- Select the contact or group to whom you want to send a message.
- In the message input field, leave it completely empty.
- Attempt to send the message by clicking the "Send" button.
- Observe the application's response.

## Expected Behaviour
- The application should prevent sending the empty message.
- A validation message should appear indicating that empty messages cannot be sent.
- The message input field should remain empty, and no new message should appear in the conversation thread.

