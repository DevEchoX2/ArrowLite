document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (window.lucide && typeof lucide.createIcons === "function") {
    lucide.createIcons();
  }

  // Default to dark mode
  document.body.setAttribute("data-theme", "dark");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  themeToggleBtn.textContent = "Toggle Light Mode";

  // Game list
  const games = [
    { title: "A dance of fire and ice",  img: "images/ADOFAI.jpeg",  url: "games/ADOFAI.html" },
    { title: "A Dark Room", img: "images/ADarkRoom.png", url: "games/ADarkRoom.html" }
    // Add more games here
  ];

  // DOM references
  const gameGrid      = document.getElementById("gameGrid");
  const overlay       = document.getElementById("gameOverlay");
  const gameFrame     = document.getElementById("gameFrame");
  const searchInput   = document.getElementById("searchInput");

  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const reloadBtn     = document.getElementById("reloadBtn");
  const downloadBtn   = document.getElementById("downloadBtn");
  const blobBtn       = document.getElementById("blobBtn");
  const closeBtn      = document.getElementById("closeBtn");

  const settingsIcon  = document.getElementById("settingsIcon");
  const settingsPopup = document.getElementById("settingsPopup");
  const closeSettings = document.getElementById("closeSettings");
  const blankBtn      = document.getElementById("blankBtn");

  // Render game cards
  function renderGames(filter = "") {
    gameGrid.innerHTML = "";
    games
      .filter(g => g.title.toLowerCase().includes(filter.toLowerCase()))
      .forEach(game => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.innerHTML = `
          <img src="${game.img}" alt="${game.title}" />
          <div class="game-title">${game.title}</div>
        `;
        card.addEventListener("click", () => openGame(game));
        gameGrid.appendChild(card);
      });
  }

  // Search filter
  searchInput.addEventListener("input", e => {
    renderGames(e.target.value || "");
  });

  // Open game overlay
  function openGame(game) {
    gameFrame.src = game.url;
    overlay.classList.add("active");

    // Download original file
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = game.url;
      a.download = `${game.title}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    // Open blob URL in new tab
    blobBtn.onclick = async () => {
      try {
        const res = await fetch(game.url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } catch (err) {
        console.error("Blob open failed:", err);
      }
    };

    // Reload iframe game
    reloadBtn.onclick = () => {
      try {
        if (gameFrame.contentWindow) {
          gameFrame.contentWindow.location.reload();
        } else {
          const current = gameFrame.src;
          gameFrame.src = current;
        }
      } catch {
        const current = gameFrame.src;
        gameFrame.src = current;
      }
    };

    // Fullscreen
    fullscreenBtn.onclick = () => {
      const el = gameFrame;
      const req =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen;
      if (req) req.call(el);
    };
  }

  // Close game overlay
  closeBtn?.addEventListener("click", () => {
    overlay.classList.remove("active");
    gameFrame.src = "";
  });

  // Open settings popup
  settingsIcon.addEventListener("click", () => {
    settingsPopup.classList.add("active");
  });

  // Close settings popup
  closeSettings?.addEventListener("click", () => {
    settingsPopup.classList.remove("active");
  });

  // Theme toggle logic
  themeToggleBtn.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme");
    if (current === "dark") {
      document.body.setAttribute("data-theme", "light");
      themeToggleBtn.textContent = "Toggle Dark Mode";
    } else {
      document.body.setAttribute("data-theme", "dark");
      themeToggleBtn.textContent = "Toggle Light Mode";
    }
  });

  // Tab cloak
  blankBtn?.addEventListener("click", () => {
    window.open("about:blank", "_blank");
  });

  // Initial render
  renderGames();
});
