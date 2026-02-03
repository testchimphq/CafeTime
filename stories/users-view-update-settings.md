---
type: story
id: US-100
title: Users can view and update settings
labels: ["settings"]
created_date: 2026-01-27
due_date: 2026-02-10
priority: high
---

### Summary.

The user story focuses on enabling users to view and update their settings within the application. This includes personal profile information like name, email, and mobile phone number, alongside notification preferences. The changes made should be saved persistently, ensuring users can modify their information easily while receiving appropriate feedback regarding the success of the actions they take.

  
### Functional Requirements.

- Users must be able to view their current settings information (name, email, mobile phone, notification preferences).
- Users should have the ability to edit their name, mobile phone, and toggle email/SMS notification settings.
- The "Update Profile" button must submit any changes made to the profile fields.
- A notification must appear confirming the successful update or any validation errors upon form submission.
- The system should persistently save the data, maintaining the updated values during subsequent visits to the settings screen.

  
### Non Functional Requirements.

- The settings update process must complete in under 2 seconds to ensure a responsive user experience.
- The application must validate all input fields to ensure correctness before allowing the submission of changes.
- The UI should remain accessible, with clear error messages for invalid inputs.
- Response messages (success and error) must be visible for at least 3 seconds.
- Consistency in the UI design should be maintained across different contexts and states.

  
### User Acceptance Criteria.

- Users can view their current settings on the settings page. 

- Users can successfully update their name and mobile number. 

- A success notification appears after the profile is updated. 

- Validation messages are shown when invalid data is entered (e.g., unsupported characters in the name). 

- Users can toggle their email notifications and see the changes persisted after saving. 

- The email field remains read-only to prevent unauthorized modifications. 

- The system must not navigate away from the settings page after saving changes; it should remain on the settings screen. 

- All changes must be reflected correctly after a page reload.
