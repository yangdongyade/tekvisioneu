export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const country = request.cf?.country || "Unknown";

    const blockedCountries = ["SG", "CN", "HK"];
    const blockedKeywords = [
      "escort", "massage", "dogging", "sex", "piger", "taletidskort", "menukort", "toy"
    ];

    // ✅ 只在访问 naked domain 时才跳转
    if (
      url.hostname === "tekvision.eu" &&
      !url.hostname.startsWith("www.")
    ) {
      url.hostname = "www.tekvision.eu";
      return Response.redirect(url.toString(), 301);
    }

    // ⛔️ 拦截国家
    if (blockedCountries.includes(country)) {
      return new Response("Access denied (Geo blocked)", { status: 403 });
    }

    // ⛔️ 拦截关键词
    const lowerPath = url.pathname.toLowerCase();
    if (blockedKeywords.some(keyword => lowerPath.includes(keyword))) {
      return new Response("Blocked due to suspicious content.", { status: 403 });
    }

    // ✅ 跳转到 Shopify
    url.hostname = "9acba8.myshopify.com";
    return fetch(url.toString(), request);
  }
};
