export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const country = request.cf?.country || "Unknown";

    // 被拦截的国家列表
    const blockedCountries = ["SG", "CN", "HK"];

    // 被拦截的关键词
    const blockedKeywords = [
      "escort", "massage", "dogging", "sex", "piger", "taletidskort", "menukort"
    ];

    // 🚫 拦截来自指定国家
    if (blockedCountries.includes(country)) {
      return new Response("Access denied (Geo blocked)", { status: 403 });
    }

    // 🚫 拦截包含非法关键词的路径
    const lowerPath = pathname.toLowerCase();
    if (blockedKeywords.some(keyword => lowerPath.includes(keyword))) {
      return new Response("Blocked due to suspicious content.", { status: 403 });
    }

    // ✅ 所有其他请求，转发给 Shopify
    return fetch(request);
  }
};
