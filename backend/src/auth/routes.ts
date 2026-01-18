import { Router } from "express";
import passport from "passport";

const authRouter = Router();

// --- Triggers ---
// authRouter.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] }),
// );

const FRONTEND_URL = "http://localhost:3000";


authRouter.get("/google", (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect(`${FRONTEND_URL}/chat`);
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// authRouter.get(
//   "/github",
//   passport.authenticate("github", { scope: ["user:email"] }),
// );

// Updated GitHub Trigger with Gatekeeper
authRouter.get("/github", (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect(`${FRONTEND_URL}/chat`);
  }
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
});

// --- Callbacks ---
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("http://localhost:3000/chat"),
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => res.redirect("http://localhost:3000/chat"),
);

// --- Session Management ---
authRouter.get("/me", (req, res) => {
  res.json({ user: req.user || null });
});

authRouter.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
});

export default authRouter;
