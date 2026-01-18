// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as GitHubStrategy } from "passport-github2";
// import { db } from "../db/index.ts";
// import { users } from "../db/schema.ts";
// import { eq, and } from "drizzle-orm";
// import { env } from "../env.ts";

// // Save user ID to the session cookie
// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// // Retrieve the full user from the DB using the ID in the cookie
// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const [user] = await db.select().from(users).where(eq(users.id, id));
//     done(null, user || null);
//   } catch (err) {
//     done(err, null);
//   }
// });

// // GOOGLE STRATEGY
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: env.GOOGLE_CLIENT_ID,
//       clientSecret: env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let [user] = await db
//           .select()
//           .from(users)
//           .where(
//             and(eq(users.provider, "google"), eq(users.providerId, profile.id)),
//           );

//         if (!user) {
//           [user] = await db
//             .insert(users)
//             .values({
//               email: profile.emails?.[0].value || "",
//               name: profile.displayName,
//               image: profile.photos?.[0].value,
//               provider: "google",
//               providerId: profile.id,
//             })
//             .returning();
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     },
//   ),
// );

// // GITHUB STRATEGY
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: env.GITHUB_CLIENT_ID,
//       clientSecret: env.GITHUB_CLIENT_SECRET,
//       callbackURL: "/api/auth/github/callback",
//     },
//     async (
//       accessToken: string,
//       refreshToken: string,
//       profile: any,
//       done: any,
//     ) => {
//       try {
//         let [user] = await db
//           .select()
//           .from(users)
//           .where(
//             and(eq(users.provider, "github"), eq(users.providerId, profile.id)),
//           );

//         if (!user) {
//           [user] = await db
//             .insert(users)
//             .values({
//               email: profile.emails?.[0].value || "", // GitHub sometimes hides emails
//               name: profile.displayName || profile.username,
//               image: profile.photos?.[0].value,
//               provider: "github",
//               providerId: profile.id,
//             })
//             .returning();
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     },
//   ),
// );

// import passport from "passport";

// import {
//   Strategy as GoogleStrategy,
//   Profile as GoogleProfile,
// } from "passport-google-oauth20";

// // import {
// //   Strategy as GitHubStrategy,
// //   Profile as GitHubProfile,
// // } from "passport-github2";
// import GitHub from "passport-github2";
// import type { Profile as GitHubProfile } from "passport-github2";

// import { db } from "../db/index.ts";
// import { users } from "../db/schema.ts";
// import { eq, and } from "drizzle-orm";
// import { env } from "../env.ts";

// /**
//  * Interface to solve 'exactOptionalPropertyTypes'
//  */
// interface UserProfile {
//   email: string;
//   name: string;
//   image: string | undefined;
//   provider: "google" | "github";
//   providerId: string;
// }

// /**
//  * REUSABLE HELPER: Find or Create User logic
//  * This removes the repetition from the strategies
//  */
// async function findOrCreateUser(profileData: UserProfile) {
//   const [existingUser] = await db
//     .select()
//     .from(users)
//     .where(
//       and(
//         eq(users.provider, profileData.provider),
//         eq(users.providerId, profileData.providerId),
//       ),
//     );

//   if (existingUser) return existingUser;

//   const [newUser] = await db
//     .insert(users)
//     .values({
//       email: profileData.email,
//       name: profileData.name,
//       image: profileData.image ?? null, // Convert undefined to null for DB
//       provider: profileData.provider,
//       providerId: profileData.providerId,
//     })
//     .returning();

//   return newUser;
// }

// // 1. Serialize/Deserialize
// passport.serializeUser((user: any, done) => done(null, user.id));
// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const [user] = await db.select().from(users).where(eq(users.id, id));
//     done(null, user || null);
//   } catch (err) {
//     done(err, null);
//   }
// });

// /**
//  * 2. SHARED CALLBACK LOGIC
//  * This handles the "Object is possibly undefined" error properly
//  */
// const handleAuthCallback = async (
//   profile: GoogleProfile | GitHubProfile,
//   provider: "google" | "github",
//   done: any,
// ) => {
//   try {
//     // These guards solve the TS(2532) error by checking length > 0
//     const email =
//       profile.emails && profile.emails.length > 0
//         ? profile.emails[0].value
//         : "";

