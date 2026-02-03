---
type: scenario
id: TS-103
title: search by first name
story: US-101
labels: ["happy path"]
created_date: 2026-02-03
due_date: 2026-02-09
priority: high
---

## Prerequisites
- User must have an active account and be logged into the application.
- User must have access to the team directory feature within the application.
- The team directory is pre-populated with at least 5 team members, including their first names.

## Test Steps
- Navigate to the team directory section of the application.
- Locate the search bar at the top of the team directory.
- Enter a first name of a team member (for example, "Alice") into the search bar.
- Press the "Enter" key or click on the search icon/button to initiate the search.
- Observe the results displayed in the team directory.
- Repeat the process with different first names (e.g., "Bob", "Charlie") to ensure multiple entries can be found.

## Expected Behaviour
- Upon entering the first name "Alice" and searching, the application should display the profile card or listing for the team member named Alice.
- If "Alice" is not part of the team directory, no results should be displayed or a message indicating no matches found should appear.
- When searching for other first names like "Bob" or "Charlie", the corresponding team members should also be displayed if they exist in the directory.
- The search results should refresh and correctly display team members matching the given first name, allowing users to easily identify and select the desired team member.

