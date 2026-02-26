# Specification

## Summary
**Goal:** Add a "Secure Payment" section to the Free Fire Tournament site, placed directly above the Registration Form, displaying UPI payment details with a copy-to-clipboard button.

**Planned changes:**
- Create a new `SecurePayment` section component with:
  - Heading: "Secure Payment"
  - UPI ID text: "Pay the entry fee to the following UPI ID to participate: 8728872927@fam"
  - "Copy ID" button that copies `8728872927@fam` to clipboard and briefly shows "Copied!" feedback
  - Note: "Please keep the transaction screenshot ready for the form"
  - Dark red tinted background (e.g. `#1a0505` or `rgba(229,62,62,0.10)`) with red accent borders
  - Styled with Orbitron/Rajdhani fonts and angular design matching the existing Free Fire theme
- Insert the new section in `App.tsx` immediately before the `RegistrationForm` section
- Ensure the section is fully mobile-responsive

**User-visible outcome:** Users will see a styled payment instructions panel above the registration form, where they can easily copy the UPI ID to their clipboard before filling out the form.
