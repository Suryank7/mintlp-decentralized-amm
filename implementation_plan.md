# Implementation Plan - Wallet Connection Enforcement

## Goal
Implement a mandatory "Connect Wallet" modal that blocks user interaction with the application until they connect a wallet. This ensures all users (and judges) are authenticated (via real wallet or mock fallback) before exploring the features.

## User Review Required
> [!IMPORTANT]
> This change will effectively lock the application behind a "login wall".
> The "Mock Fallback" logic implemented earlier will ensure this is not a barrier for judges without wallets.

## Proposed Changes

### UI Component
#### [NEW] `src/components/amm/WelcomeDialog.tsx`
- **Purpose**: A friendly, non-blocking welcome alert.
- **Features**:
  - Glassmorphism design.
  - "Connect Wallet" button (Primary).
  - "Explore Mode" button (Secondary/Close).
  - Informative text about the project context.

### App Integration
#### [MODIFY] `src/App.tsx`
- Import `WelcomeDialog`.
- Render it at the top level.
- It determines its own visibility based on `isWalletConnected` and a local "hasSeenWelcome" state (optional, or just show if not connected).

### Documentation
#### [MODIFY] `USER_GUIDE.md`
- Update "Getting Started" to mention the welcome popup.

## Verification Plan

### Manual Verification
1.  **Initial Load**: Open the app (`http://localhost:5173`).
    *   *Expected*: See the "Welcome to MintLP" Dialog.
2.  **Interaction**: Click "Explore Mode".
    *   *Expected*: Dialog closes, App is usable.
3.  **Connection**: Reload, Click "Connect Wallet".
    *   *Expected*: Wallet connects (Real or Mock). Dialog closes.
