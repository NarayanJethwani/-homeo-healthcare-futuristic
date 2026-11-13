# Meta (Facebook & Instagram) Social Integration Setup Guide

This document explains how to configure and maintain the Meta Graph API integration for **Homeo Healthcare** within the Next.js administration portal.

---

## 1. Overview & Architecture

Homeo Healthcare maintains an active presence across Meta platforms:
- **Facebook Page**: `Homeo.Healthcare` (Page ID: `61559659413532`)
- **Instagram Professional Account**: Linked to `Homeo.Healthcare` (Username: `@drpooja_homeo.healthcare`)
- **Meta Business Portfolio ID**: `295771956958564`
- **Asset ID**: `295764673625959`

### Strict Clinical Boundary
The social media publishing engine is strictly isolated from patient and clinical data:
- Zero coupling or queries to the `patients` collection.
- Social tokens and secrets are stored in `system_settings/meta_connection` via server-side Firebase Admin SDK.
- Tokens, App Secrets, and OAuth codes are **never** exposed to client-side bundles, API responses, or logs.
- Only users with `super-admin` or `admin` roles can connect, disconnect, or trigger social publications.

---

## 2. Meta for Developers Setup

To enable the automated connection flow:

### Step 2.1: Access Your Meta App
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Log in with the Facebook account that is an Administrator of the `Homeo.Healthcare` Facebook Page.
3. Open or create a Business App:
   - **App Type**: Select **Business** (or **Other** -> **Business**).
   - **App Display Name**: `Homeo Healthcare Portal`
   - **Business Portfolio**: Select `Homeo Healthcare` (`295771956958564`).

### Step 2.2: Add Products
Under **Add Products to Your App**:
1. Add **Facebook Login for Business**.
2. Add **Instagram Graph API**.

### Step 2.3: Configure OAuth Redirect URIs
In the left sidebar, navigate to **Facebook Login for Business** -> **Settings**:
1. Enable **Client OAuth Login**: `Yes`
2. Enable **Web OAuth Login**: `Yes`
3. Add **Valid OAuth Redirect URIs**:
   - For local development:
     `http://localhost:3000/api/admin/social/callback`
   - For staging/production:
     `https://www.homeo.healthcare/api/admin/social/callback`
     *(or your dedicated admin domain, e.g., `https://portal.homeo.healthcare/api/admin/social/callback`)*
4. Save Changes.

### Step 2.4: Required Permissions (Scopes)
The connection flow requests the following permissions:
- `pages_show_list`: To discover and retrieve managed Facebook Pages.
- `pages_read_engagement`: To inspect Page activity and confirm engagement.
- `pages_manage_posts`: To publish text, images, and carousels to the Page feed.
- `instagram_basic`: To read profile information for the linked Instagram business account.
- `instagram_content_publish`: To upload and publish media containers on Instagram.

> [!NOTE]
> **Development Mode vs App Review**:
> While the App is in **Development Mode**, any Facebook user listed as an **Admin**, **Developer**, or **Tester** in the Meta App dashboard can authorize and publish directly without submitting for App Review. Because Homeo Healthcare uses this integration internally for clinic administrators, keeping the App in Development Mode with Dr. Pooja and Dr. Narayan added as App Administrators is sufficient and avoids lengthy third-party review cycles.

---

## 3. Environment Variables Configuration

In your server environment (or `.env.local` for local development), set the following variables:

```bash
# Meta (Facebook & Instagram) Integration (Server-only)
META_APP_ID="YOUR_META_APP_ID"
META_APP_SECRET="YOUR_META_APP_SECRET"
META_REDIRECT_URI="http://localhost:3000/api/admin/social/callback"

# Optional: Override default Graph API version (defaults to v21.0)
META_GRAPH_API_VERSION="v21.0"
```

> [!CAUTION]
> Never commit `.env.local` or real API credentials to Git. `META_APP_SECRET` must only exist in secure server environment variables.

---

## 4. Connecting Meta in the Admin Portal

1. Start your local server (`npm run dev`) or open your deployed admin portal.
2. Sign in with an `admin` or `super-admin` account.
3. In the sidebar under **Administration**, click **Social Publishing** (or navigate directly to `/admin/social`).
4. Click **Connect Meta Account**:
   - You will be redirected to the Meta Facebook authorization dialog.
   - Confirm permissions for `Homeo.Healthcare` and the linked Instagram account.
   - Once authorized, Meta redirects back to `/api/admin/social/callback`.
5. The system automatically:
   - Exchanges the short-lived code for a 60-day long-lived user token.
   - Queries `/me/accounts` and matches `Homeo.Healthcare` (Page ID `61559659413532`).
   - Retrieves the permanent Page Access Token.
   - Discovers the linked Instagram Professional Account ID (`@drpooja_homeo.healthcare`).
   - Stores the connection record securely in Firestore (`system_settings/meta_connection`).
   - Redirects you back to `/admin/social?connected=true`.

---

## 5. Token Lifecycles & Renewal

- **User Access Token**: Stored with an expiration timestamp (~60 days).
- **Page Access Token**: Generated from a long-lived user token, Page access tokens for managed Pages do not expire unless the user changes their Facebook password or revokes permissions.
- **Renewal / Reconnect**:
  - The `/admin/social` dashboard monitors token expiration.
  - If a token is within 7 days of expiration, a warning badge is displayed with a one-click **Reconnect / Refresh Permissions** button.
