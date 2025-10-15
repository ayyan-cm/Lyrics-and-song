// Minimal static app.js
(function () {
  const editor = document.getElementById("editor");
  const runBtn = document.getElementById("run");
  const langSelect = document.getElementById("lang");
  const message = document.getElementById("message");
  const spotifyContainer = document.getElementById("spotify-container");
  const lyricsBox = document.getElementById("lyrics-box");
  const lyricsPre = document.getElementById("lyrics");

  // Hardcoded Spotify track and sample lyrics (only short excerpt to avoid copyright issues)
  const SPOTIFY_TRACK_URI =
    "https://open.spotify.com/embed/track/32E2AGkk15IU9JMZUGs7Ih";
  const LYRICS_EXCERPT = `
...
...
...
...
U can call me a raja
Cause i am king of the whole world
U can call me a raja
Naan yaar yaar

I am a villain not a hero
I am a ten not a zero
I am the only one
That’s ready for a fight
And i will kill

Tell me if you are ready or not
Lets start cause

I am about to
Take it to the top like what!`;

  function normalizeCode(text) {
    return text.replace(/\r\n/g, "\n").trim();
  }

  function detectPlaySnippet(code) {
    // Very simple pattern detection for variants like:
    // def play_music():\n    //    play(who_i_am_trust)
    const norm = code.replace(/\s+/g, "");
    return (
      /defplay_music\(|play\(who_i_am(_trust)?\)/i.test(norm) ||
      /play_music\(\)/i.test(norm)
    );
  }

  function showMessage(txt) {
    message.textContent = txt;
  }

  function showSpotifyEmbed() {
    spotifyContainer.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "152";
    iframe.allow = "encrypted-media";
    // try to hint autoplay: allow="encrypted-media" and include autoplay param where supported
    iframe.src = SPOTIFY_TRACK_URI + "?utm_source=generator&autoplay=1";
    iframe.style.border = "none";
    spotifyContainer.appendChild(iframe);
  }

  function showLyrics() {
    lyricsPre.textContent = LYRICS_EXCERPT;
    // restart animation by toggling the class
    lyricsPre.classList.remove("scrolling");
    requestAnimationFrame(() => lyricsPre.classList.add("scrolling"));
    if (lyricsBox) lyricsBox.classList.remove("hidden");
    const win = lyricsBox && lyricsBox.querySelector(".lyrics-window");
    if (win) win.scrollTop = 0;
    // start JS smooth scroll after a short delay to mimic playback start
    cancelSmoothScroll();
    setTimeout(() => startSmoothScroll(25000), 500);
  }

  // Smooth scroll implementation (JS-driven) with pause/resume on hover
  let scrollState = {
    raf: null,
    startTime: null,
    duration: 5000,
    paused: false,
    pauseAt: 0,
  };

  function startSmoothScroll(duration = 30000) {
    const win = lyricsBox && lyricsBox.querySelector(".lyrics-window");
    if (!win) return;
    cancelSmoothScroll();
    const maxScroll = win.scrollHeight - win.clientHeight;
    if (maxScroll <= 0) return; // nothing to scroll
    scrollState.duration = duration;
    scrollState.startTime = performance.now();
    scrollState.paused = false;
    scrollState.pauseAt = 0;

    function step(now) {
      if (scrollState.paused) {
        scrollState.raf = requestAnimationFrame(step);
        return;
      }
      const elapsed = now - scrollState.startTime - scrollState.pauseAt;
      const t = Math.min(1, elapsed / scrollState.duration);
      win.scrollTop = Math.floor(t * maxScroll);
      if (t < 1) scrollState.raf = requestAnimationFrame(step);
      else scrollState.raf = null;
    }

    scrollState.raf = requestAnimationFrame(step);
  }

  function cancelSmoothScroll() {
    if (scrollState.raf) cancelAnimationFrame(scrollState.raf);
    scrollState.raf = null;
  }

  function pauseSmoothScroll() {
    if (!scrollState.raf || scrollState.paused) return;
    scrollState.paused = true;
    // record elapsed time so far
    scrollState.pauseStart = performance.now();
  }

  function resumeSmoothScroll() {
    if (!scrollState.paused) return;
    scrollState.paused = false;
    // account for paused duration
    scrollState.pauseAt += performance.now() - (scrollState.pauseStart || 0);
  }

  // Attach pointerenter/pointerleave directly to lyrics window to pause/resume scrolling
  function attachLyricsHover() {
    const win = lyricsBox && lyricsBox.querySelector(".lyrics-window");
    if (!win) return;
    win.addEventListener("pointerenter", () => pauseSmoothScroll());
    win.addEventListener("pointerleave", () => resumeSmoothScroll());
  }

  // Ensure hover handlers are attached when lyrics are shown
  const originalShowLyrics = showLyrics;
  showLyrics = function () {
    originalShowLyrics();
    attachLyricsHover();
  };

  runBtn.addEventListener("click", () => {
    // ensure editor has some default content
    if (!editor.textContent.trim())
      editor.textContent = "def play_music():\n    play(who_i_am_trust)";
    const code = normalizeCode(editor.innerText || editor.textContent || "");
    if (typeof showMessage === "function") showMessage("Running...");

    // small delay to simulate execution
    setTimeout(() => {
      if (detectPlaySnippet(code)) {
        showMessage(
          "Play snippet detected — opening Spotify embed and showing lyrics."
        );
        showSpotifyEmbed();
        // try autoplay: browsers block autoplay unless user gesture; this is triggered by click so should allow play in the iframe
        showLyrics();
      } else {
        showMessage(
          "No recognized play snippet found. Try `def play_music():\n    play(who_i_am)`"
        );
      }
    }, 300);
  });

  // Allow pressing Ctrl+Enter to run
  editor.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runBtn.click();
    }
  });

  // language selector currently only affects placeholder styling
  langSelect.addEventListener("change", () => {
    // For demo: change placeholder text
    if (langSelect.value === "python") {
      editor.textContent = `def play_music():\n    play(who_i_am)`;
    } else {
      editor.textContent = `function play_music(){\n  play(who_i_am);\n}`;
    }
  });

  // Initialize
  editor.setAttribute("role", "textbox");
  editor.setAttribute("aria-multiline", "true");
  showMessage("Ready — press Run or Ctrl+Enter.");
})();
