---
type: scenario
id: TS-104
title: handle no matches found
story: US-101
labels: ["negative path"]
created_date: 2026-02-03
due_date: 2026-02-05
priority: high
---

## Prerequisites
- User must be logged into the application.
- User must have access to the team member search functionality.
- Ensure that the search database is set up with team members for testing, and that a scenario exists where no matches can be found. For example, use a unique search term that does not correspond to any current team member.

## Test Steps
- Step 1: Navigate to the team member search feature within the application.
- Step 2: In the search input field, enter a search term that is guaranteed not to match any existing team members (e.g., "abcd1234").
- Step 3: Click on the search button or press "Enter" to initiate the search.
- Step 4: Observe the search results or any notification displayed on the screen.

## Expected Behaviour
- The system should display a message indicating that no team members were found matching the search criteria (e.g., "No team members found for 'abcd1234'.").
- The search input field should retain the entered search term for user convenience.
- The interface should provide an option or recommendation to try a different search term or clear the search input.

