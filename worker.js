export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const country = request.cf?.country || "Unknown";

    // 需要重定向的主域名跳转到 www
    if (url.hostname === "tekvision.eu") {
      url.hostname = "www.tekvision.eu";
      return Response.redirect(url.toString(), 301);
    }

    // 屏蔽国家
    const blockedCountries = ["CN", "SG", "HK"];
    if (blockedCountries.includes(country)) {
      return new Response("Access denied (Geo blocked)", { status: 403 });
    }

    // 屏蔽关键词路径
    const blockedKeywords = [
      "escort", "massage", "dogging", "sex", "piger", "taletidskort", "menukort"
    ];
    const lowerPath = url.pathname.toLowerCase();
    if (blockedKeywords.some(keyword => lowerPath.includes(keyword))) {
      return new Response("Blocked due to suspicious content.", { status: 403 });
    }

    // 正常放行
    return fetch(request);
  }
}
