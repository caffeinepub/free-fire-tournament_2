# Specification

## Summary
**Goal:** Fix premature closing of the UPI intent flow in `ManualDepositModal.tsx` and add a manual "Verify Payment" button so users are not auto-redirected before completing payment.

**Planned changes:**
- Remove or disable any `setTimeout`/auto-return timers that fire before a Success/Failure transaction status is received; increase any wait timeout to at least 5 minutes or make it indefinite.
- Update the UPI intent launch logic so the modal stays on the UPI payment step after opening the `upi://pay?...` URI and does not auto-advance or auto-close.
- Verify and fix the UPI URI construction to include all required parameters (`pa`, `pn`, `am`, `cu`, `tn`) with proper URL encoding, and ensure opening the URI does not reset React component state.
- Add a prominent "Verify Payment" button on the UPI payment step (visible only after the intent is triggered) that manually advances the modal to the UTR number entry step, styled consistently with the existing dark gaming aesthetic and red accents.

**User-visible outcome:** After triggering a UPI payment, the modal remains open and stable on the payment step without auto-closing or redirecting. If the auto-redirect does not occur, the user can click "Verify Payment" to manually proceed to enter their UTR number.
