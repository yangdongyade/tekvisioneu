export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const country = request.cf?.country || "Unknown";
    const blockedCountries = ["SG", "CN", "HK"];
    const blockedKeywords = ["escort", "massage", "dogging", "sex", "piger", "taletidskort", "menukort"];

    // 🌐 重定向根域名到 www
    if (url.hostname === "tekvision.eu") {
      url.hostname = "www.tekvision.eu";
      return Response.redirect(url.toString(), 301);
    }

    // 🚫 屏蔽国家
    if (blockedCountries.includes(country)) {
      return new Response("Access denied (Geo blocked)", { status: 403 });
    }

    // 🚫 拦截关键词路径
    const lowerPath = url.pathname.toLowerCase();
    if (blockedKeywords.some(keyword => lowerPath.includes(keyword))) {
      return new Response("Blocked due to suspicious content.", { status: 403 });
    }

    // ✅ 正常通过，继续访问 Shopify 页面
    return fetch(request);
  }
};
