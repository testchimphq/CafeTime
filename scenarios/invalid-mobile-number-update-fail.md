---
type: scenario
title: Invalid mobile number updates fail
story: US-100
---

## Prerequisites



## Test Steps

- Navigate to the URL: https://cafetime-demo.web.app/dashboard/settings
- Fill the mobile number input with an invalid value: 'abcd'
- Click the 'Update Profile' button to attempt to submit the form


## Expected Behaviour

An error message should be displayed indicating that the mobile number format is invalid and the update should not be successful.

