---
type: scenario
title: Search functionality handles no results found gracefully
story: US-101
---

## Prerequisites



## Test Steps

- Navigate to the URL: https://cafetime-demo.web.app/dashboard/team-search
- Enter a search term that will not match any existing team member (e.g., 'xxxxxx') in the search input field
- Click the search button to initiate the search


## Expected Behaviour

The application displays a message indicating that no results were found for the search term.

