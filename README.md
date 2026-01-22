# EHSAS Next.js App

## Firebase setup

This project relies on Firebase Admin SDK for server-side data access. Configure the following before running locally or deploying.

### 1) Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a project (or use an existing one).
3. In **Project settings → Service accounts**, generate a new private key.
4. Download the JSON key file.

### 2) Configure environment variables

Set these environment variables from the downloaded service account JSON:

- `FIREBASE_PROJECT_ID` → `project_id`
- `FIREBASE_CLIENT_EMAIL` → `client_email`
- `FIREBASE_PRIVATE_KEY` → `private_key`
  - **Important:** preserve newlines. If you store it in `.env.local`, replace newlines with `\n`.

Example `.env.local`:

```bash
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xyz@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3) Firestore rules/collections

The app reads/writes to the following collections:

- `alumni`
- `admins`
- `events`
- `spotlight`
- `notifications`

Make sure Firestore is enabled in your Firebase project.

### 4) Run the app

```bash
npm install
npm run dev
```

If the Firebase credentials are missing, the app will throw an error during server startup. See `src/lib/firebaseAdmin.js` for the credential checks.
