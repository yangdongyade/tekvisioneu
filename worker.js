export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const country = request.cf?.country || "Unknown";
    const lowerPath = url.pathname.toLowerCase();

    const blockedCountries = ["SG", "CN", "HK"];
    const blockedKeywords = [
      "escort", "massage", "dogging", "sex", "piger",
      "taletidskort", "menukort", "sex-toy"
    ];

    // ⛔ 屏蔽关键词路径（放前面，避免被跳转绕过）
    if (blockedKeywords.some(k => lowerPath.includes(k))) {
      return new Response("Blocked due to suspicious content.", { status: 403 });
    }

    // ⛔ 屏蔽国家
    if (blockedCountries.includes(country)) {
      return new Response("Access denied (Geo blocked)", { status: 403 });
    }

    // 🔁 裸域跳转到 www
    if (url.hostname === "tekvision.eu") {
      url.hostname = "www.tekvision.eu";
      return Response.redirect(url.toString(), 301); // 改为永久跳转
    }

    // ✅ 正常请求
    return fetch(request);
  }
};
