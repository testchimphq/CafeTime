---
type: scenario
id: TS-109
title: user-can-select-member-to-message
story: US-102
created_date: 2026-01-31
priority: high
---

## Prerequisites
- User has logged into the application successfully and is on the Dashboard page.
- There are other members available in the team that can be messaged.

## Test Steps
- Navigate to the "Team Search" section from the dashboard.
- In the search input or member list, locate a member to message (e.g., "Alice").
- Click on the member’s name or the corresponding action button to initiate a message.
- A messaging interface should appear (either as a popup or a new page).
- Enter a message in the message input field (e.g., "Hello Alice, how are you?").
- Click the "Send" button to send the message.

## Expected Behaviour
- The user should successfully navigate to the team search section.
- Upon selecting a member, the messaging interface should load without errors.
- The message input field should accept the message content and allow submission.
- After clicking "Send", the message should be sent successfully, and an acknowledgement should be displayed (e.g., "Message sent!").
