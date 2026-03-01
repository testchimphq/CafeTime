---
type: scenario
id: TS-106
title: Can send messages to managers successfully
story: US-102
labels: ["happy path"]
created_date: 2026-01-27
priority: high
---

## Prerequisites

test

## Test Steps

- Navigate to url: https://cafetime-demo.web.app/dashboard
- Ensure that the user is signed in as a regular user
- Locate and click on the 'Messages' section in the navigation sidebar
- In the messages interface, select a manager from the list of members
- Input the message text 'Hello, I would like to discuss the upcoming project.' in the message input field
- Click on the 'Send' button to dispatch the message


## Expected Behaviour

The message should be successfully sent, and the interface should display a confirmation or the sent message in the conversation thread with the selected manager.

