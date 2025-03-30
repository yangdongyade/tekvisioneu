export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const country = request.cf?.country || "Unknown";

    // ❌ 屏蔽的国家列表
    const blockedCountries = ["SG", "CN", "HK"];

    // ❌ 屏蔽的关键词列表（路径中包含时拦截）
    const blockedKeywords = [
      "sex", "escort", "massage", "dogging", "piger", "taletidskort", "menukort"
    ];

    // ✅ 强制重定向 tekvision.eu 到 www.tekvision.eu
    if (url.hostname === "tekvision.eu") {
      url.hostname = "www.tekvision.eu";
      return Response.redirect(url.toString(), 301);
    }

    // ❌ 屏蔽来自指定国家
    if (blockedCountries.includes(country)) {
      return new Response("Access denied (Geo blocked)", { status: 403 });
    }

    // ❌ 屏蔽路径中包含关键词
    const lowerPath = url.pathname.toLowerCase();
    if (blockedKeywords.some(keyword => lowerPath.includes(keyword))) {
      return new Response("Blocked due to suspicious content.", { status: 403 });
    }

    // ✅ 正常请求，继续访问 Shopify 页面
    return fetch(request);
  }
};
