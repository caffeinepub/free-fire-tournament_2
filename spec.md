# Specification

## Summary
**Goal:** Update the deposit flow in the FreeFire Tournament app to use a UPI Intent Link, add a screenshot upload step after payment, and fix the "Unauthorized" error for logged-in users on the deposit page.

**Planned changes:**
- Replace the static UPI ID display in `ManualDepositModal` with a "Proceed to Pay" button that constructs and triggers the UPI deep link `upi://pay?pa=8728872927@fam&pn=FreeFireTournament&am={amount}&cu=INR` via `window.location.href`
- Enforce a minimum amount of ₹20 client-side before triggering the deep link, showing a validation error if the amount is below the minimum
- After the deep link is triggered, automatically advance the modal to a screenshot upload screen with a file input for the payment screenshot and a transaction ID field
- Allow the user to submit the screenshot and transaction ID from that screen for admin verification
- Audit deposit-related query and mutation hooks in `useQueries.ts` to ensure they use the authenticated actor for logged-in users, eliminating the "Unauthorized" error during deposit flow

**User-visible outcome:** Logged-in users can enter a deposit amount, tap "Proceed to Pay" to open their installed UPI apps (GPay, PhonePe, Paytm), and upon returning to the app are presented with a screenshot upload screen to submit proof of payment — all without encountering an "Unauthorized" error.
