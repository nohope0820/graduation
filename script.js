/* =========================================================
   Graduation Invitation — Trần Thị Hiền Dịu
   Edit CONFIG and guests below; no HTML changes needed.
   ========================================================= */

const CONFIG = {
    graduateName: "Hiền Dịu",

    // Vietnam time (+07:00) so the countdown is correct for guests anywhere
    graduationDate: "2026-10-15T08:30:00+07:00",

    venueName: "Trường Đại học Kinh doanh và Công nghệ Hà Nội",
    venueAddress: "29A Ngõ 124 Phố Vĩnh Tuy, Vĩnh Hưng, Hà Nội",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent("Trường Đại học Kinh doanh và Công nghệ Hà Nội, 29A Ngõ 124 Vĩnh Tuy, Hà Nội"),

    music: "music/22.mp3",
    musicStart: 10, // seconds — music starts (and loops back) here

    // Used when ?p= is missing, not in the guest list, or the guest has no photo
    defaultGuest: "Bạn",
    defaultPhoto: "images/default.jpeg",

    // Gallery photos (paths relative to index.html).
    // Leave empty to hide the gallery, e.g. ["images/gallery-1.jpg", "images/gallery-2.jpg"]
    gallery: []
};

// Guest list: URL code → name + photo shown on the invitation.
// Example link: https://your-site.vercel.app/?p=ha-linh
// `photo` is optional — leave it out to use CONFIG.defaultPhoto.
// `frame: "rounded"` shows the whole photo with softly rounded corners instead of the arch.
// `oneLine: true` keeps a long name on one line by shrinking its font to fit the screen.
const guests = {
    "bon-li-va-em-trang":     { name: "Bôn lì và em Trang",       photo: "images/bon-li-va-em-trang.jpeg" },
    "ha-linh":                { name: "Bạn Hà Linh",              photo: "images/ha-linh.jpeg" },
    "thanh-nga":              { name: "Bạn Thanh Nga",            photo: "images/thanh-nga.jpeg" },
    "bay-bi-chi-cua-anh-loi": { name: "Bây bi chi của anh Lợi",   photo: "images/bay-bi-chi-cua-anh-loi.jpeg" },
    "du-bac-bling":           { name: "Du Bắc Bling",             photo: "images/du-bac-bling.jpeg" },
    "gia-dinh":               { name: "Gia đình",                 photo: "images/gia-dinh.jpeg", frame: "rounded" },
    "me-con-lvy":             { name: "2 mẹ con Ivy",             photo: "images/me-con-lvy.jpeg" },
    "angela-phuong-trinh":    { name: "Bạn “Angela Phương Trinh”", photo: "images/ban-trinh.jpeg", oneLine: true },
    "em-huyen":               { name: "Em Huyền" },
    "em-nhi":                 { name: "Em Nhi" }
};

/* ========================================================= */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (selector) => document.querySelector(selector);

/* ---------- Personalized guest ---------- */

function getGuest() {
    const params = new URLSearchParams(window.location.search);
    const code = (params.get("p") || "").trim().toLowerCase();

    // hasOwnProperty guards against codes like "constructor" or "toString"
    const known = code !== "" && Object.prototype.hasOwnProperty.call(guests, code);

    const entry = known ? guests[code] : {};

    return {
        known,
        name: entry.name || CONFIG.defaultGuest,
        photo: entry.photo || CONFIG.defaultPhoto,
        frame: entry.frame || "arch",
        oneLine: entry.oneLine === true
    };
}

