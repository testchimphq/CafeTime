---
type: scenario
id: TS-107
title: empty messages cannot be sent
story: US-102
created_date: 2026-01-27
priority: medium
---

## Prerequisites
- User is logged into the application and on the messaging interface or dashboard that enables access to the messaging feature.
- There are other members available for messaging in the application.

## Test Stepss
- Navigate to the messaging interface within the application.
- Locate the message input area on the screen.
- Leave the message input area blank and ensure it is empty.
- Attempt to send the empty message by clicking on the "Send" button.

## Expected Behaviour
- The application should prevent the empty message from being sent and display a validation message indicating that the message cannot be empty (e.g., "Message cannot be empty."). The send action should not result in a message being sent or displayed in the conversation.
