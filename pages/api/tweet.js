import { createCanvas, loadImage } from "canvas";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Hanya POST yang diizinkan" });
  }

  try {
    const { profile, name, username, tweet, retweets, likes } = req.body;

    // Buat canvas
    const width = 600;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background putih
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);

    // Nama
    ctx.fillStyle = "#000";
    ctx.font = "bold 20px Arial";
    ctx.fillText(name || "User", 80, 40);

    // Username
    ctx.fillStyle = "#555";
    ctx.font = "16px Arial";
    ctx.fillText("@" + (username || "username"), 80, 65);

    // Tweet
    ctx.fillStyle = "#000";
    ctx.font = "18px Arial";
    ctx.fillText(tweet || "Contoh tweet...", 40, 120);

    // Retweets & Likes
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    ctx.fillText(`🔁 ${retweets || 0}   ❤️ ${likes || 0}`, 40, 260);

    // Kalau ada foto profil, load
    if (profile) {
      try {
        const img = await loadImage(profile);
        ctx.drawImage(img, 20, 20, 50, 50);
      } catch (err) {
        console.log("Gagal load foto profil:", err.message);
      }
    }

    // Balikin hasil PNG
    res.setHeader("Content-Type", "image/png");
    canvas.pngStream().pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal generate tweet" });
  }
}
