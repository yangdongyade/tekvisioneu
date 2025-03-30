export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const country = request.cf?.country || "Unknown";

    const blockedCountries = ["SG", "CN", "HK"];
    const blockedKeywords = [
      "escort", "massage", "dogging", "sex", "piger", 
      "taletidskort", "menukort", "sex-toy"
    ];

    // 👉 根域名跳转到 www
    if (url.hostname === "tekvision.eu") {
      url.hostname = "www.tekvision.eu";
      return Response.redirect(url.toString(), 301);
    }

    // ❌ 屏蔽国家
    if (blockedCountries.includes(country)) {
      return new Response("Access denied (Geo blocked)", { status: 403 });
    }

    // ❌ 屏蔽关键词路径
    const lowerPath = url.pathname.toLowerCase();
    if (blockedKeywords.some(k => lowerPath.includes(k))) {
      return new Response("Blocked due to suspicious content.", { status: 403 });
    }

    // ✅ 正常访问
    return fetch(request);
  }
}