// Shrink the guest name's font just enough to fit on one line
function fitOneLine(el) {
    el.style.fontSize = "";
    const available = el.clientWidth;
    const needed = el.scrollWidth;
    if (needed > available) {
        const size = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${Math.floor(size * (available / needed) * 0.97)}px`;
    }
}

function applyGuest(guest) {
    const nameEl = $("#guest-name");
    nameEl.textContent = guest.name;

    if (guest.oneLine) {
        nameEl.classList.add("invite__guest--one-line");
        const fit = () => fitOneLine(nameEl);
        fit();
        // Refit once the web font has loaded and whenever the screen size changes
        if (document.fonts) document.fonts.ready.then(fit);
        window.addEventListener("resize", fit);
    }

    // Guest photo in the arch; fall back to the default photo if it fails to load
    const photo = $("#hero-photo");
    photo.addEventListener("error", () => {
        if (!photo.src.endsWith(CONFIG.defaultPhoto)) photo.src = CONFIG.defaultPhoto;
    });
    photo.src = guest.photo;
    photo.closest(".arch").classList.toggle("arch--rounded", guest.frame === "rounded");

    if (guest.known) {
        document.title = `Trân trọng kính mời ${guest.name} | Graduation 2026`;

        const coverGuest = $("#cover-guest");
        coverGuest.textContent = `Gửi đến ${guest.name}`;
        coverGuest.hidden = false;
    } else {
        document.title = `Graduation Invitation | ${CONFIG.graduateName}`;
    }
}

/* ---------- Venue ---------- */

function applyVenue() {
    $("#venue-name").textContent = CONFIG.venueName;
    $("#venue-address").textContent = CONFIG.venueAddress;
    $("#map-btn").href = CONFIG.mapUrl;
}

/* ---------- Countdown ---------- */

function startCountdown() {
    const target = new Date(CONFIG.graduationDate).getTime();
    const grid = $("#countdown-grid");
    const done = $("#countdown-done");
    const els = {
        days: $("#cd-days"),
        hours: $("#cd-hours"),
        minutes: $("#cd-minutes"),
        seconds: $("#cd-seconds")
    };

    if (Number.isNaN(target)) {
        grid.hidden = true;
        return;
    }

    const pad = (n) => String(n).padStart(2, "0");
    let timer = null;

    function tick() {
        const diff = target - Date.now();

        if (diff <= 0) {
            grid.hidden = true;
            done.hidden = false;
            clearInterval(timer);
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        els.days.textContent = pad(Math.floor(totalSeconds / 86400));
        els.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
        els.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
        els.seconds.textContent = pad(totalSeconds % 60);
    }

    tick();
    timer = setInterval(tick, 1000);
}

/* ---------- Gallery ---------- */

function buildGallery() {
    const grid = $("#gallery-grid");

    if (CONFIG.gallery.length === 0) return;
    $("#gallery").hidden = false;

    CONFIG.gallery.forEach((src, index) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "gallery__item" + (index % 3 === 0 ? " gallery__item--wide" : "");
        item.dataset.index = index;
        item.dataset.reveal = "image";
        item.style.setProperty("--delay", `${(index % 3) * 0.1}s`);
        item.setAttribute("aria-label", `Xem ảnh ${index + 1}`);

        const img = document.createElement("img");
        img.src = src;
        img.alt = `Kỷ niệm ${index + 1}`;
        img.loading = "lazy";
        img.decoding = "async";
        img.addEventListener("error", () => item.classList.add("is-missing"));

        item.appendChild(img);
        item.addEventListener("click", () => Lightbox.open(index, item));
        grid.appendChild(item);
    });
}

/* ---------- Lightbox ---------- */

const Lightbox = (() => {
    const box = $("#lightbox");
    const img = $("#lightbox-img");
    const counter = $("#lightbox-counter");
    const closeBtn = box.querySelector(".lightbox__close");
    const prevBtn = box.querySelector(".lightbox__prev");
    const nextBtn = box.querySelector(".lightbox__next");
    const total = CONFIG.gallery.length;

    let current = 0;
    let trigger = null;
    let touchStartX = 0;

    function show(index) {
        current = (index + total) % total;
        img.classList.remove("is-loaded");
        img.src = CONFIG.gallery[current];
        img.alt = `Kỷ niệm ${current + 1}`;
        counter.textContent = `${current + 1} / ${total}`;
    }

    function open(index, triggerEl) {
        trigger = triggerEl;
        prevBtn.hidden = nextBtn.hidden = total < 2;
        show(index);
        box.hidden = false;
        document.body.classList.add("is-locked");
        requestAnimationFrame(() => box.classList.add("is-open"));
        closeBtn.focus({ preventScroll: true });
    }

    function close() {
        box.classList.remove("is-open");
        document.body.classList.remove("is-locked");
        setTimeout(() => {
            box.hidden = true;
            img.removeAttribute("src");
        }, prefersReducedMotion ? 0 : 400);
        if (trigger) trigger.focus({ preventScroll: true });
    }

    img.addEventListener("load", () => img.classList.add("is-loaded"));

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(current - 1));
    nextBtn.addEventListener("click", () => show(current + 1));

    // Click on the dark backdrop closes
    box.addEventListener("click", (e) => {
        if (e.target === box || e.target.classList.contains("lightbox__figure")) close();
    });

    document.addEventListener("keydown", (e) => {
        if (box.hidden) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(current - 1);
        if (e.key === "ArrowRight") show(current + 1);
    });

    // Swipe left/right on touch devices
    box.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    box.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50 && total > 1) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });

    return { open };
})();

/* ---------- Background music ---------- */

const Music = (() => {
    const audio = $("#bg-music");
    const btn = $("#music-btn");
    const hint = $("#music-hint");
    const start = CONFIG.musicStart || 0;
    const gestures = ["click", "touchend", "keydown"];
    let userPaused = false;        // the guest turned music off with the ♫ button
    let gestureListening = false;  // still waiting for the first interaction
    let resumeOnVisible = false;

    function setPlayingUI(playing) {
        btn.classList.toggle("is-playing", playing);
        btn.setAttribute("aria-pressed", String(playing));
        btn.setAttribute("aria-label", playing ? "Tắt nhạc nền" : "Bật nhạc nền");
    }

    function play() {
        // #t= media fragment makes the browser start at `start` seconds
        if (!audio.src) audio.src = start ? `${CONFIG.music}#t=${start}` : CONFIG.music;
        // play() returns a promise that rejects if the browser blocks playback
        const attempt = audio.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(() => {
                setPlayingUI(false);
                // Autoplay blocked → nudge the guest (only before any interaction)
                if (!userPaused && gestureListening) hint.hidden = false;
            });
        }
    }

    // Browsers block sound until the first user interaction,
    // so retry on the first tap/click/key anywhere on the page.
    function onFirstGesture(e) {
        if (btn.contains(e.target)) return; // the ♫ button handles itself
        removeGestureListeners();
        if (!userPaused && audio.paused) play();
    }

    function removeGestureListeners() {
        gestureListening = false;
        gestures.forEach((type) => document.removeEventListener(type, onFirstGesture, true));
    }

    btn.addEventListener("click", () => {
        removeGestureListeners();
        hint.hidden = true;
        userPaused = !audio.paused;
        if (audio.paused) play();
        else audio.pause();
    });

    // Fallback for browsers that ignore #t=
    audio.addEventListener("loadedmetadata", () => {
        if (audio.currentTime < start) audio.currentTime = start;
    }, { once: true });

    // Loop back to `start` instead of 0 to skip the intro
    audio.addEventListener("ended", () => {
        audio.currentTime = start;
        play();
    });

    audio.addEventListener("play", () => {
        removeGestureListeners();
        hint.hidden = true;
        setPlayingUI(true);
    });
    audio.addEventListener("pause", () => setPlayingUI(false));

    // File missing or unsupported → hide the button quietly
    audio.addEventListener("error", () => {
        removeGestureListeners();
        hint.hidden = true;
        setPlayingUI(false);
        btn.hidden = true;
    });

    // Pause when the tab/app goes to background, resume when back
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            resumeOnVisible = !audio.paused;
            audio.pause();
        } else if (resumeOnVisible) {
            play();
        }
    });

    return {
        // Called on page load: show the button and try to autoplay
        init() {
            btn.hidden = false;
            gestureListening = true;
            gestures.forEach((type) => document.addEventListener(type, onFirstGesture, true));
            play();
        },
        // Called when the card is opened (a user gesture, so play is allowed)
        ensurePlaying() {
            if (!userPaused && audio.paused) play();
        }
    };
})();

