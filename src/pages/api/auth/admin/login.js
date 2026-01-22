import { adminAuth, db } from "@/lib/firebaseAdmin";
import { sendError } from "@/lib/api-helpers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ detail: "Method not allowed" });
    return;
  }

  try {
    const { idToken } = req.body || {};

    if (!idToken) {
      res.status(400).json({ detail: "Firebase ID token is required" });
      return;
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;
    if (!email) {
      res.status(401).json({ detail: "Email missing from token" });
      return;
    }

    const adminSnapshot = await db.collection("admin").where("email", "==", email).limit(1).get();
    if (adminSnapshot.empty) {
      res.status(403).json({ detail: "Admin access required" });
      return;
    }

    const admin = adminSnapshot.docs[0].data();
    if (admin.role !== "admin") {
      res.status(403).json({ detail: "Admin access required" });
      return;
    }

    res.status(200).json({
      email,
      role: admin.role,
    });
  } catch (error) {
    sendError(res, error);
  }
}
