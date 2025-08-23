export default {
  providers: [
    {
      domain:process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex", // Must match your Clerk JWT template name
    },
  ],
};
