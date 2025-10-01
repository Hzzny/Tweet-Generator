    // stars
    const starContainer = document.getElementById("stars");
    for (let i = 0; i < 35; i++) {
      const s = document.createElement("div");
      s.className = "star";
      s.style.left = Math.random() * 100 + "vw";
      s.style.top = Math.random() * 100 + "vh";
      s.style.animationDuration = (3 + Math.random() * 4) + "s";
      starContainer.appendChild(s);
    }

    const form = document.getElementById("form");
    const result = document.getElementById("result");
    const resetBtn = document.getElementById("resetBtn");

    const showLoading = () => result.innerHTML = '<div class="loading"></div>';
    const showError = msg => result.innerHTML = `<div style="color:#ff6b6b; font-size: 14px;">${msg}</div>`;

    resetBtn.onclick = () => { form.reset(); result.innerHTML = ""; };

    form.onsubmit = async e => {
      e.preventDefault();
      const profile = document.getElementById("profile").value.trim();
      const name = document.getElementById("name").value.trim();
      let username = document.getElementById("username").value.trim();
      const tweet = document.getElementById("tweet").value.trim();
      const retweets = document.getElementById("retweets").value;
      const likes = document.getElementById("likes").value;

      if (!name || !username || !tweet) { showError("Harap isi semua kolom"); return; }
      if (username.startsWith("@")) username = username.slice(1);

      showLoading();
      try {
        // Mengubah URL fetch ke endpoint Vercel lokal
        const res = await fetch("/api/tweet", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({
            profile: profile || null, name, username, tweet,
            retweets: Number(retweets), likes: Number(likes),
          })
        });

        if (!res.ok) {
            const errorData = await res.json();
            showError("Gagal generate: " + errorData.error);
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        result.innerHTML = `
          <img src="${url}" alt="hasil"/>
          <a class="download" href="${url}" download="tweet_${Date.now()}.png">Download</a>
        `;
        result.querySelector(".download").onclick = () => setTimeout(() => location.reload(), 800);
      } catch (err) { showError("Error jaringan: " + err.message); }
    }
  