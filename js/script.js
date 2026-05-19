document.body.classList.add("js-enhanced");

const initParticlesBackground = () => {
    const particlesElement = document.querySelector("#tsparticles-background");
    const heroSection = document.querySelector(".hero");

    if (!particlesElement || !window.tsParticles) {
        return;
    }

    const updateParticlesTop = () => {
        if (!heroSection) {
            return;
        }

        const heroBottom = heroSection.getBoundingClientRect().bottom + window.scrollY;
        particlesElement.style.top = `${Math.max(0, Math.round(heroBottom))}px`;
    };

    updateParticlesTop();
    window.addEventListener("resize", updateParticlesTop);
    window.addEventListener("load", updateParticlesTop);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const particlesOptions = {
        fullScreen: { enable: false },
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        detectRetina: true,
        particles: {
            number: {
                value: 62,
                density: {
                    enable: true,
                    area: 980
                }
            },
            color: {
                value: ["#8ec5ff", "#7adbc9", "#f4f7ff"]
            },
            shape: {
                type: "circle"
            },
            links: {
                enable: true,
                distance: 145,
                color: "#7fbfff",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: prefersReducedMotion ? 0.2 : 0.55,
                direction: "none",
                random: false,
                straight: false,
                outModes: {
                    default: "out"
                }
            },
            opacity: {
                value: {
                    min: 0.1,
                    max: 0.28
                },
                animation: {
                    enable: true,
                    speed: 0.35,
                    sync: false
                }
            },
            size: {
                value: {
                    min: 1,
                    max: 2.8
                }
            }
        },
        interactivity: {
            detectsOn: "window",
            events: {
                onHover: {
                    enable: true,
                    mode: "grab",
                    parallax: {
                        enable: true,
                        force: 36,
                        smooth: 20
                    }
                },
                onClick: {
                    enable: false,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 180,
                    links: {
                        opacity: 0.32
                    }
                }
            }
        }
    };

    window.tsParticles.load("tsparticles-background", particlesOptions).catch(() => {});
};

initParticlesBackground();

const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".main-nav a");

if (siteHeader && navToggle) {
    const openLabel = "Abrir menú de navegación";
    const closeLabel = "Cerrar menú de navegación";
    const mobileQuery = window.matchMedia("(max-width: 920px)");

    const setMenuState = (isOpen) => {
        siteHeader.classList.toggle("is-open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? closeLabel : openLabel);
        document.body.classList.toggle("nav-open", isOpen && mobileQuery.matches);
    };

    const closeMenu = () => {
        setMenuState(false);
    };

    navToggle.addEventListener("click", () => {
        const isOpen = !siteHeader.classList.contains("is-open");
        setMenuState(isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 920) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (!siteHeader.classList.contains("is-open")) {
            return;
        }

        if (event.target instanceof Node && !siteHeader.contains(event.target)) {
            closeMenu();
        }
    });
}

const revealElements = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });
}

const yearElement = document.querySelector("#currentYear");
if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
}

const shareMainButton = document.querySelector("[data-share-all]");

const pageUrl = window.location.href;
const shareText = "Te comparto esta landing de MediHuman AI:";
const shareTitle = "MediHuman AI - Landing";

if (shareMainButton) {
    const defaultText =
        shareMainButton.getAttribute("data-default-text") || "Compartir esta web";

    shareMainButton.addEventListener("click", async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: pageUrl
                });
                return;
            }

            await navigator.clipboard.writeText(pageUrl);
            shareMainButton.textContent = "Enlace copiado";
            window.setTimeout(() => {
                shareMainButton.textContent = defaultText;
            }, 1600);
        } catch {
            shareMainButton.textContent = "No se pudo compartir";
            window.setTimeout(() => {
                shareMainButton.textContent = defaultText;
            }, 1600);
        }
    });
}
