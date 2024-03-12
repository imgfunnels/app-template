import { logger } from "@/helpers/Logger/winston";
import { Provider } from "next-auth/providers/index";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    {
      id: "imgfunnels",
      name: "IMG Funnels",
      type: "oauth",
      issuer: "https://oauth.imgfunnels.com",
      wellKnown: `https://oauth.imgfunnels.com/.well-known/oauth-authorization-file`,
      clientId: process.env.IMG_CLIENT_ID,
      clientSecret: process.env.IMG_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      idToken: false,
      checks: [],
      profile: (profile: any, tokens: any) => {
        logger.info("OAUTH PROFILE", { args: { profile, tokens } });
        if (
          profile?.profile?.email &&
          profile?.user?.email &&
          profile.profile.email !== profile.user.email
        ) {
          // One-time fix?
          logger.error("User/Profile email address mismatch.", {
            args: { profile, tokens }
          });
          throw new Error("User/Profile email address mismatch.");
        }
        return profile;
      }
    } satisfies Provider
  ]
};
