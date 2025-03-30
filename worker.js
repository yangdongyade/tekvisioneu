export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const country = request.cf?.country || "Unknown";

    // ✅ Worker 测试路径，验证是否运行
    if (url.pathname === "/test") {
      return new Response("Worker works normal", {
        status: 200,
        headers: {
          "Content-Type": "text/plain"
        }
      });
    }

    const blockedCountries = ["SG", "CN", "HK"];
    const blockedKeywords = [
      "escort", "massage", "dogging", "sex", "piger",
      "taletidskort", "menukort", "sex-toy"
    ];

    // 👉 强制裸域名跳转到 www（使用 302 防止缓存）
    if (url.hostname === "tekvision.eu") {
      url.hostname = "www.tekvision.eu";
      return Response.redirect(url.toString(), 302);
    }

    // ❌ 屏蔽特定国家
    if (blockedCountries.includes(country)) {
      return new Response("Access denied (Geo blocked)", { status: 403 });
    }

    // ❌ 屏蔽关键词路径
    const lowerPath = url.pathname.toLowerCase();
    if (blockedKeywords.some(k => lowerPath.includes(k))) {
      return new Response("Blocked due to suspicious content.", { status: 403 });
    }

    // ✅ 正常请求转发
    return fetch(request);
  }
};
