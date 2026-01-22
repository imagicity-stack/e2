import { adminAuth, db } from "@/lib/firebaseAdmin";

export const requireAdmin = async (req) => {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");
  if (!token) {
    const error = new Error("Missing authorization token");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const email = decodedToken.email;
    if (!email) {
      const error = new Error("Email missing from token");
      error.statusCode = 401;
      throw error;
    }

    const adminSnapshot = await db.collection("admin").where("email", "==", email).limit(1).get();
    if (adminSnapshot.empty) {
      const error = new Error("Admin access required");
      error.statusCode = 403;
      throw error;
    }

    const admin = adminSnapshot.docs[0].data();
    if (admin.role !== "admin") {
      const error = new Error("Admin access required");
      error.statusCode = 403;
      throw error;
    }

    return { uid: decodedToken.uid, email, role: admin.role };
  } catch (err) {
    const error = new Error(err.message || "Invalid token");
    error.statusCode = 401;
    throw error;
  }
};
