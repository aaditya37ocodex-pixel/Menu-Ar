/** Temporary deploy stub. Full Better Auth wiring can be restored later. */
export const auth = {
  handler: async (_request: Request) =>
    new Response(JSON.stringify({ error: "Auth is not fully configured on this deploy" }), {
      status: 501,
      headers: { "content-type": "application/json" },
    }),
};
