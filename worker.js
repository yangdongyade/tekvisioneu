export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const country = request.cf?.country || "Unknown";

    // 🚫 拦截来自新加坡、新增香港和中国大陆的请求
    const blockedCountries = ["SG", "HK", "CN"];
    if (blockedCountries.includes(country)) {
      return new Response("Access denied (Geo blocked)", { status: 403 });
    }

    // 🛑 拦截包含关键词的 URL
    const blockedKeywords = [
      "escort",
      "massage",
      "dogging",
      "sex",
      "piger",
      "taletidskort",
      "menukort"
    ];

    const lowerPath = pathname.toLowerCase();
    for (let keyword of blockedKeywords) {
      if (lowerPath.includes(keyword)) {
        return new Response("Blocked due to suspicious content.", { status: 403 });
      }
    }

    // ✅ 正常请求通过
    return new Response("Access granted.", {
      status: 200,
      headers: {
        "content-type": "text/plain"
      }
    });
  }
};
