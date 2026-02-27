# Specification

## Summary
**Goal:** Change the minimum deposit amount to ₹10 in both the backend and frontend.

**Planned changes:**
- Update backend validation to reject deposit requests below ₹10, returning a clear error message.
- Update the `ManualDepositModal` frontend component to enforce a minimum input value of 10, show a validation error "Minimum deposit amount is ₹10" on invalid submission, and display ₹10 as the minimum deposit in the UI.

**User-visible outcome:** Users can no longer submit a deposit below ₹10; attempting to do so shows a clear validation error both client-side and server-side.
