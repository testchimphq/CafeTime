---
type: story
title: user should be able to update settings
---

### Summary.

The user story "user should be able to update settings" focuses on allowing users to modify their account settings within the application, including their profile information and notification preferences. This feature enhances user experience by enabling personalized configurations that cater to individual needs.

  
### Functional Requirements.

\- The user must be able to navigate to the Settings page from the dashboard.- The user should be able to update their name, email, and mobile phone in the profile information form.- The application must validate the inputs for the name and phone number fields, preventing submission if they do not meet specified criteria.- The user should receive a success notification when their profile is successfully updated.- The application should persist user preferences for email notifications after changes are made.- Any validation errors should be displayed inline when improper or invalid inputs are detected.

  
### Non Functional Requirements.

\- The settings update process should not exceed a response time of 2 seconds for optimal performance.- The user interface must remain responsive during the update process to enhance user experience.- Notifications (success or error) must be displayed prominently and should be accessible without disrupting user flow.

  
### User Acceptance Criteria.

\- The user can access the Settings page by clicking on the "Settings" link in the dashboard navigation.

\- The user is able to edit and submit valid changes to their mobile phone number and see a success notification afterward.

\- The user cannot submit the form if the name field contains digits, with an appropriate validation message displayed.

\- The user's email field should display their current email and should not be editable if it is intended to be read-only.

\- The email notification preference toggle properly reflects the user’s changes after submission.

\- Upon submitting valid details (letters in the name field and correctly formatted phone number), the confirmation message "Profile Updated" should be visible.
