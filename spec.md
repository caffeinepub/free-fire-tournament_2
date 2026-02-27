# Specification

## Summary
**Goal:** Add a user profile/wallet side menu to the Lobby, wire "Join Now" buttons to the Registration page, and back-navigation to always return to the Lobby.

**Planned changes:**
- Add a profile icon button to the top-right of the LobbyPage header (dark red/black/gold theme)
- Create a `/profile` route and ProfilePage showing: Account Details (Player Name + UID), Wallet balance (₹0.00), Deposit and Withdraw buttons, and a Terms & Conditions link to `/rules`
- Register `/profile` in the TanStack Router with the same auth guard as other protected routes
- Wire "Join Now" button on TournamentCard and RoomCard components to navigate to `/register`
- Ensure Back buttons on both ProfilePage and RegisterPage navigate to `/lobby`
- Add `walletBalance: Float` field (defaulting to 0.0) to the backend User type in `main.mo`
- Add backend query/update stubs: `getWalletBalance`, `deposit`, and `withdraw` (with no-negative-balance validation)

**User-visible outcome:** Players on the Lobby can click their profile icon to view account details and wallet balance, use Deposit/Withdraw stubs, and clicking "Join Now" on any tournament card correctly opens the Registration page. Back navigation always returns to the Live Lobby.
