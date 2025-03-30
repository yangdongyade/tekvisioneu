export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const country = request.cf?.country || "Unknown";

    const blockedKeywords = [
      "escort", "massage", "dogging", "sex", "piger", "taletidskort", "menukort"
    ];

    // 拦截特定国家
    const blockedCountries = ["SG", "CN", "HK"];
    if (blockedCountries.includes(country)) {
      return new Response("Access denied (Geo blocked)", { status: 403 });
    }

    // 拦截关键词
    const lowerPath = pathname.toLowerCase();
    if (blockedKeywords.some(keyword => lowerPath.includes(keyword))) {
      return new Response("Blocked due to suspicious content.", { status: 403 });
    }

    // ✅ 其他请求转发回源站（Shopify）
    return fetch(request);
  }
};
