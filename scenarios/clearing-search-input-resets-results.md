---
type: scenario
id: TS-105
title: Clearing the search input resets the results accurately
---

## Prerequisites
- User must be logged into the application and navigated to the "Team Search" screen.
- Search input should have been previously populated with a search term, and results should be visible on the screen.

## Test Steps
- Ensure the application is displaying the "Team Search" screen.
- Locate the search input field.
- Confirm that the search results are currently populated based on the initial search term.
- Clear the search input by performing one of the following:
  - Press the 'Backspace' key until the input is empty.
  - Alternatively, click on a "Clear" button if available.
- Wait for a moment to allow the results to refresh after clearing the input.

## Expected Behaviour
- After the search input is cleared, the search results should be effectively reset:
  - No results should be displayed on the screen.
  - The search input should be empty.
  - Any previous search state or filters applied should be cleared, returning to the default state.
