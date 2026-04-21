const loader = document.querySelector(".loader");
const header = document.querySelector(".site-header");
const revealTargets = document.querySelectorAll(
  ".reveal, .process-step, .feature-card, .benefit-card, .use-case-card"
);
const counterTargets = document.querySelectorAll("[data-counter]");
const tiltTargets = document.querySelectorAll(".tilt-card");
const form = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
const liveTargets = document.querySelector("[data-live-target]");
const liveWind = document.querySelector("[data-live-wind]");
const liveDrift = document.querySelector("[data-live-drift]");
const controlPills = document.querySelectorAll(".control-pill");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader?.classList.add("hidden");
  }, 650);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealTargets.forEach((target) => revealObserver.observe(target));

const animateCounter = (element) => {
  const targetValue = Number(element.dataset.counter);
  const duration = 1400;
  const startTime = performance.now();

  const updateCounter = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(targetValue * eased);

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };

  requestAnimationFrame(updateCounter);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.55 }
);

counterTargets.forEach((counter) => counterObserver.observe(counter));

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
});

tiltTargets.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 10;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.textContent = "Transmitting...";
      submitButton.setAttribute("disabled", "true");
    }

    window.setTimeout(() => {
      formStatus.textContent = "Mission received. The AGRIONE team will contact you within 24 hours.";
      form.reset();

      if (submitButton) {
        submitButton.textContent = "Transmit Demo Request";
        submitButton.removeAttribute("disabled");
      }
    }, 900);
  });
}

const targetStates = ["12 Plants", "14 Plants", "11 Plants", "16 Plants"];
const windStates = ["3.2 m/s Wind", "2.6 m/s Wind", "4.1 m/s Wind", "3.0 m/s Wind"];
const driftStates = ["Low", "Stable", "Nominal", "Low"];

let liveIndex = 0;

window.setInterval(() => {
  liveIndex = (liveIndex + 1) % targetStates.length;

  if (liveTargets) {
    liveTargets.textContent = targetStates[liveIndex];
  }

  if (liveWind) {
    liveWind.textContent = windStates[liveIndex];
  }

  if (liveDrift) {
    liveDrift.textContent = driftStates[liveIndex];
  }
}, 2600);

controlPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    controlPills.forEach((button) => button.classList.remove("active"));
    pill.classList.add("active");
  });
});
