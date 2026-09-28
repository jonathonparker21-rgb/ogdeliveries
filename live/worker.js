import { locateAddress } from "./quote.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/quote") {
      const address = url.searchParams.get("address") || "";
      try {
        const result = await locateAddress(address);
        return Response.json(result, {
          headers: { "cache-control": result.ok ? "public, max-age=600" : "no-store" },
        });
      } catch {
        return Response.json(
          { ok: false, message: "Couldn’t check miles. We’ll confirm before we roll." },
          { status: 200, headers: { "cache-control": "no-store" } },
        );
      }
    }
    return env.ASSETS.fetch(request);
  },
};
