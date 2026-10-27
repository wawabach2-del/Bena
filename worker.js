// Cloudflare Worker: proxy aman untuk Gemini API.
// Tambahkan GEMINI_API_KEY sebagai Secret di pengaturan Worker. Jangan masukkan API key ke index.html.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Setelah hosting, batasi ke domain aplikasi Anda.
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (url.pathname !== "/api/generate" || request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Gunakan POST /api/generate." }), { status: 404, headers: corsHeaders });
    }
    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Secret GEMINI_API_KEY belum dipasang di Worker." }), { status: 500, headers: corsHeaders });
    }
    try {
      const body = await request.json();
      const product = String(body.product || "").slice(0, 160);
      if (!product.trim()) return new Response(JSON.stringify({ error: "Nama produk wajib diisi." }), { status: 400, headers: corsHeaders });
      const safe = v => String(v || "").slice(0, 700);
      const prompt = `Kamu adalah copywriter e-commerce berbahasa Indonesia. Buat konten jualan yang menarik, natural, tidak berlebihan, tidak menjamin hasil, dan tidak membuat klaim yang tidak diberikan pengguna. Jangan mengarang sertifikasi, testimoni, diskon, stok, atau manfaat.
Produk: ${product}
Keunggulan yang diberikan pengguna: ${safe(body.benefits) || "Belum disebutkan"}
Target pembeli: ${safe(body.target) || "Pembeli online"}
Platform: ${safe(body.platform)}
Gaya bahasa: ${safe(body.style)}
Harga: ${safe(body.price) || "Tidak dicantumkan"}
Promo: ${safe(body.promo) || "Tidak ada"}
Jenis konten: ${safe(body.type)}
Buat hasil siap salin dengan hook yang kuat, isi yang relevan, CTA yang sesuai platform, dan hashtag bila cocok. Untuk jenis "thread", buat 4 bagian berurutan. Untuk "video", buat skrip sekitar 15 detik. Jangan jelaskan prosesmu.`;
      const model = "gemini-2.5-flash";
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.85, maxOutputTokens: 1200 }
        })
      });
      const data = await response.json();
      if (!response.ok) {
        return new Response(JSON.stringify({ error: data.error?.message || "Permintaan AI gagal." }), { status: 502, headers: corsHeaders });
      }
      const text = data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
      if (!text) return new Response(JSON.stringify({ error: "AI tidak mengembalikan teks. Coba lagi." }), { status: 502, headers: corsHeaders });
      return new Response(JSON.stringify({ text }), { headers: corsHeaders });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Permintaan tidak valid atau koneksi bermasalah." }), { status: 400, headers: corsHeaders });
    }
  }
};
