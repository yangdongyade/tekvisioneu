export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const country = request.cf?.country || "Unknown";
    
    // ⛔️ 被屏蔽的国家
    const blockedCountries = ["SG", "CN", "HK"];

    // ⛔️ 被屏蔽关键词
    const blockedKeywords = [
      "escort", "massage", "dogging", "sex", "piger", "taletidskort", "menukort", "toy"
    ];

    // 1. 强制加 www（301 重定向）
    if (url.hostname === "tekvision.eu") {
      url.hostname = "www.tekvision.eu";
      return Response.redirect(url.toString(), 301);
    }

    // 2. 国家封锁
    if (blockedCountries.includes(country)) {
      return new Response("Access denied (Geo blocked)", { status: 403 });
    }

    // 3. 路径中含敏感词
    const lowerPath = url.pathname.toLowerCase();
    if (blockedKeywords.some(keyword => lowerPath.includes(keyword))) {
      return new Response("Blocked due to suspicious content.", { status: 403 });
    }

    // ✅ 4. 正常请求，跳转到 Shopify
    url.hostname = "9acba8.myshopify.com";
    return fetch(url.toString(), request);
  }
};