//     const image =
//       profile.photos && profile.photos.length > 0
//         ? profile.photos[0].value
//         : undefined;

//     const user = await findOrCreateUser({
//       email,
//       name: profile.displayName || (profile as any).username || "User",
//       image,
//       provider,
//       providerId: profile.id,
//     });

//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// };

// // 3. GOOGLE STRATEGY
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: env.GOOGLE_CLIENT_ID,
//       clientSecret: env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/auth/google/callback",
//     },
//     (_at: string, _rt: string, profile: GoogleProfile, done: any) => {
//       return handleAuthCallback(profile, "google", done);
//     },
//   ),
// );

// // 4. GITHUB STRATEGY
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: env.GITHUB_CLIENT_ID,
//       clientSecret: env.GITHUB_CLIENT_SECRET,
//       callbackURL: "/api/auth/github/callback",
//     },
//     (_at: string, _rt: string, profile: GitHubProfile, done: any) => {
//       return handleAuthCallback(profile, "github", done);
//     },
//   ),
// );

// export default passport;

// import passport from "passport";

// import { Strategy, Profile } from "passport-google-oauth20";
// import { Strategy, Profile } from "passport-github2";

// import { db } from "../db/index.js";
// import { users } from "../db/schema.js";
// import { eq, and } from "drizzle-orm";
// import { env } from "../env.js";

// interface UserProfile {
//   email: string;
//   name: string;
//   image?: string;
//   provider: "google" | "github";
//   providerId: string;
// }

// async function findOrCreateUser(profileData: UserProfile) {
//   const [existingUser] = await db
//     .select()
//     .from(users)
//     .where(
//       and(
//         eq(users.provider, profileData.provider),
//         eq(users.providerId, profileData.providerId),
//       ),
//     );

//   if (existingUser) return existingUser;

//   const [newUser] = await db
//     .insert(users)
//     .values({
//       email: profileData.email,
//       name: profileData.name,
//       image: profileData.image ?? null,
//       provider: profileData.provider,
//       providerId: profileData.providerId,
//     })
//     .returning();

//   return newUser;
// }

// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const [user] = await db.select().from(users).where(eq(users.id, id));
//     done(null, user ?? null);
//   } catch (err) {
//     done(err, null);
//   }
// });

// const handleAuthCallback = async (
//   profile: GoogleProfile | GitHubProfile,
//   provider: "google" | "github",
//   done: any,
// ) => {
//   try {
//     const email =
//       profile.emails?.[0]?.value ?? `${profile.id}@${provider}.oauth`; // fallback for GitHub

//     const image = profile.photos?.[0]?.value;

//     const name =
//       profile.displayName || (profile as GitHubProfile).username || "User";

//     const user = await findOrCreateUser({
//       email,
//       name,
//       image,
//       provider,
//       providerId: profile.id,
//     });

//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// };

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: env.GOOGLE_CLIENT_ID,
//       clientSecret: env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/auth/google/callback",
//     },
//     (_accessToken, _refreshToken, profile, done) =>
//       handleAuthCallback(profile, "google", done),
//   ),
// );

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: env.GITHUB_CLIENT_ID,
//       clientSecret: env.GITHUB_CLIENT_SECRET,
//       callbackURL: "/api/auth/github/callback",
//     },
//     (
//       _accessToken: any,
//       _refreshToken: any,
//       profile: GitHubProfile,
//       done: any,
//     ) => {
//       return handleAuthCallback(profile, "github", done);
//     },
//   ),
// );

// export default passport;

import passport from "passport";
import googlePkg from "passport-google-oauth20"; // CommonJS default import
import type { Profile } from "passport-google-oauth20"; // Type only
import { env } from "../env.ts";
import { findOrCreateUser } from "./userHelper.ts"; // your reusable function

const GoogleStrategy = googlePkg.Strategy;

const googleAuth = passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value ?? "";
        const image = profile.photos?.[0]?.value;
        const name = profile.displayName ?? "User";

        const user = await findOrCreateUser({
          email,
          name,
          image,
          provider: "google",
          providerId: profile.id,
        });

        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

export default googleAuth;
