/* Visible shine sweep for content images without changing page layout. */
(function () {
  function initContentImageShine() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var selector = 'body.page-home img, body.page-about img, body.page-contact img, body.page-industries img, body.page-products img, body.page-gallery img';
    var excluded = '.main-header img, .mobile-menu img, footer img, #disk-hero img, .mmw-page-banner img, .logo img, .country-flag, .mmw-country-flag, .country-code-options img, .mmw-country-options img';

    document.querySelectorAll(selector).forEach(function (img) {
      if (img.matches(excluded) || img.closest('#disk-hero, .mmw-page-banner, .main-header, .mobile-menu, footer')) return;

      img.addEventListener('mouseenter', function () {
        var oldOverlay = document.querySelector('.content-image-shine-overlay');
        if (oldOverlay) oldOverlay.remove();

        var rect = img.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        var imageLeft = rect.left;
        var imageTop = rect.top;
        var imageWidth = rect.width;
        var imageHeight = rect.height;
        var imageStyle = window.getComputedStyle(img);

        /* Match the visible pixels when object-fit: contain leaves empty space. */
        if (imageStyle.objectFit === 'contain' && img.naturalWidth && img.naturalHeight) {
          var containScale = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
          imageWidth = img.naturalWidth * containScale;
          imageHeight = img.naturalHeight * containScale;
          imageLeft = rect.left + (rect.width - imageWidth) / 2;
          imageTop = rect.top + (rect.height - imageHeight) / 2;
        }

        var overlay = document.createElement('span');
        var radius = imageStyle.borderRadius;
        var parentStyle = img.parentElement ? window.getComputedStyle(img.parentElement) : null;
        if ((!radius || radius === '0px') && parentStyle && parentStyle.overflow === 'hidden') {
          radius = parentStyle.borderRadius;
        }
        overlay.className = 'content-image-shine-overlay';
        overlay.style.left = imageLeft + 'px';
        overlay.style.top = imageTop + 'px';
        overlay.style.width = imageWidth + 'px';
        overlay.style.height = imageHeight + 'px';
        overlay.style.borderRadius = radius;
        document.body.appendChild(overlay);
        overlay.addEventListener('animationend', function () { overlay.remove(); }, { once: true });
        window.setTimeout(function () { if (overlay.isConnected) overlay.remove(); }, 1000);
      });

      img.addEventListener('mouseleave', function () {
        var overlay = document.querySelector('.content-image-shine-overlay');
        if (overlay) overlay.remove();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContentImageShine);
  } else {
    initContentImageShine();
  }
})();

/* Existing home-page carousel */
(function () {
  if (!document.getElementById("disk-hero")) return;
  const data = [
    { place: "", title: "", title2: "", description: "", image: "img/banner/Rotogravure-Printing-Machine-banner-1.webp" },
    { place: "", title: "", title2: "", description: "", image: "img/banner/Lamination-Machine-banner-2.webp" },
    { place: "", title: "", title2: "", description: "", image: "img/banner/Coating-Machine-banner-3.webp" },
    { place: "", title: "", title2: "", description: "", image: "img/banner/Flexographic-Printing-Machine-banner-4.webp" },
    { place: "", title: "", title2: "", description: "", image: "img/banner/Roll-to-Sheet-Cutting-Machine-banne-6.webp" },
    { place: "", title: "", title2: "", description: "", image: "img/banner/Slitting-Rewinding-Machine-banner-7.webp" },
    { place: "", title: "", title2: "", description: "", image: "img/banner/Pouch-Making-Machine-banner-8.webp" },
  ];
  const hero = document.getElementById("disk-hero");
  const _ = (id) => document.getElementById(id);
  const cards = data
    .map(
      (i, index) =>
        `<div class="card" id="card${index}" style="background-image:url(${i.image})"></div>`,
    )
    .join("");

  const cardContents = data
    .map(
      (i, index) => `<div class="card-content" id="card-content-${index}">
<div class="content-start"></div>
<div class="content-place">${i.place}</div>
<div class="content-title-1">${i.title}</div>
<div class="content-title-2">${i.title2}</div>

</div>`,
    )
    .join("");

  const sildeNumbers = "1";
  _("demo").innerHTML = cards + cardContents;
  _("slide-numbers").innerHTML = sildeNumbers;

  const range = (n) =>
    Array(n)
      .fill(0)
      .map((i, j) => i + j);
  const set = gsap.set;

  function getCard(index) {
    return `#card${index}`;
  }
  function getCardContent(index) {
    return `#card-content-${index}`;
  }
  function animate(target, duration, properties) {
    return new Promise((resolve) => {
      gsap.to(target, {
        ...properties,
        duration: duration,
        onComplete: resolve,
      });
    });
  }

  let order = range(data.length);
  let detailsEven = true;

  let offsetTop = 200;
  let offsetLeft = 700;
  let cardWidth = 200;
  let cardHeight = 300;
  let gap = 40;
  let numberSize = 50;
  const ease = "sine.inOut";
  let progressWidth = 300;
  const visibleSideCards = 4;

  function init() {
    const [active, ...rest] = order;
    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
    const height = hero.clientHeight;
    const width = hero.clientWidth;
    gap = 12;
    cardHeight = Math.max(
      58,
      (height - (visibleSideCards - 1) * gap - 48) / visibleSideCards,
    );
    cardWidth = Math.min(width * 0.22, cardHeight * 2.4);
    offsetTop = Math.max(
      24,
      (height -
        (cardHeight * visibleSideCards + gap * (visibleSideCards - 1))) /
        2,
    );
    offsetLeft = width - cardWidth - 20;

    gsap.set("#pagination", {
      top: height - 52,
      left: width > 1100 ? 962 : width / 2,
      y: 40,
      opacity: 0,
      zIndex: 60,
    });
    progressWidth = Math.min(165, width * 0.18);

    gsap.set(getCard(active), {
      x: 0,
      y: 0,
      width: hero.clientWidth,
      height: hero.clientHeight,
    });
    gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
    gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
    gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
    gsap.set(`${detailsInactive} .text`, { y: 100 });
    gsap.set(`${detailsInactive} .title-1`, { y: 100 });
    gsap.set(`${detailsInactive} .title-2`, { y: 100 });
    gsap.set(`${detailsInactive} .desc`, { y: 50 });
    gsap.set(`${detailsInactive} .cta`, { y: 60 });

    gsap.set("#disk-hero .progress-sub-foreground", {
      width: progressWidth * (1 / order.length) * (active + 1),
    });

    rest.forEach((i, index) => {
      gsap.set(getCard(i), {
        x: offsetLeft,
        y: height + cardHeight + index * (cardHeight + gap),
        width: cardWidth,
        height: cardHeight,
        zIndex: 30,
        borderRadius: 10,
        opacity: index < visibleSideCards ? 1 : 0,
      });
      gsap.set(getCardContent(i), {
        x: offsetLeft,
        zIndex: 40,
        y: height + cardHeight + index * (cardHeight + gap),
      });
    });

    gsap.set("#disk-hero .indicator", { x: -width });

    const startDelay = 0.6;

    gsap.to("#disk-hero .cover", {
      x: width + 400,
      delay: 0.5,
      ease,
      onComplete: () => {
        setTimeout(() => {
          loop();
        }, 500);
      },
    });
    rest.forEach((i, index) => {
      gsap.to(getCard(i), {
        x: offsetLeft,
        y: offsetTop + index * (cardHeight + gap),
        zIndex: 30,
        delay: 0.05 * index,
        ease,
        delay: startDelay,
        opacity: index < visibleSideCards ? 1 : 0,
      });
      gsap.to(getCardContent(i), {
        x: offsetLeft,
        y: offsetTop + index * (cardHeight + gap),
        zIndex: 40,
        delay: 0.05 * index,
        ease,
        delay: startDelay,
      });
    });
    gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });

    gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
  }

  let clicks = 0;

  function step() {
    return new Promise((resolve) => {
      order.push(order.shift());
      detailsEven = !detailsEven;

      const detailsActive = detailsEven ? "#details-even" : "#details-odd";
      const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

      document.querySelector(`${detailsActive} .place-box .text`).textContent =
        data[order[0]].place;
      document.querySelector(`${detailsActive} .title-1`).textContent =
        data[order[0]].title;
      document.querySelector(`${detailsActive} .title-2`).textContent =
        data[order[0]].title2;
      document.querySelector(`${detailsActive} .desc`).textContent =
        data[order[0]].description;

      gsap.set(detailsActive, { zIndex: 22 });
      gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
      gsap.to(`${detailsActive} .text`, {
        y: 0,
        delay: 0.1,
        duration: 0.7,
        ease,
      });
      gsap.to(`${detailsActive} .title-1`, {
        y: 0,
        delay: 0.15,
        duration: 0.7,
        ease,
      });
      gsap.to(`${detailsActive} .title-2`, {
        y: 0,
        delay: 0.15,
        duration: 0.7,
        ease,
      });
      gsap.to(`${detailsActive} .desc`, {
        y: 0,
        delay: 0.3,
        duration: 0.4,
        ease,
      });
      gsap.to(`${detailsActive} .cta`, {
        y: 0,
        delay: 0.35,
        duration: 0.4,
        onComplete: resolve,
        ease,
      });
      gsap.set(detailsInactive, { zIndex: 12 });

      const [active, ...rest] = order;
      const prv = rest[rest.length - 1];

      document.getElementById("slide-numbers").textContent = active + 1;

      gsap.set(getCard(prv), { zIndex: 10 });
      gsap.set(getCard(active), { zIndex: 20 });
      gsap.to(getCard(prv), { scale: 1.5, ease });

      gsap.to(getCardContent(active), {
        y: offsetTop + cardHeight - 10,
        opacity: 0,
        duration: 0.3,
        ease,
      });
      gsap.to("#disk-hero .progress-sub-foreground", {
        width: progressWidth * (1 / order.length) * (active + 1),
        ease,
      });

      gsap.to(getCard(active), {
        x: 0,
        y: 0,
        ease,
        width: hero.clientWidth,
        height: hero.clientHeight,
        borderRadius: 0,
        opacity: 1,
        onComplete: () => {
          const xNew = offsetLeft;
          const yNew = offsetTop + (rest.length - 1) * (cardHeight + gap);
          gsap.set(getCard(prv), {
            x: xNew,
            y: yNew,
            width: cardWidth,
            height: cardHeight,
            zIndex: 30,
            borderRadius: 10,
            scale: 1,
            opacity: 0,
          });

          gsap.set(getCardContent(prv), {
            x: xNew,
            y: yNew,
            opacity: 1,
            zIndex: 40,
          });
          gsap.set(detailsInactive, { opacity: 0 });
          gsap.set(`${detailsInactive} .text`, { y: 100 });
          gsap.set(`${detailsInactive} .title-1`, { y: 100 });
          gsap.set(`${detailsInactive} .title-2`, { y: 100 });
          gsap.set(`${detailsInactive} .desc`, { y: 50 });
          gsap.set(`${detailsInactive} .cta`, { y: 60 });
          clicks -= 1;
          if (clicks > 0) {
            step();
          }
        },
      });

      rest.forEach((i, index) => {
        if (i !== prv) {
          const xNew = offsetLeft;
          const yNew = offsetTop + index * (cardHeight + gap);
          gsap.set(getCard(i), { zIndex: 30 });
          gsap.to(getCard(i), {
            x: xNew,
            y: yNew,
            width: cardWidth,
            height: cardHeight,
            ease,
            delay: 0.1 * (index + 1),
            opacity: index < visibleSideCards ? 1 : 0,
          });

          gsap.to(getCardContent(i), {
            x: xNew,
            y: yNew,
            opacity: 1,
            zIndex: 40,
            ease,
            delay: 0.1 * (index + 1),
          });
        }
      });
    });
  }

  async function loop() {
    await animate("#disk-hero .indicator", 2, { x: 0 });
    await animate("#disk-hero .indicator", 0.8, {
      x: hero.clientWidth,
      delay: 0.3,
    });
    set("#disk-hero .indicator", { x: -hero.clientWidth });
    await step();
    loop();
  }

  async function loadImage(src) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function loadImages() {
    const promises = data.map(({ image }) => loadImage(image));
    const images = await Promise.all(promises);
    const firstImage = images[0];
    const applyOriginalImageRatio = () => {
      hero.style.aspectRatio = `${firstImage.naturalWidth} / ${firstImage.naturalHeight}`;
      const imageHeight =
        (hero.clientWidth * firstImage.naturalHeight) / firstImage.naturalWidth;
      hero.style.height = `${window.innerWidth <= 767 ? Math.max(imageHeight, 420) : imageHeight}px`;
    };
    applyOriginalImageRatio();
    window.addEventListener("resize", applyOriginalImageRatio);
    return images;
  }

  async function start() {
    try {
      await loadImages();
      init();
      hero.querySelector(".arrow-left").addEventListener("click", () => {
        clicks++;
        step();
      });
      hero.querySelector(".arrow-right").addEventListener("click", () => {
        clicks++;
        step();
      });

      data.forEach((_, index) => {
        const card = document.getElementById(`card${index}`);
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Show banner ${index + 1}`);

        const showCard = () => {
          const distance = order.indexOf(index);
          if (distance <= 0) return;

          const wasIdle = clicks <= 0;
          clicks += distance;
          if (wasIdle) step();
        };

        card.addEventListener("click", showCard);
        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showCard();
          }
        });
      });
    } catch (error) {
      console.error("One or more images failed to load", error);
    }
  }

  start();
})();

/* contact.html page behavior. */
(function () {
  if (!document.querySelector(".mmw-contact-page")) return;
  (() => {
    const picker = document.querySelector(".mmw-country-picker");
    if (!picker) return;

    const toggle = picker.querySelector(".mmw-country-toggle");
    const options = picker.querySelector(".mmw-country-options");
    const codeLabel = picker.querySelector(".mmw-country-code");
    const flag = picker.querySelector(".mmw-country-flag");
    const codeInput = picker.parentElement.querySelector(
      'input[name="country_code"]',
    );

    toggle.addEventListener("click", () => {
      options.hidden = !options.hidden;
      toggle.setAttribute("aria-expanded", String(!options.hidden));
    });

    options.addEventListener("click", (event) => {
      const option = event.target.closest("button[data-code]");
      if (!option) return;

      const countryCode = option.dataset.code;
      codeInput.value = countryCode;
      codeLabel.textContent = countryCode;
      flag.src = `https://flagcdn.com/w40/${option.dataset.flag}.png`;
      flag.alt = option.querySelector("span").textContent;
      options.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("click", (event) => {
      if (!picker.contains(event.target)) {
        options.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  })();

  document
    .getElementById("mmwEnquiryForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const form = this;
      const button = document.getElementById("mmwSubmitButton");
      const status = document.getElementById("mmwFormStatus");

      if (!form.reportValidity()) return;

      button.disabled = true;
      button.textContent = "Sending...";
      status.textContent = "";

      try {
        const response = await fetch("contact-submit.php", {
          method: "POST",
          body: new FormData(form),
        });

        if (!response.ok) {
          throw new Error("Server error");
        }

        const result = await response.json();

        if (result.success === true) {
          status.style.color = "#087a46";
          status.textContent = "Thank you! Your enquiry has been submitted.";
          form.reset();
        } else {
          throw new Error(result.message || "Unable to submit enquiry.");
        }
      } catch (error) {
        status.style.color = "#c62828";
        status.textContent =
          error.message || "Unable to send. Please try again.";
      } finally {
        button.disabled = false;
        button.textContent = "Send Enquiry →";
      }
    });
})();

/* products.html page behavior. */
(function () {
  if (!document.getElementById("mmwCategories")) return;
  /* Exact category order requested. All URLs are relative to the website root. */
  const MMW_CATEGORIES = [
    { id: "all", name: "All Products", icon: "fa-border-all" },
    { id: "rotogravure", name: "Rotogravure Machine", icon: "fa-dharmachakra" },
    { id: "lamination", name: "Lamination Machine", icon: "fa-layer-group" },
    {
      id: "slitting",
      name: "Slitting and Rewinding Machine",
      icon: "fa-circle-nodes",
    },
    { id: "coating", name: "Coating Machine", icon: "fa-droplet" },
    { id: "flexo", name: "Flexographic Printing Machine", icon: "fa-gears" },
    {
      id: "paperbag",
      name: "Paper Bag Making Machine",
      icon: "fa-bag-shopping",
    },
    {
      id: "metalized",
      name: "Metalized Transparent Film Window Machine",
      icon: "fa-film",
    },
    {
      id: "cutting",
      name: "Roll To Sheet Cutting Machine",
      icon: "fa-scissors",
    },
    { id: "embossing", name: "Embossing Machine", icon: "fa-border-none" },
    { id: "rewinding", name: "Rewinding Machine", icon: "fa-compact-disc" },
    {
      id: "pouch",
      name: "Pouch Making Machine (Coming Soon Products)",
      icon: "fa-box",
    },
  ];
  const MMW_PRODUCTS = [
    {
      id: "rotogravure",
      title: "Rotogravure Printing Machine",
      desc: "High-speed, high-precision rotogravure printing machine for flexible packaging.",
      image: "assets/machine-1.jpg",
      url: "rotogravure-printing-machine.html",
    },
    {
      id: "lamination",
      title: "Lamination Machine",
      desc: "High-quality lamination machine for strong and durable packaging.",
      image: "assets/machine-3.jpg",
      url: "lamination-machine.html",
    },
    {
      id: "slitting",
      title: "Slitting and Rewinding Machine",
      desc: "Accurate slitting and rewinding machine for various film and paper materials.",
      image: "assets/machine-4.jpg",
      url: "slitting-machine.html",
    },
    {
      id: "coating",
      title: "Coating Machine",
      desc: "Efficient coating machine for uniform and smooth coating results.",
      image: "assets/machine-5.jpg",
      url: "coating-machine.html",
    },
    {
      id: "flexo",
      title: "Flexographic Printing Machine",
      desc: "Advanced flexographic printing machine for various packaging materials.",
      image: "assets/machine-2.jpg",
      url: "flexo-printing-machine.html",
    },
    {
      id: "paperbag",
      title: "Paper Bag Making Machine",
      desc: "Automatic paper bag making machinery for different bag types.",
      image: "assets/machine-6.jpg",
      url: "paper-bag-making-machine.html",
    },
    {
      id: "metalized",
      title: "Metalized Transparent Film Window Machine",
      desc: "Specialized machinery for metallized transparent window film production.",
      image: "assets/machine-9.jpg",
      url: "metalized-transparent-window-film-machine.php",
    },
    {
      id: "cutting",
      title: "Roll To Sheet Cutting Machine",
      desc: "Precise roll-to-sheet cutting machine for clean and accurate cutting.",
      image: "assets/machine-7.jpg",
      url: "cuttting-machine.html",
    },
    {
      id: "embossing",
      title: "Embossing Machine",
      desc: "High-performance embossing machine for premium finishing and texture.",
      image: "assets/machine-8.jpg",
      url: "embossing-machine.html",
    },
    {
      id: "rewinding",
      title: "Rewinding Machine",
      desc: "Reliable rewinding solutions for consistent roll handling.",
      image: "assets/machine-10.jpg",
      url: "rewinding-machines.php",
    },
    {
      id: "pouch",
      title: "Pouch Making Machine (Coming Soon)",
      desc: "Upcoming pouch making solutions for flexible packaging applications.",
      image: "assets/machine-11.jpg",
      url: "pouch-making-machine.php",
    },
  ];
  (function () {
    const track = document.getElementById("mmwCategories"),
      grid = document.getElementById("mmwGrid"),
      thumb = document.getElementById("mmwThumb"),
      results = document.getElementById("mmwResults"),
      empty = document.getElementById("mmwEmpty");
    let active = "all";
    function renderCategories() {
      track.innerHTML = "";
      MMW_CATEGORIES.forEach((c) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mmw-category" + (c.id === active ? " active" : "");
        btn.setAttribute("aria-pressed", String(c.id === active));
        btn.innerHTML =
          '<span class="mmw-icon-circle"><i class="fa-solid ' +
          c.icon +
          '" aria-hidden="true"></i></span><span class="mmw-category-label"></span>';
        btn.querySelector(".mmw-category-label").textContent = c.name;
        btn.addEventListener("click", () => {
          active = c.id;
          renderCategories();
          renderProducts();
        });
        track.appendChild(btn);
      });
    }
    function renderProducts() {
      const items =
        active === "all"
          ? MMW_PRODUCTS
          : MMW_PRODUCTS.filter((p) => p.id === active);
      grid.innerHTML = "";
      items.forEach((p) => {
        const card = document.createElement("article");
        card.className = "mmw-card";
        const photo = p.image
          ? '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy">'
          : '<div class="mmw-placeholder" aria-label="Image coming soon"><i class="fa-solid fa-gears"></i></div>';
        card.innerHTML =
          '<div class="mmw-product-photo">' +
          photo +
          '</div><div class="mmw-card-content"><h3></h3><p></p><div class="mmw-actions"><a class="mmw-btn mmw-btn-gold" href="' +
          p.url +
          '">View Product <span aria-hidden="true">➜</span></a><a class="mmw-btn mmw-btn-outline" href="contact-us.html?machine=' +
          encodeURIComponent(p.title) +
          '">Enquiry Now</a></div></div>';
        card.querySelector("h3").textContent = p.title;
        card.querySelector("p").textContent = p.desc;
        grid.appendChild(card);
      });
      results.textContent =
        active === "all"
          ? "Showing all " + items.length + " machine categories"
          : "Showing " +
            items.length +
            " product in " +
            MMW_CATEGORIES.find((c) => c.id === active).name;
      empty.style.display = items.length ? "none" : "block";
    }
    function updateScroll() {
      const max = track.scrollWidth - track.clientWidth;
      const ratio = track.clientWidth / track.scrollWidth;
      const width = Math.min(100, Math.max(10, ratio * 100));
      thumb.style.width = width + "%";
      thumb.style.left =
        (max > 0 ? (track.scrollLeft / max) * (100 - width) : 0) + "%";
      document.querySelector(".mmw-prev").disabled = track.scrollLeft <= 1;
      document.querySelector(".mmw-next").disabled =
        track.scrollLeft >= max - 1;
    }
    document
      .querySelector(".mmw-prev")
      .addEventListener("click", () =>
        track.scrollBy({ left: -280, behavior: "smooth" }),
      );
    document
      .querySelector(".mmw-next")
      .addEventListener("click", () =>
        track.scrollBy({ left: 280, behavior: "smooth" }),
      );
    track.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    renderCategories();
    renderProducts();
    requestAnimationFrame(updateScroll);
  })();
})();

/* industires.html page behavior. */
(function () {
  if (!document.getElementById("machineForm")) return;
  document.querySelectorAll(".enquiry-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      document.getElementById("industrySelect").value = btn.dataset.industry;
      document.getElementById("enquiry").scrollIntoView({ behavior: "smooth" });
    }),
  );
  document
    .getElementById("machineForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(this);
      const body = [
        "Name: " + data.get("name"),
        "Email: " + data.get("email"),
        "Phone: " + data.get("phone"),
        "Industry: " + data.get("industry"),
        "Requirement: " + data.get("message"),
      ].join("\n");
      window.location.href =
        "mailto:?subject=" +
        encodeURIComponent("Machine Enquiry - " + data.get("industry")) +
        "&body=" +
        encodeURIComponent(body);
    });
})();

/* Accessible mobile navigation for the shared page header. */
document.querySelectorAll(".mmw-site-header").forEach(function (header) {
  var toggle = header.querySelector(".mmw-site-nav-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", function () {
    var isOpen = header
      .querySelector(".mmw-site-header__inner")
      .classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  header.querySelectorAll(".mmw-site-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      header
        .querySelector(".mmw-site-header__inner")
        .classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});
