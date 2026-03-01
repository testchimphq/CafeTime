---
type: scenario
id: TS-121
title: import of no user stories should work
story: US-107
labels: ["NewWork"]
created_date: 2026-02-15
due_date: 2026-03-01
priority: high
---

## Prerequisites
- The user must have an active account in the application.
- The user must be logged into the application.
- The user must have access to a Jira instance and necessary permissions to sync work items.
- The application must be integrated with Jira through API endpoints.

## Test Steps
- Navigate to the "Projects" section in the application.
- Locate and click on the "Sync with Jira" button, which should be present in the project management interface.
- In the sync options that appear, choose the appropriate Jira project from a dropdown list.
- If applicable, select any specific work items or filters to synchronize (e.g., "All Open Issues").
- Click on the "Start Sync" button to initiate the synchronization process.
- Verify that a loading indicator appears while the sync is in progress.
- Once the sync is complete, check for a success message confirming that the items have been synced.
- Navigate to the "Work Items" or relevant section in the application to verify that the synced work items are displayed correctly.
- Ensure that the synced work items contain the expected fields like title, description, status, and any custom fields from Jira.

## Expected Behaviour
- The "Sync with Jira" button is visible and clickable.
- A loading indicator appears during the synchronization process.
- After a successful sync, a success message is displayed to the user.
- The work items synced from Jira are visible in the application, accurately reflecting their details and status.
- Any configurable filters or options should function correctly, allowing selective synchronization as per the user's requirements.