/* ---------- Scroll reveal ---------- */

function startReveal() {
    const targets = document.querySelectorAll("#invitation [data-reveal]");

    if (!("IntersectionObserver" in window)) {
        targets.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });

    targets.forEach((el) => observer.observe(el));
}

/* ---------- Canvas helper ---------- */

function setupCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    const size = { w: 0, h: 0 };

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        size.w = window.innerWidth;
        size.h = window.innerHeight;
        canvas.width = size.w * dpr;
        canvas.height = size.h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);
    return { ctx, size };
}

/* ---------- Floating gold dust & sparkles ---------- */

function startParticles() {
    if (prefersReducedMotion) return;

    const { ctx, size } = setupCanvas($("#particles"));
    const count = Math.round(Math.min(38, Math.max(16, (size.w * size.h) / 22000)));
    const rand = (min, max) => min + Math.random() * (max - min);

    const makeParticle = (initial) => ({
        x: rand(0, size.w),
        y: initial ? rand(0, size.h) : size.h + 10,
        r: rand(0.6, 1.9),
        vy: rand(0.12, 0.38),
        drift: rand(0, Math.PI * 2),
        twinkle: rand(0, Math.PI * 2),
        sparkle: Math.random() < 0.18
    });

    const particles = Array.from({ length: count }, () => makeParticle(true));

    function drawSparkle(x, y, r, alpha) {
        const s = r * 3.2;
        ctx.fillStyle = `rgba(236, 210, 150, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, y - s);
        ctx.quadraticCurveTo(x, y, x + s, y);
        ctx.quadraticCurveTo(x, y, x, y + s);
        ctx.quadraticCurveTo(x, y, x - s, y);
        ctx.quadraticCurveTo(x, y, x, y - s);
        ctx.fill();
    }

    function frame() {
        if (!document.hidden) {
            ctx.clearRect(0, 0, size.w, size.h);

            particles.forEach((p, i) => {
                p.y -= p.vy;
                p.drift += 0.008;
                p.twinkle += 0.03;
                p.x += Math.sin(p.drift) * 0.25;

                if (p.y < -10) particles[i] = makeParticle(false);

                const alpha = 0.25 + Math.sin(p.twinkle) * 0.2;
                if (p.sparkle) {
                    drawSparkle(p.x, p.y, p.r, Math.max(alpha, 0.08));
                } else {
                    ctx.fillStyle = `rgba(214, 185, 124, ${Math.max(alpha, 0.06)})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        }
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

/* ---------- Confetti ---------- */

const Confetti = (() => {
    const colors = ["#c9a86a", "#e6cc8f", "#f6e7c1", "#fffdf9", "#b8924f", "#9d8fd0"];
    let canvas = null;
    let pieces = [];
    let running = false;

    function loop() {
        const { ctx, size } = canvas;
        ctx.clearRect(0, 0, size.w, size.h);

        pieces = pieces.filter((p) => p.life > 0 && p.y < size.h + 20);

        pieces.forEach((p) => {
            p.vx *= 0.985;
            p.vy = p.vy * 0.985 + 0.12;
            p.x += p.vx + Math.sin(p.wobble) * 0.6;
            p.y += p.vy;
            p.wobble += 0.08;
            p.rot += p.vr;
            p.life -= 1;

            ctx.save();
            ctx.globalAlpha = Math.min(1, p.life / 60);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            if (p.round) {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // cos(rot) flattens the piece so it looks like it is flipping
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, (p.size / 2) * Math.cos(p.rot * 1.5));
            }
            ctx.restore();
        });

        if (pieces.length) {
            requestAnimationFrame(loop);
        } else {
            running = false;
            ctx.clearRect(0, 0, size.w, size.h);
        }
    }

    // Burst from (x, y) toward `angle` (radians, 0 = right, -π/2 = up)
    function burst(x, y, angle, count = 60, spread = 0.9) {
        if (prefersReducedMotion) return;
        if (!canvas) canvas = setupCanvas($("#confetti"));

        for (let i = 0; i < count; i++) {
            const a = angle + (Math.random() - 0.5) * spread;
            const speed = 6 + Math.random() * 9;
            pieces.push({
                x, y,
                vx: Math.cos(a) * speed,
                vy: Math.sin(a) * speed,
                size: 5 + Math.random() * 6,
                rot: Math.random() * Math.PI,
                vr: (Math.random() - 0.5) * 0.25,
                wobble: Math.random() * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                round: Math.random() < 0.3,
                life: 150 + Math.random() * 80
            });
        }

        if (!running) {
            running = true;
            requestAnimationFrame(loop);
        }
    }

    // Two soft bursts from the bottom corners
    function celebrate() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const count = w < 640 ? 45 : 70;
        burst(0, h, -Math.PI / 3, count);
        burst(w, h, -Math.PI * 2 / 3, count);
    }

    return { burst, celebrate };
})();

function celebrateAtFooter() {
    const footer = $("#thanks");
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            observer.disconnect();
            setTimeout(Confetti.celebrate, 500);
        }
    }, { threshold: 0.5 });

    observer.observe(footer);
}

/* ---------- Opening the card ---------- */

function openInvitation() {
    const cover = $("#cover");
    const invitation = $("#invitation");
    const openBtn = $("#open-btn");

    openBtn.disabled = true;
    window.scrollTo(0, 0);

    cover.classList.add("is-opening");
    invitation.setAttribute("aria-hidden", "false");

    // Inside the click handler, so browsers allow playback
    Music.ensurePlaying();

    const duration = prefersReducedMotion ? 0 : 1800;

    setTimeout(() => {
        startReveal();
        Confetti.celebrate();
    }, prefersReducedMotion ? 0 : 700);

    setTimeout(() => {
        cover.hidden = true;
        document.body.classList.remove("is-locked");
        celebrateAtFooter();
    }, duration);
}

/* ---------- Init ---------- */

function init() {
    applyGuest(getGuest());
    applyVenue();
    buildGallery();
    startCountdown();
    startParticles();
    Music.init();

    $("#open-btn").addEventListener("click", openInvitation, { once: true });
}

init();
