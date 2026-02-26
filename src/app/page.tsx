"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════ */

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const WaterDrop = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  </svg>
);

const MoleculeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <line x1="12" y1="8.5" x2="7.5" y2="15.5" />
    <line x1="12" y1="8.5" x2="16.5" y2="15.5" />
    <line x1="8.5" y1="18" x2="15.5" y2="18" />
  </svg>
);

/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */

function useCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
    };
    const enter = () => { el.style.opacity = "1"; };
    const leave = () => { el.style.opacity = "0"; };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return glowRef;
}

function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );
    if (elements.length === 0) return;

    // First mark all elements as animatable (hides them via CSS)
    elements.forEach((el) => el.classList.add("will-animate"));

    // Then observe and reveal on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    // Small delay to let the browser paint the hidden state first
    requestAnimationFrame(() => {
      elements.forEach((el) => observer.observe(el));
    });

    return () => observer.disconnect();
  }, []);
}

function useActiveSection() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -40% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return active;
}

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ═══════════════════════════════════════════
   LOADING SCREEN
   ═══════════════════════════════════════════ */

function LoadingScreen() {
  const [loaded, setLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 1200);
    const t2 = setTimeout(() => setHidden(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (hidden) return null;

  return (
    <div className={`loading-screen ${loaded ? "loaded" : ""}`}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ position: "relative" }}>
          <div className="loading-spinner" />
          <WaterDrop className="w-6 h-6" style={{ position: "absolute", inset: 0, margin: "auto", color: "#2dd4bf", opacity: 0.6 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#5eead4" }}>
            Kushlani Pathirana
          </span>
          <span style={{ color: "rgba(45,212,191,0.5)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Environmental Scientist
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   WAVE DIVIDER
   ═══════════════════════════════════════════ */

function WaveDivider({ flip = false, color = "#ffffff" }: { flip?: boolean; color?: string }) {
  return (
    <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, transform: flip ? "rotate(180deg)" : "none" }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: "100%", height: "60px", display: "block" }}>
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.44,118.92,130.38,87.12,321.39,56.44Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION HEADING
   ═══════════════════════════════════════════ */

function SectionHeading({ title, subtitle, light = false }: { title: string; subtitle?: string; light?: boolean }) {
  return (
    <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
      <h2
        style={{
          fontFamily: "var(--font-serif), Georgia, serif",
          fontSize: "clamp(1.875rem, 4vw, 3rem)",
          fontWeight: 700,
          marginBottom: "0.75rem",
          color: light ? "#ffffff" : "#1e293b",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{
          maxWidth: "40rem",
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: "1rem",
          lineHeight: 1.6,
          color: light ? "rgba(153,246,228,0.7)" : "#64748b",
        }}>
          {subtitle}
        </p>
      )}
      <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        <span style={{ width: "2rem", height: "2px", borderRadius: "999px", background: light ? "rgba(94,234,212,0.4)" : "rgba(94,234,212,0.6)" }} />
        <WaterDrop className="w-4 h-4" style={{ color: light ? "rgba(45,212,191,0.6)" : "rgba(20,184,166,0.6)" }} />
        <span style={{ width: "2rem", height: "2px", borderRadius: "999px", background: light ? "rgba(94,234,212,0.4)" : "rgba(94,234,212,0.6)" }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TIMELINE ITEM
   ═══════════════════════════════════════════ */

function TimelineItem({
  date, title, organization, children,
}: {
  date: string; title: string; organization: string; children?: React.ReactNode;
}) {
  return (
    <div className="reveal" style={{ position: "relative", paddingLeft: "2.5rem", paddingBottom: "3rem" }}>
      {/* Vertical line */}
      <div style={{
        position: "absolute", left: "13px", top: "12px", bottom: 0,
        width: "2px", background: "linear-gradient(to bottom, #5eead4, #ccfbf1)",
      }} />
      {/* Dot */}
      <div style={{
        position: "absolute", left: 0, top: "8px",
        width: "28px", height: "28px", borderRadius: "50%",
        background: "linear-gradient(135deg, #2dd4bf, #10b981)",
        border: "4px solid #ffffff",
        boxShadow: "0 4px 12px rgba(20,184,166,0.3)",
      }} />
      <div>
        <span style={{
          display: "inline-block", padding: "4px 16px",
          fontSize: "0.75rem", fontWeight: 700,
          color: "#0f766e", background: "#f0fdfa",
          borderRadius: "999px", marginBottom: "0.75rem",
          letterSpacing: "0.03em",
        }}>
          {date}
        </span>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.25rem" }}>{title}</h3>
        <p style={{ fontSize: "0.875rem", color: "#0d9488", fontWeight: 600, marginBottom: "0.75rem" }}>{organization}</p>
        {children && <div style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>{children}</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SKILL BADGE
   ═══════════════════════════════════════════ */

function SkillBadge({ label }: { label: string }) {
  return (
    <span
      className="reveal-scale"
      style={{
        display: "inline-block",
        padding: "0.625rem 1rem",
        margin: "0.375rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "#0f766e",
        background: "linear-gradient(135deg, #f0fdfa, #ecfdf5)",
        borderRadius: "999px",
        border: "1px solid rgba(153,246,228,0.8)",
        cursor: "default",
        transition: "all 0.3s ease",
      }}
    >
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════ */

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#about", label: "About", id: "about" },
    { href: "#education", label: "Education", id: "education" },
    { href: "#experience", label: "Experience", id: "experience" },
    { href: "#research", label: "Research", id: "research" },
    { href: "#publications", label: "Publications", id: "publications" },
    { href: "#skills", label: "Skills", id: "skills" },
    { href: "#contact", label: "Contact", id: "contact" },
  ];

  return (
    <nav className={`nav-bar ${scrolled ? "nav-scrolled" : ""}`}>
      <div style={{
        maxWidth: "80rem", margin: "0 auto",
        padding: "1.25rem 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <a href="#" style={{
          fontFamily: "var(--font-serif), Georgia, serif",
          fontSize: "1.5rem", fontWeight: 700,
          color: scrolled ? "#0f766e" : "#ffffff",
          textDecoration: "none", display: "flex", alignItems: "center", gap: "0.375rem",
          transition: "color 0.5s ease",
        }}>
          <WaterDrop className="w-5 h-5" style={{ color: scrolled ? "#14b8a6" : "#5eead4", transition: "color 0.5s ease" }} />
          K<span style={{ color: scrolled ? "#cbd5e1" : "rgba(255,255,255,0.3)", margin: "0 2px", transition: "color 0.5s ease" }}>.</span>P
        </a>

        {/* Desktop links */}
        <div className="nav-desktop" style={{
          display: "flex", alignItems: "center", gap: "0.25rem",
        }}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                borderRadius: "999px",
                textDecoration: "none",
                transition: "all 0.4s ease",
                color: activeSection === l.id
                  ? (scrolled ? "#0f766e" : "#ffffff")
                  : (scrolled ? "#475569" : "rgba(255,255,255,0.7)"),
                background: activeSection === l.id
                  ? (scrolled ? "rgba(240,253,250,0.7)" : "rgba(255,255,255,0.1)")
                  : "transparent",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA button */}
        <a
          href="#contact"
          className="nav-cta"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.625rem 1.25rem",
            background: scrolled
              ? "linear-gradient(135deg, #14b8a6, #059669)"
              : "rgba(255,255,255,0.15)",
            border: scrolled ? "none" : "1px solid rgba(255,255,255,0.25)",
            color: "#ffffff", fontSize: "0.875rem", fontWeight: 600,
            borderRadius: "999px", textDecoration: "none",
            backdropFilter: scrolled ? "none" : "blur(8px)",
            transition: "all 0.5s ease",
          }}
        >
          <MailIcon />
          Contact
        </a>

        {/* Mobile toggle */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{
            display: "none", padding: "0.5rem",
            borderRadius: "0.75rem", border: "none",
            background: "transparent",
            color: scrolled ? "#334155" : "#ffffff",
            cursor: "pointer", transition: "color 0.5s ease",
          }}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="glass-mobile nav-mobile-menu"
        style={{
          overflow: "hidden",
          maxHeight: mobileOpen ? "500px" : "0",
          opacity: mobileOpen ? 1 : 0,
          transition: "all 0.5s ease",
          borderTop: mobileOpen ? "1px solid rgba(241,245,249,0.5)" : "none",
        }}
      >
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                fontSize: "1rem", fontWeight: 500,
                borderRadius: "0.75rem",
                textDecoration: "none",
                color: activeSection === l.id ? "#0f766e" : "#475569",
                background: activeSection === l.id ? "#f0fdfa" : "transparent",
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            style={{
              marginTop: "0.5rem", padding: "0.75rem 1rem",
              background: "linear-gradient(135deg, #14b8a6, #059669)",
              color: "#ffffff", fontSize: "1rem", fontWeight: 600,
              borderRadius: "0.75rem", textDecoration: "none", textAlign: "center",
            }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */

function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative", minHeight: "100vh", width: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, #042f2e 0%, #134e4a 40%, #065f46 100%)",
      }} />

      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Animated blobs */}
      <div className="animate-float" style={{
        position: "absolute", top: "5rem", left: "2.5rem",
        width: "18rem", height: "18rem",
        background: "rgba(45,212,191,0.15)", borderRadius: "50%", filter: "blur(48px)",
        transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
      }} />
      <div className="animate-float" style={{
        position: "absolute", bottom: "5rem", right: "2.5rem",
        width: "24rem", height: "24rem",
        background: "rgba(16,185,129,0.12)", borderRadius: "50%", filter: "blur(48px)",
        animationDelay: "1.5s",
        transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
      }} />
      <div style={{
        position: "absolute", top: "33%", right: "25%",
        width: "12rem", height: "12rem",
        background: "rgba(94,234,212,0.08)", borderRadius: "50%", filter: "blur(32px)",
        transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`,
      }} />

      {/* Floating water drops */}
      <WaterDrop className="animate-float" style={{ position: "absolute", top: "15%", left: "10%", width: "1rem", height: "1rem", color: "rgba(45,212,191,0.2)" }} />
      <WaterDrop className="animate-float" style={{ position: "absolute", top: "25%", right: "15%", width: "1.5rem", height: "1.5rem", color: "rgba(94,234,212,0.15)", animationDelay: "1s" }} />
      <WaterDrop className="animate-float" style={{ position: "absolute", bottom: "20%", left: "20%", width: "1.25rem", height: "1.25rem", color: "rgba(52,211,153,0.15)", animationDelay: "2s" }} />

      {/* Orbital rings */}
      <div className="animate-spin-slow" style={{
        position: "absolute", top: "50%", left: "50%",
        width: "500px", height: "500px",
        borderRadius: "50%", border: "1px solid rgba(45,212,191,0.1)",
        transform: `translate(calc(-50% + ${mousePos.x * 10}px), calc(-50% + ${mousePos.y * 10}px))`,
      }} />
      <div className="animate-spin-slow" style={{
        position: "absolute", top: "50%", left: "50%",
        width: "350px", height: "350px",
        borderRadius: "50%", border: "1px solid rgba(94,234,212,0.05)",
        animationDirection: "reverse",
        transform: `translate(calc(-50% + ${mousePos.x * -5}px), calc(-50% + ${mousePos.y * -5}px))`,
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 10,
        textAlign: "center", padding: "0 1.5rem",
        maxWidth: "56rem", margin: "0 auto", width: "100%",
      }}>
        {/* Initials badge */}
        <div className="animate-scale-in animate-pulse-glow" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "7rem", height: "7rem", borderRadius: "50%",
          background: "rgba(255,255,255,0.1)", border: "2px solid rgba(94,234,212,0.3)",
          marginBottom: "2rem", backdropFilter: "blur(8px)",
        }}>
          <span style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "2.25rem", fontWeight: 700, color: "#ffffff" }}>
            KP
          </span>
        </div>

        <h1 className="hero-gradient-text animate-fade-in-up" style={{
          fontFamily: "var(--font-serif), Georgia, serif",
          fontSize: "clamp(2.5rem, 8vw, 5rem)",
          fontWeight: 700, marginBottom: "1.25rem",
          letterSpacing: "-0.02em", lineHeight: 1.1,
        }}>
          Kushlani Pathirana
        </h1>

        <p className="animate-fade-in-up" style={{
          color: "#99f6e4", fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
          fontWeight: 500, marginBottom: "1rem",
          animationDelay: "0.2s",
        }}>
          Environmental Scientist &amp; Research Assistant
        </p>

        {/* University tag */}
        <div className="animate-fade-in-up" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "0.75rem", marginBottom: "2rem",
          animationDelay: "0.3s",
        }}>
          <span style={{ width: "3rem", height: "1px", background: "rgba(45,212,191,0.4)" }} />
          <WaterDrop className="w-3 h-3" style={{ color: "rgba(45,212,191,0.6)" }} />
          <span style={{ color: "rgba(94,234,212,0.6)", fontSize: "0.875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            University of Peradeniya
          </span>
          <WaterDrop className="w-3 h-3" style={{ color: "rgba(45,212,191,0.6)" }} />
          <span style={{ width: "3rem", height: "1px", background: "rgba(45,212,191,0.4)" }} />
        </div>

        <p className="animate-fade-in-up" style={{
          color: "rgba(204,251,241,0.55)",
          maxWidth: "38rem", margin: "0 auto 3rem",
          fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)",
          lineHeight: 1.7, animationDelay: "0.4s",
        }}>
          Focused on environmental chemistry, water treatment, and nanocomposite membrane
          development for desalination. Passionate about sustainable water management and
          environmental toxicology.
        </p>

        {/* Contact chips */}
        <div className="animate-fade-in-up" style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: "1rem", marginBottom: "3.5rem",
          animationDelay: "0.6s",
        }}>
          {[
            { href: "mailto:kushlanipathirana@gmail.com", icon: <MailIcon />, text: "kushlanipathirana@gmail.com" },
            { href: "tel:+94763421824", icon: <PhoneIcon />, text: "+94 763421824" },
            { href: "https://www.linkedin.com/in/kushlani-pathirana-687a52245", icon: <LinkedInIcon />, text: "LinkedIn", external: true },
          ].map((c, i) => (
            <a
              key={i}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.625rem",
                padding: "0.75rem 1.5rem",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "999px", color: "#ffffff",
                fontSize: "0.875rem", fontWeight: 500,
                textDecoration: "none", backdropFilter: "blur(8px)",
                transition: "all 0.3s ease",
              }}
            >
              {c.icon}
              {c.text}
            </a>
          ))}
        </div>

        {/* Scroll indicator */}
        <a href="#about" className="animate-fade-in" style={{
          display: "inline-flex", flexDirection: "column",
          alignItems: "center", color: "rgba(94,234,212,0.5)",
          textDecoration: "none", animationDelay: "1.2s",
        }}>
          <span style={{ fontSize: "0.75rem", marginBottom: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>
            Explore
          </span>
          <span className="animate-bounce"><ChevronDown /></span>
        </a>
      </div>

      {/* Bottom wave */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <WaveDivider color="#ffffff" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   STATS BAR
   ═══════════════════════════════════════════ */

function StatsBar() {
  const gpa = useCountUp(357, 1500);
  const certs = useCountUp(4, 1000);
  const pubs = useCountUp(1, 800);

  return (
    <div style={{ background: "#ffffff", padding: "3rem 0", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{
        maxWidth: "64rem", margin: "0 auto", padding: "0 1.5rem",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem",
        textAlign: "center",
      }}>
        <div ref={gpa.ref} className="reveal">
          <p className="stat-number" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700 }}>
            {(gpa.count / 100).toFixed(2)}
          </p>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem", fontWeight: 500 }}>GPA</p>
        </div>
        <div ref={certs.ref} className="reveal">
          <p className="stat-number" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700 }}>
            {certs.count}+
          </p>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem", fontWeight: 500 }}>Certifications</p>
        </div>
        <div ref={pubs.ref} className="reveal">
          <p className="stat-number" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700 }}>
            {pubs.count}
          </p>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem", fontWeight: 500 }}>Publications</p>
        </div>
        <div className="reveal">
          <p className="stat-number" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700 }}>
            2+
          </p>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem", fontWeight: 500 }}>Years Research</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ABOUT SECTION
   ═══════════════════════════════════════════ */

function AboutSection() {
  const cards = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      title: "Research Focus",
      desc: "Environmental chemistry and water treatment, including developing nanocomposite membranes for desalination and assessing river health through chemical analysis.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      title: "Current Work",
      desc: "Investigating baseline variation of surface water in Kelani River, Sri Lanka, and determining the fate of toxic metals attached to suspended particles.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
      title: "Vision",
      desc: "Passionate about Environmental Toxicology and sustainable water management. Seeking advanced research opportunities to make a meaningful impact.",
    },
  ];

  return (
    <section id="about" style={{ padding: "7rem 0", background: "#ffffff" }}>
      <div className="section-container">
        <SectionHeading
          title="About Me"
          subtitle="Dedicated to understanding and protecting our water resources"
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
        }} className="stagger">
          {cards.map((card, i) => (
            <div
              key={i}
              className="reveal magnetic-card"
              style={{
                padding: "2rem",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, #f8fafc, rgba(240,253,250,0.5))",
                border: "1px solid #f1f5f9",
                transition: "all 0.5s ease",
              }}
            >
              <div style={{
                width: "4rem", height: "4rem", borderRadius: "1rem",
                background: "linear-gradient(135deg, #14b8a6, #059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#ffffff", marginBottom: "1.5rem",
                boxShadow: "0 8px 24px rgba(20,184,166,0.2)",
              }}>
                {card.icon}
              </div>
              <h3 style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "1.25rem", fontWeight: 700, color: "#1e293b",
                marginBottom: "0.75rem",
              }}>
                {card.title}
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.7 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   EDUCATION SECTION
   ═══════════════════════════════════════════ */

function EducationSection() {
  return (
    <section id="education" style={{ padding: "7rem 0", background: "linear-gradient(to bottom, #f8fafc, #ffffff)" }}>
      <div className="section-container">
        <SectionHeading title="Education" subtitle="Academic foundation in environmental sciences" />
        <div className="section-narrow">
          {/* Degree */}
          <div className="reveal" style={{
            padding: "2.5rem", borderRadius: "1rem",
            background: "#ffffff", border: "1px solid #f1f5f9",
            boxShadow: "0 20px 60px rgba(241,245,249,0.8)",
            marginBottom: "2rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "8rem", height: "8rem",
              background: "linear-gradient(225deg, #f0fdfa, transparent)",
              borderRadius: "0 0 0 100%",
            }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: "clamp(1.125rem, 2vw, 1.5rem)", fontWeight: 700, color: "#1e293b",
                  }}>
                    B.Sc. Hons in Environmental Sciences
                  </h3>
                  <p style={{ color: "#0d9488", fontWeight: 600, marginTop: "0.25rem", fontSize: "0.95rem" }}>
                    School of Science, University of Peradeniya
                  </p>
                </div>
                <span style={{
                  padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: 700,
                  color: "#0f766e", background: "#f0fdfa", borderRadius: "999px",
                  whiteSpace: "nowrap",
                }}>
                  2019 &ndash; 2024
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                <div style={{
                  padding: "0.75rem 1.25rem",
                  background: "linear-gradient(135deg, #ecfdf5, #f0fdfa)",
                  borderRadius: "0.75rem", border: "1px solid #d1fae5",
                }}>
                  <span style={{ color: "#047857", fontWeight: 700, fontSize: "1.5rem" }}>3.57</span>
                  <span style={{ color: "rgba(4,120,87,0.6)", fontSize: "0.875rem", marginLeft: "0.25rem" }}>GPA</span>
                </div>
                <div style={{
                  padding: "0.5rem 1rem",
                  background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #f1f5f9",
                }}>
                  <span style={{ color: "#475569", fontWeight: 600, fontSize: "0.875rem" }}>120 Credits</span>
                </div>
              </div>

              <div style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.8 }}>
                <p><strong style={{ color: "#475569" }}>100 Level:</strong> Chemistry, Physics, Biology</p>
                <p><strong style={{ color: "#475569" }}>200 Level:</strong> Chemistry, Physics</p>
                <p><strong style={{ color: "#475569" }}>300 Level:</strong> Chemistry, Environmental Science</p>
                <p><strong style={{ color: "#475569" }}>400 Level:</strong> Environmental Science</p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="reveal" style={{
            padding: "2.5rem", borderRadius: "1rem",
            background: "#ffffff", border: "1px solid #f1f5f9",
            boxShadow: "0 20px 60px rgba(241,245,249,0.8)",
          }}>
            <h3 style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "1.25rem", fontWeight: 700, color: "#1e293b",
              marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              Certifications
              <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "#94a3b8", background: "#f8fafc", padding: "0.25rem 0.75rem", borderRadius: "999px" }}>
                via Coursera
              </span>
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="stagger">
              {[
                { name: "Sustainable Cities and Communities Specialization", org: "Lund University, Sweden" },
                { name: "Introduction to Material Science", org: "Arizona State University" },
                { name: "Renewable Energy Technology Fundamentals", org: "University of Colorado Boulder" },
                { name: "Project Management", org: "Google" },
              ].map((cert, i) => (
                <div key={i} className="reveal" style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{
                    marginTop: "2px", width: "2rem", height: "2rem", borderRadius: "0.5rem",
                    background: "linear-gradient(135deg, #ccfbf1, #d1fae5)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "1rem", height: "1rem", color: "#0d9488" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: "#334155", fontWeight: 600, fontSize: "0.875rem" }}>{cert.name}</p>
                    <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "0.125rem" }}>{cert.org}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   EXPERIENCE SECTION
   ═══════════════════════════════════════════ */

function ExperienceSection() {
  return (
    <section id="experience" style={{ padding: "7rem 0", background: "#ffffff" }}>
      <div className="section-container">
        <SectionHeading title="Experience" subtitle="Professional journey in environmental research" />
        <div className="section-narrow">
          <TimelineItem date="2024 – Present" title="Research Assistant" organization="National Institute of Fundamental Studies, Sri Lanka">
            <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>Conducting research on water quality analysis and toxic metal behavior in surface water</li>
              <li>Mentoring undergraduate students under the membrane development projects</li>
            </ul>
          </TimelineItem>

          <TimelineItem date="2023 – 2024" title="Volunteer Research Assistant" organization="National Institute of Fundamental Studies, Sri Lanka">
            <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
              <li>Contributed to membrane development projects for water desalination</li>
            </ul>
          </TimelineItem>

          <TimelineItem date="6 Weeks" title="Industrial Trainee" organization="Horticultural Crop Research and Development Institute, Sri Lanka">
            <ul style={{ listStyle: "disc", paddingLeft: "1.25rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>Analyzed macro-nutrients in soil, compost and urea fertilizer (Kjeldahl, Olsen, Walkely Black methods)</li>
              <li>Instruments: Atomic Absorption Spectrometer, Flame Photometer, UV Spectrophotometer, pH meter, Conductivity meter</li>
            </ul>
          </TimelineItem>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   RESEARCH SECTION
   ═══════════════════════════════════════════ */

function ResearchSection() {
  return (
    <section id="research" style={{ position: "relative", overflow: "hidden" }}>
      {/* Top wave */}
      <div style={{ background: "#ffffff" }}>
        <WaveDivider color="#042f2e" />
      </div>

      <div style={{
        background: "linear-gradient(to bottom, #042f2e, #134e4a)",
        padding: "7rem 0", position: "relative",
      }}>
        {/* BG blobs */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "24rem", height: "24rem", background: "rgba(45,212,191,0.05)", borderRadius: "50%", filter: "blur(48px)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "20rem", height: "20rem", background: "rgba(52,211,153,0.05)", borderRadius: "50%", filter: "blur(48px)" }} />

        <div className="section-container" style={{ position: "relative", zIndex: 10 }}>
          <SectionHeading title="Research" subtitle="Advancing knowledge in water treatment and environmental chemistry" light />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem", maxWidth: "64rem", margin: "0 auto",
          }}>
            {/* Current Research */}
            <div className="reveal-left" style={{
              padding: "2.5rem", borderRadius: "1rem",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)", transition: "all 0.5s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <span style={{ position: "relative", display: "inline-flex", width: "12px", height: "12px" }}>
                  <span className="animate-ping" style={{ position: "absolute", display: "inline-flex", width: "100%", height: "100%", borderRadius: "50%", background: "#34d399", opacity: 0.75 }} />
                  <span style={{ position: "relative", display: "inline-flex", width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }} />
                </span>
                <span style={{
                  padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 700,
                  color: "#34d399", background: "rgba(52,211,153,0.1)",
                  borderRadius: "999px", border: "1px solid rgba(52,211,153,0.2)",
                }}>
                  ONGOING
                </span>
                <span style={{ color: "rgba(94,234,212,0.6)", fontSize: "0.875rem" }}>2024 – Present</span>
              </div>
              <h3 style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "1.375rem", fontWeight: 700, color: "#ffffff", marginBottom: "1rem",
              }}>
                Surface Water Analysis – Kelani River
              </h3>
              <p style={{ color: "rgba(204,251,241,0.55)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Determining the baseline variation of surface water in Kelani River, Sri Lanka,
                and investigating the fate of toxic metals attached to suspended particles.
              </p>
              <p style={{ fontSize: "0.75rem", color: "rgba(94,234,212,0.5)", fontWeight: 500 }}>
                National Institute of Fundamental Studies
              </p>
            </div>

            {/* Undergrad Research */}
            <div className="reveal-right" style={{
              padding: "2.5rem", borderRadius: "1rem",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)", transition: "all 0.5s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <span style={{
                  padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 700,
                  color: "#fbbf24", background: "rgba(251,191,36,0.1)",
                  borderRadius: "999px", border: "1px solid rgba(251,191,36,0.2)",
                }}>
                  COMPLETED
                </span>
                <span style={{ color: "rgba(94,234,212,0.6)", fontSize: "0.875rem" }}>2023 – 2024</span>
              </div>
              <h3 style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "1.375rem", fontWeight: 700, color: "#ffffff", marginBottom: "1rem",
              }}>
                GO Thin Film Nano-Composite Membrane
              </h3>
              <p style={{ color: "rgba(204,251,241,0.55)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Spin assisted method for enhanced water desalination of Graphene Oxide incorporated
                Thin Film Nano-Composite membrane. Utilized spin-coating to control selective layer
                thickness within the nanometer range.
              </p>
              <div style={{ fontSize: "0.75rem", color: "rgba(94,234,212,0.5)" }}>
                <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>University of Peradeniya &amp; NIFS</p>
                <p style={{ color: "rgba(153,246,228,0.3)", marginBottom: "0.5rem" }}>
                  Skills: ATR-FTIR, SEM, Raman Spectrometry, Zeta Potential, Statistical Analysis
                </p>
                <p style={{ color: "rgba(52,211,153,0.7)", fontWeight: 600 }}>
                  Outcome: 1 published abstract, 1 full paper (in writing)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div style={{ background: "linear-gradient(to bottom, #134e4a, #134e4a)" }}>
        <WaveDivider color="#ffffff" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PUBLICATIONS SECTION
   ═══════════════════════════════════════════ */

function PublicationsSection() {
  return (
    <section id="publications" style={{ padding: "7rem 0", background: "#ffffff" }}>
      <div className="section-container">
        <SectionHeading title="Publications & Conferences" subtitle="Contributing to the scientific community" />
        <div className="section-narrow" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Publication */}
          <div className="reveal" style={{
            padding: "2.5rem", borderRadius: "1rem",
            borderLeft: "4px solid #14b8a6",
            background: "linear-gradient(to right, rgba(240,253,250,0.5), transparent)",
            boxShadow: "0 10px 40px rgba(240,253,250,0.5)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0, width: "6rem", height: "6rem",
              background: "linear-gradient(225deg, rgba(204,251,241,0.3), transparent)",
              borderRadius: "0 0 0 100%",
            }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{
                  padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 700,
                  color: "#ffffff", background: "linear-gradient(135deg, #14b8a6, #059669)",
                  borderRadius: "999px",
                }}>
                  ABSTRACT
                </span>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500 }}>Published</span>
              </div>
              <p style={{ color: "#334155", fontSize: "0.875rem", lineHeight: 1.7 }}>
                <strong>P. K. K. Pathirana, S. Hemachandra, Rohan Weerasooriya</strong> |
                Performance Optimization of Thin Film Nano-composite membrane for Water Purification
                using a Spin Assisted Method
              </p>
              <p style={{ fontSize: "0.75rem", color: "#0d9488", marginTop: "0.75rem", fontWeight: 500 }}>
                9th International Symposium on Water Quality and Human Health, Postgraduate Institute of Science, Peradeniya
              </p>
            </div>
          </div>

          {/* Conferences */}
          <div className="reveal" style={{
            padding: "2.5rem", borderRadius: "1rem",
            background: "#f8fafc", border: "1px solid #f1f5f9",
          }}>
            <h3 style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "1.125rem", fontWeight: 700, color: "#1e293b",
              marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <MoleculeIcon />
              Conferences &amp; Webinars
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                "9th International Symposium on Water Quality and Human Health – Presenter",
                "Webcast: Theory & Applications of FTIR & UV-Vis Spectroscopy (Thermo Fisher Scientific)",
                "Webcast: Conquering Compliance – Robust Testing Solutions for Metals and PFAS in Water (PerkinElmer)",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div style={{ marginTop: "0.5rem", width: "8px", height: "8px", borderRadius: "50%", background: "#2dd4bf", flexShrink: 0 }} />
                  <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Other Projects */}
          <div className="reveal" style={{
            padding: "2.5rem", borderRadius: "1rem",
            background: "#f8fafc", border: "1px solid #f1f5f9",
          }}>
            <h3 style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "1.125rem", fontWeight: 700, color: "#1e293b",
              marginBottom: "1.25rem",
            }}>
              Other Projects
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                "Undergraduate Seminar: Review Presentation on Nanocapillary electrophoresis coupled with C4D for environmental analysis",
                "Poster Presentation on industrial training project (soil, compost analysis)",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div style={{ marginTop: "0.5rem", width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
                  <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SKILLS SECTION
   ═══════════════════════════════════════════ */

function SkillsSection() {
  return (
    <section id="skills" style={{ padding: "7rem 0", background: "linear-gradient(to bottom, #f8fafc, #ffffff)" }}>
      <div className="section-container">
        <SectionHeading title="Skills & Expertise" subtitle="Analytical instruments, techniques, and software proficiency" />
        <div className="section-medium" style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* Analytical Instruments */}
          <div className="reveal">
            <h3 style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "1.125rem", fontWeight: 700, color: "#334155",
              marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <span style={{ width: "2.5rem", height: "3px", background: "linear-gradient(to right, #14b8a6, #5eead4)", borderRadius: "999px" }} />
              Analytical Instruments
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap" }} className="stagger">
              {[
                "HPLC / IC (Shimadzu)", "FTIR / ATR (Thermo Fisher)",
                "Zeta Potential Analyzer (SurPASS 3)", "Auto Titrator (KEM)",
                "ICP-OES (Thermo Fisher)", "Atomic Absorption Spectrometer",
                "Flame Photometer", "UV Spectrophotometer",
                "Scanning Electron Microscopy", "Raman Spectrometry",
              ].map((s) => <SkillBadge key={s} label={s} />)}
            </div>
          </div>

          {/* Techniques */}
          <div className="reveal">
            <h3 style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "1.125rem", fontWeight: 700, color: "#334155",
              marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <span style={{ width: "2.5rem", height: "3px", background: "linear-gradient(to right, #10b981, #34d399)", borderRadius: "999px" }} />
              Techniques
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap" }} className="stagger">
              {[
                "ATR-FTIR Analysis", "Zeta Potential Analysis",
                "Kjeldahl Method", "Olsen Method",
                "Walkley Black Method", "Statistical Data Analysis",
              ].map((s) => <SkillBadge key={s} label={s} />)}
            </div>
          </div>

          {/* Software */}
          <div className="reveal">
            <h3 style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "1.125rem", fontWeight: 700, color: "#334155",
              marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <span style={{ width: "2.5rem", height: "3px", background: "linear-gradient(to right, #06b6d4, #67e8f9)", borderRadius: "999px" }} />
              Software
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap" }} className="stagger">
              {["Origin", "ChemDraw", "ImageJ", "Microsoft Excel", "PowerPoint"].map((s) => (
                <SkillBadge key={s} label={s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ACTIVITIES SECTION
   ═══════════════════════════════════════════ */

function ActivitiesSection() {
  return (
    <section style={{ padding: "7rem 0", background: "#ffffff" }}>
      <div className="section-container">
        <SectionHeading title="Activities" subtitle="Professional engagement and community involvement" />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem", maxWidth: "56rem", margin: "0 auto",
        }}>
          {/* Professional */}
          <div className="reveal-left" style={{
            padding: "2.5rem", borderRadius: "1rem",
            background: "linear-gradient(135deg, #f0fdfa, rgba(236,253,245,0.5))",
            border: "1px solid #ccfbf1",
            transition: "all 0.5s ease",
          }}>
            <h3 style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "1.125rem", fontWeight: 700, color: "#115e59",
              marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "1.25rem", height: "1.25rem", color: "#0d9488" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Professional
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { text: "Committee Member, Environmental Science Society, University of Peradeniya", year: "2023" },
                { text: "Member of Proceeding Book Team, YSCMR (Young Scientists' Conference on Multidisciplinary Research)", year: "2024" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{
                    marginTop: "0.375rem", width: "12px", height: "12px",
                    borderRadius: "50%", background: "linear-gradient(135deg, #2dd4bf, #10b981)",
                    flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ color: "#334155", fontSize: "0.875rem", lineHeight: 1.7 }}>{a.text}</p>
                    <p style={{ color: "#14b8a6", fontSize: "0.75rem", fontWeight: 700, marginTop: "0.25rem" }}>{a.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extracurricular */}
          <div className="reveal-right" style={{
            padding: "2.5rem", borderRadius: "1rem",
            background: "linear-gradient(135deg, #f8fafc, rgba(240,253,250,0.3))",
            border: "1px solid #f1f5f9",
            transition: "all 0.5s ease",
          }}>
            <h3 style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "1.125rem", fontWeight: 700, color: "#1e293b",
              marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "1.25rem", height: "1.25rem", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
              Extracurricular
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { text: "Nextgen – Knuckles Reforestation Project", year: "2022" },
                { text: "St. John Ambulance Brigade – Bronze Medal, Provincial Camp", year: "2013" },
                { text: "Western Cadet Band, Nature Club, Science Society, Mathematical Society, Music Society at Mahamaya Girls' College Kandy", year: "" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{
                    marginTop: "0.375rem", width: "12px", height: "12px",
                    borderRadius: "50%", background: "#cbd5e1",
                    flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ color: "#334155", fontSize: "0.875rem", lineHeight: 1.7 }}>{a.text}</p>
                    {a.year && <p style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 500, marginTop: "0.25rem" }}>{a.year}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CONTACT SECTION
   ═══════════════════════════════════════════ */

function ContactSection() {
  return (
    <section id="contact" style={{ position: "relative", overflow: "hidden" }}>
      {/* Top wave */}
      <div style={{ background: "#ffffff" }}>
        <WaveDivider color="#042f2e" />
      </div>

      <div style={{
        background: "linear-gradient(to bottom, #042f2e, #0f172a)",
        padding: "7rem 0", position: "relative",
      }}>
        <div style={{ position: "absolute", top: "5rem", right: "5rem", width: "18rem", height: "18rem", background: "rgba(45,212,191,0.05)", borderRadius: "50%", filter: "blur(48px)" }} />
        <div style={{ position: "absolute", bottom: "5rem", left: "5rem", width: "24rem", height: "24rem", background: "rgba(52,211,153,0.05)", borderRadius: "50%", filter: "blur(48px)" }} />

        <div className="section-container" style={{ position: "relative", zIndex: 10 }}>
          <SectionHeading
            title="Get in Touch"
            subtitle="Interested in collaboration or research opportunities? Feel free to reach out."
            light
          />

          {/* Contact Cards */}
          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center",
            gap: "1.5rem", marginBottom: "5rem",
          }} className="stagger">
            {[
              { href: "mailto:kushlanipathirana@gmail.com", icon: <MailIcon />, label: "Email", value: "kushlanipathirana@gmail.com" },
              { href: "tel:+94763421824", icon: <PhoneIcon />, label: "Phone", value: "+94 763421824" },
              { href: "https://www.linkedin.com/in/kushlani-pathirana-687a52245", icon: <LinkedInIcon />, label: "LinkedIn", value: "Kushlani Pathirana", external: true },
            ].map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="reveal-scale"
                style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1.25rem 1.75rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "1rem", textDecoration: "none",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{
                  width: "3.5rem", height: "3.5rem", borderRadius: "0.75rem",
                  background: "rgba(20,184,166,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#2dd4bf",
                  boxShadow: "0 8px 24px rgba(20,184,166,0.1)",
                }}>
                  {c.icon}
                </div>
                <div>
                  <p style={{ fontSize: "0.7rem", color: "rgba(94,234,212,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>
                    {c.label}
                  </p>
                  <p style={{ color: "#ffffff", fontSize: "0.875rem", fontWeight: 500 }}>{c.value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* References */}
          <div className="section-narrow">
            <h3 className="reveal" style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "1.25rem", fontWeight: 700, color: "#ffffff",
              textAlign: "center", marginBottom: "2.5rem",
            }}>
              References
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}>
              <div className="reveal-left" style={{
                padding: "1.75rem", borderRadius: "1rem",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
              }}>
                <h4 style={{ fontWeight: 700, color: "#ffffff", fontSize: "1.125rem", marginBottom: "0.25rem" }}>
                  Prof. Rohan Weerasooriya
                </h4>
                <p style={{ color: "rgba(153,246,228,0.6)", fontSize: "0.875rem", fontWeight: 500 }}>Research Professor</p>
                <p style={{ color: "rgba(153,246,228,0.35)", fontSize: "0.75rem", marginTop: "0.5rem", lineHeight: 1.6 }}>
                  National Institute of Fundamental Studies, Hantana Rd, Kandy
                </p>
                <a href="mailto:Rohan.we@nifs.ac.lk" style={{
                  color: "#2dd4bf", fontSize: "0.875rem", marginTop: "0.75rem",
                  display: "inline-block", textDecoration: "none", fontWeight: 500,
                }}>
                  Rohan.we@nifs.ac.lk
                </a>
              </div>
              <div className="reveal-right" style={{
                padding: "1.75rem", borderRadius: "1rem",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
              }}>
                <h4 style={{ fontWeight: 700, color: "#ffffff", fontSize: "1.125rem", marginBottom: "0.25rem" }}>
                  Dr. Manjula Wijesinghe
                </h4>
                <p style={{ color: "rgba(153,246,228,0.6)", fontSize: "0.875rem", fontWeight: 500 }}>Senior Lecturer in Chemistry</p>
                <p style={{ color: "rgba(153,246,228,0.35)", fontSize: "0.75rem", marginTop: "0.5rem", lineHeight: 1.6 }}>
                  Department of Chemistry, Faculty of Science, University of Peradeniya
                </p>
                <a href="mailto:manjulaw@sci.pdn.ac.lk" style={{
                  color: "#2dd4bf", fontSize: "0.875rem", marginTop: "0.75rem",
                  display: "inline-block", textDecoration: "none", fontWeight: 500,
                }}>
                  manjulaw@sci.pdn.ac.lk
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */

function Footer() {
  return (
    <footer style={{
      padding: "2.5rem 0", background: "#0f172a",
      textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <WaterDrop className="w-4 h-4" style={{ color: "rgba(20,184,166,0.4)" }} />
        <span style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "1.125rem", fontWeight: 700, color: "rgba(45,212,191,0.6)" }}>
          K.P
        </span>
        <WaterDrop className="w-4 h-4" style={{ color: "rgba(20,184,166,0.4)" }} />
      </div>
      <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
        &copy; {new Date().getFullYear()} Kushlani Pathirana. All rights reserved.
      </p>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   RESPONSIVE STYLES (injected via <style>)
   ═══════════════════════════════════════════ */

function ResponsiveStyles() {
  return (
    <style>{`
      /* Desktop nav - show on lg+ */
      .nav-desktop { display: flex !important; }
      .nav-cta { display: inline-flex !important; }
      .nav-mobile-btn { display: none !important; }
      .nav-mobile-menu { display: none !important; }

      @media (max-width: 1023px) {
        .nav-desktop { display: none !important; }
        .nav-cta { display: none !important; }
        .nav-mobile-btn { display: flex !important; }
        .nav-mobile-menu { display: block !important; }
      }

      /* Stats bar responsive */
      @media (max-width: 640px) {
        .section-container {
          padding-left: 1rem;
          padding-right: 1rem;
        }
      }

      /* Hover effects */
      @media (hover: hover) {
        .magnetic-card:hover {
          transform: translateY(-8px);
          border-color: #99f6e4;
        }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function Home() {
  const cursorRef = useCursorGlow();
  useScrollReveal();

  return (
    <>
      <ResponsiveStyles />
      <LoadingScreen />
      <div ref={cursorRef} className="cursor-glow" style={{ display: "none" }} />
      <main style={{ width: "100%", overflowX: "hidden" }}>
        <Navigation />
        <HeroSection />
        <StatsBar />
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <ResearchSection />
        <PublicationsSection />
        <SkillsSection />
        <ActivitiesSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
