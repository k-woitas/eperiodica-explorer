export default {
  async fetch(request) {
    const target = new URL(request.url).searchParams.get("url");
    // nur e-periodica und die e-periodica-Bilder der ETH-Bibliothek weiterleiten – verhindert Missbrauch als offener Proxy
    if (!target || !/^https:\/\/(www\.e-periodica\.ch\/|iiif\.library\.ethz\.ch\/iiif\/2\/e-periodica!)/.test(target)) {
      return new Response("Nur e-periodica erlaubt", { status: 403 });
    }
    const r = await fetch(target, { headers: { "User-Agent": "eperiodica-proxy" } });
    const headers = new Headers(r.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    return new Response(r.body, { status: r.status, headers });
  },
};
