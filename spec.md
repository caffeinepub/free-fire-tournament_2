# Specification

## Summary
**Goal:** Make the Live Lobby (`/lobby`) the permanent home screen for all authenticated users, preventing any navigation back to auth or landing pages.

**Planned changes:**
- Update router configuration in `App.tsx` so authenticated users visiting `/`, `/login`, or `/signup` are automatically redirected to `/lobby`
- Update `LobbyPage.tsx` history replace logic to also clear `/home` from the browser history stack, preventing back-navigation to any auth or landing screen
- Update the "Back to Home" button in `RegisterPage.tsx` to navigate to `/lobby` instead of `/` or any auth screen
- Update `Navbar.tsx` so the "Home" link routes authenticated users to `/lobby` instead of `/` or `/home`

**User-visible outcome:** Once logged in, users always land on and remain within the Live Lobby. The browser back button, manual URL navigation, and all in-app links never send an authenticated user back to the welcome, login, or signup screens.
