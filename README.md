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

Add Firebase client variables (from **Project settings → General → Your apps**):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 3) Firestore rules/collections

The app reads/writes to the following collections:

- `alumni`
- `admin`
- `events`
- `spotlight`
- `notifications`

Make sure Firestore is enabled in your Firebase project.

#### Admin access setup

Admin login uses Firebase Authentication plus an `admin` collection check:

1. Create the admin user in **Firebase Authentication** (Email/Password).
2. Add a document to the `admin` collection with at least:
   - `email`: the same email used in Firebase Auth
   - `role`: set to `admin`

#### Example Firestore rules

The app uses the Firebase Admin SDK on the server, so Firestore rules do not affect API routes.
If you want to lock down client access, start with strict rules like these:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

If you plan to allow signed-in admins to read their admin record directly from the client,
you can use a rule scoped to the `admin` collection:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /admin/{docId} {
      allow read: if request.auth != null
        && request.auth.token.email == resource.data.email
        && resource.data.role == "admin";
      allow write: if false;
    }
  }
}
```

### 4) Run the app

```bash
npm install
npm run dev
```

If the Firebase credentials are missing, the app will throw an error during server startup. See `src/lib/firebaseAdmin.js` for the credential checks.
