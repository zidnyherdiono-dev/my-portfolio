import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { PROJECTS_DATA, type Project } from './data/projects';

// ============================================================
// KOMPONEN IKON (SVG sederhana — tanpa library eksternal)
// ============================================================
const IconChart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /><circle cx="19" cy="6" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
const IconMic = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
  </svg>
);
const IconChip = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </svg>
);
const IconWorkflow = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><path d="M10 6.5h2a2 2 0 0 1 2 2v9M13 15.5l1.5 2 1.5-2" />
  </svg>
);
const IconFolder = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>
);
const IconLinkedIn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z"/></svg>
);
const IconInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
);
const IconGitHub = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.9 10.9 0 0 1 5.75 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.23 2.76.12 3.05.73.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.15c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>
);
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
);

// ============================================================
// OBJEK DATA PROFIL — SEMUA TEKS & GAMBAR ADA DI SINI
// Ubah isi objek ini saja untuk mengganti konten website.
// ============================================================
const PROFILE_DATA = {
  // Nama lengkap
  name: "Zidny Ilman Herdiono",
  // Status / sekolah
  status: "Siswa SMK Telkom Malang",
  className: "Kelas X TKJ 3",
  // Kalimat sambutan (Hero Section)
  greeting: "Halo! Saya seorang pembelajar yang selalu penasaran dengan hal baru dan konsisten mempelajarinya. Mari berkolaborasi!",
  // Deskripsi diri (bagian Profil)
  about: "Seorang siswa yang selalu penasaran dengan hal baru dan konsisten dalam mempelajari hal baru tersebut. Memiliki hobi di bidang olahraga (futsal/sepak bola) serta memiliki ketertarikan mendalam pada bidang ekonomi dan kecerdasan buatan (AI).",
  // Cerita minat (bagian Profil)
  passions: [
    {
      title: "Futsal & Sepak Bola",
      text: "Olahraga mengajarkan kerja sama tim, disiplin, dan semangat pantang menyerah — nilai yang saya bawa juga dalam belajar dan berkarya.",
    },
    {
      title: "Ekonomi & Kecerdasan Buatan",
      text: "Saya senang mengeksplorasi arus pasar ekonomi dan bagaimana otomasi AI dapat meningkatkan efisiensi. Dua bidang ini menurut saya adalah masa depan.",
    },
  ],
  // Daftar keahlian (Skills Section)
  skills: [
    { name: "Ekonomi", desc: "Memahami arus pasar, analisis, dan pengambilan keputusan finansial.", icon: <IconChart /> },
    { name: "Public Speaking", desc: "Menyampaikan ide dengan percaya diri, jelas, dan meyakinkan.", icon: <IconMic /> },
    { name: "Otomasi AI", desc: "Memanfaatkan kecerdasan buatan untuk otomasi tugas dan efisiensi.", icon: <IconChip /> },
    { name: "Memahami Workflow N8N", desc: "Merancang alur kerja otomatis tanpa kode dengan N8N.", icon: <IconWorkflow /> },
  ],
  // ===== GAMBAR =====
  // CARA GANTI KE FOTO ASLI:
  // 1. Taruh file gambar di folder: my-portfolio/public/ (contoh: foto-saya.jpg)
  // 2. Ganti url di bawah menjadi: "/foto-saya.jpg" (diawali garis miring)
  images: {
    profile: "/foto-zidny.jpg",
    futsal: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80&auto=format&fit=crop",
    ekonomi: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80&auto=format&fit=crop",
  },
  // Tombol media sosial (privasi: tanpa email/no. HP/alamat)
  socials: [
    { name: "LinkedIn", icon: <IconLinkedIn />, url: "#" },
    { name: "Instagram", icon: <IconInstagram />, url: "#" },
    { name: "GitHub", icon: <IconGitHub />, url: "#" },
  ],
};

// ============================================================
// HOOK: animasi angka naik (count-up)
// ============================================================
function useCountUp(target: number, duration = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

// ============================================================
// HOOK: animasi muncul saat di-scroll
// ============================================================
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ============================================================
// PROGRESS BAR SCROLL
// ============================================================
function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const on = () => {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      setW(Math.min(1, window.scrollY / max));
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div className="fixed top-0 left-0 h-[3px] z-[60] bg-[#4f57d6]" style={{ width: `${w * 100}%` }} />;
}

// ============================================================
// BOLA AURORA BERWARA (detail dekoratif dari desain RGB backup)
// ============================================================
function AuroraBalls() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[-10rem] right-[-10rem] w-[34rem] h-[34rem] rounded-full blur-[120px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(79,87,214,0.07), transparent 70%)" }}></div>
    </div>
  );
}

// ============================================================
// KOMPONEN: NAVBAR (mengeras saat scroll)
// ============================================================
function Navbar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${solid ? "bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_8px_30px_rgba(15,17,35,0.05)]" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-semibold text-xl tracking-tight">
          <span className="text-[#0b0c0e]">Zidny</span>
          <span className="text-[#8a8f98]">.dev</span>
        </a>
        <div className="flex gap-1 sm:gap-2 text-[13px] font-medium text-[#3d4250]">
          <a href="/#home" className="px-3 py-2 rounded-md hover:text-[#4f57d6] hover:bg-[#4f57d6]/[0.06] transition">Beranda</a>
          <a href="/#about" className="px-3 py-2 rounded-md hover:text-[#4f57d6] hover:bg-[#4f57d6]/[0.06] transition">Profil</a>
          <a href="/#skills" className="px-3 py-2 rounded-md hover:text-[#4f57d6] hover:bg-[#4f57d6]/[0.06] transition">Keahlian</a>
          <a href="/projects" className="px-3 py-2 rounded-md hover:text-[#4f57d6] hover:bg-[#4f57d6]/[0.06] transition">Proyek</a>
          <a href="/#contact" className="px-3 py-2 rounded-md hover:text-[#4f57d6] hover:bg-[#4f57d6]/[0.06] transition">Kontak</a>
          <a href="/admin" className="ml-1 px-4 py-2 rounded-full bg-[#0b0c0e] text-white hover:bg-[#4f57d6] transition">Admin</a>
        </div>
      </div>
    </nav>
  );
}

// ============================================================
// KOMPONEN: HERO — editorial (tipografi raksasa + foto bertumpuk)
// ============================================================
function Hero() {
  const nSkills = useCountUp(PROFILE_DATA.skills.length);
  const nSports = useCountUp(2);
  const nProjects = useCountUp(PROJECTS_DATA.filter((p) => p.status === "published").length);

  // Cahaya lembut mengikuti kursor (interaktif, ala situs premium)
  const [glow, setGlow] = useState({ x: -999, y: -999 });
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setGlow({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <section id="home" className="relative pt-32 pb-24 px-6 overflow-hidden" onMouseMove={onMove}>
      {/* Lapisan latar */}
      <AuroraBalls />
      <div
        className="absolute w-[36rem] h-[36rem] rounded-full blur-[110px] pointer-events-none"
        style={{ left: glow.x - 288, top: glow.y - 288, background: "radial-gradient(circle, rgba(79,87,214,0.09), transparent 70%)" }}
      ></div>
      <div className="absolute inset-0 grid-bg"></div>
      <div className="absolute top-[-12rem] right-[-12rem] w-[42rem] h-[42rem] rounded-full blur-[130px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(79,87,214,0.09), transparent 70%)" }}></div>
      <div className="absolute bottom-[-14rem] left-[-12rem] w-[40rem] h-[40rem] rounded-full blur-[130px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(79,87,214,0.07), transparent 70%)", animationDelay: "-7s" }}></div>
      <div className="absolute inset-0 noise"></div>

      <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        {/* Kolom teks */}
        <div className="flex-1">
          {/* Eyebrow */}
          <div className="animate-fade-up flex items-center gap-3 mb-8">
            <span className="h-[2px] w-10 bg-[#0b0c0e]"></span>
            <span className="text-[12px] font-medium tracking-[0.35em] text-[#6b7280] uppercase">Portofolio — 2026</span>
          </div>

          {/* Nama (ukuran pas, "Ilman Herdiono" animasi warna RGB) */}
          <h1 className="display text-[clamp(2.5rem,5.2vw,4.25rem)] font-semibold leading-[1.08] text-[#0b0c0e] animate-fade-up">
            Zidny <span className="text-rgb">Ilman Herdiono</span>
          </h1>

          <p className="animate-fade-up delay-3 mt-8 text-lg text-[#4d5260] max-w-lg leading-relaxed">
            {PROFILE_DATA.greeting}
          </p>

          <div className="animate-fade-up delay-3 mt-9 flex flex-wrap items-center gap-6">
            <a href="#contact" className="group inline-flex items-center gap-2 px-8 py-4 rounded-full grad-flow-bg text-white font-medium shadow-[0_16px_40px_rgba(79,87,214,0.3)] hover:shadow-[0_20px_56px_rgba(79,87,214,0.42)] hover:-translate-y-0.5 transition btn-glow">
              Hubungi Saya
              <span className="group-hover:translate-x-1 transition">&rarr;</span>
            </a>
            <a href="/projects" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-[1.5px] border-[#111] bg-white/60 text-[#0b0c0e] font-medium hover:border-[#4f57d6] hover:bg-white hover:shadow-[0_12px_32px_rgba(79,87,214,0.14)] hover:-translate-y-0.5 transition">
              Lihat Proyek
              <span className="w-9 h-9 rounded-full border border-black/[0.15] flex items-center justify-center group-hover:bg-[#0b0c0e] group-hover:text-white group-hover:translate-x-1 transition">&rarr;</span>
            </a>
          </div>
        </div>

        {/* Kolom visual: foto bertumpuk + chip melayang + badge melingkar */}
        <div className="animate-fade-up delay-2 relative w-[22rem] lg:w-[26rem] shrink-0">
          {/* Kartu belakang (miring) */}
          <div className="absolute inset-0 rounded-[2.25rem] rotate-[4deg]" style={{ background: "linear-gradient(135deg, #c7d2fe, #ddd6fe)" }}></div>
          <div className="absolute inset-0 rounded-[2.25rem] rotate-[4deg] grid-bg opacity-60"></div>

          {/* Bingkai gradien pelangi berputar (dari desain sebelumnya) */}
          <div className="absolute -inset-2 rounded-[2.5rem] overflow-hidden">
            <div className="absolute inset-[-60%] border-rotate" style={{ background: "conic-gradient(from 0deg, #4f57d6, #7c3aed, #db2777, #0891b2, #4f57d6)" }}></div>
          </div>

          {/* Foto utama (bingkai putih ala polaroid, miring) */}
          <div className="relative z-10 -rotate-[2.5deg] bg-white p-2.5 rounded-[2.25rem] animate-float shadow-[0_30px_80px_rgba(15,17,35,0.16)]">
            {/* GANTI FOTO: PROFILE_DATA.images.profile */}
            <img
              src={PROFILE_DATA.images.profile}
              alt="Foto Profil Zidny Ilman Herdiono"
              className="w-full h-[26rem] object-cover object-center rounded-[1.75rem]"
            />
          </div>

          {/* Chip keahlian — di bawah foto, TIDAK menutupi foto */}
          <div className="relative z-10 mt-7 flex flex-wrap justify-center gap-2.5">
            <span className="px-4 py-2 rounded-full bg-white shadow-[0_10px_28px_rgba(15,17,35,0.1)] text-[13px] font-medium text-[#3d4250] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0b0c0e]"></span> Otomasi AI
            </span>
            <span className="px-4 py-2 rounded-full bg-white shadow-[0_10px_28px_rgba(15,17,35,0.1)] text-[13px] font-medium text-[#3d4250] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0b0c0e]"></span> N8N Workflow
            </span>
            <span className="px-4 py-2 rounded-full bg-white shadow-[0_10px_28px_rgba(15,17,35,0.1)] text-[13px] font-medium text-[#3d4250] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0b0c0e]"></span> Ekonomi
            </span>
          </div>
        </div>
      </div>

      {/* Pita statistik */}
      <div className="relative max-w-6xl mx-auto mt-20 rounded-2xl glass overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4">
        {[
          { n: nSkills, label: "Bidang Keahlian" },
          { n: nSports, label: "Olahraga Aktif" },
          { n: nProjects, label: "Proyek Rilis" },
          { n: "∞", label: "Rasa Penasaran" },
        ].map((s, i) => (
          <div key={s.label} className={`px-7 py-6 ${i > 0 ? "border-l border-black/[0.06]" : ""}`}>
            <p className="text-3xl font-semibold text-[#0b0c0e] tabular-nums">{s.n}+</p>
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#8a8f98] uppercase mt-1.5">{s.label}</p>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// KOMPONEN: MARQUEE KINETIK (teks raksasa outline berjalan)
// ============================================================
function Marquee() {
  const items = [...PROFILE_DATA.skills.map((s) => s.name), "Futsal", "Kecerdasan Buatan"];
  return (
    <div className="relative py-8 border-y border-black/[0.06] overflow-hidden bg-white marquee-mask">
      <div className="marquee-track gap-10 items-center">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex gap-10 items-center">
            {items.map((t, i) => (
              <span key={`${dup}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
                <span className="text-outline text-4xl md:text-5xl font-semibold uppercase tracking-tight">{t}</span>
                <span className="text-[#c3c7d1] text-2xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// KOMPONEN: PROFIL (editorial: kolase foto + daftar bernomor)
// ============================================================
function About() {
  return (
    <section id="about" className="relative py-28 px-6 overflow-hidden">
      <AuroraBalls />
      <div className="absolute top-1/4 right-[-12rem] w-[32rem] h-[32rem] rounded-full blur-[120px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(79,87,214,0.06), transparent 70%)" }}></div>
      <div className="absolute inset-0 noise"></div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header editorial */}
        <div className="flex items-center gap-3 mb-6">
          <span className="h-[2px] w-10 bg-[#0b0c0e]"></span>
          <span className="text-[12px] font-medium tracking-[0.35em] text-[#6b7280] uppercase">01 — Profil</span>
        </div>
        <h2 className="display-md text-[clamp(2.4rem,5.5vw,4.25rem)] font-semibold text-[#0b0c0e] max-w-3xl text-balance">
          Penasaran, Konsisten, <span className="text-rgb">dan Terus Berkembang</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-16 mt-16 items-start">
          {/* Kolase foto */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-full h-full rounded-[2rem] bg-black/[0.05]"></div>
            {/* GANTI GAMBAR: PROFILE_DATA.images.futsal */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(15,17,35,0.14)]">
              <img src={PROFILE_DATA.images.futsal} alt="Futsal & Sepak Bola" className="w-full h-[24rem] object-cover hover:scale-105 transition duration-700" />
            </div>
            {/* GANTI GAMBAR: PROFILE_DATA.images.ekonomi */}
            <div className="absolute -bottom-10 -right-6 w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-[0_20px_50px_rgba(15,17,35,0.2)] rotate-[3deg]">
              <img src={PROFILE_DATA.images.ekonomi} alt="Ekonomi & Kecerdasan Buatan" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Teks + daftar bernomor */}
          <div>
            <p className="text-lg text-[#4d5260] leading-relaxed">{PROFILE_DATA.about}</p>

            <div className="mt-10 space-y-8">
              {PROFILE_DATA.passions.map((p, i) => (
                <div key={p.title} className="group flex gap-6 border-l-2 border-black/[0.1] pl-6 hover:border-[#0b0c0e] transition-colors">
                  <span className="text-[15px] font-semibold text-[#4f57d6] tabular-nums pt-0.5">{`0${i + 1}`}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0b0c0e] tracking-[-0.01em] mb-2">{p.title}</h3>
                    <p className="text-[#4d5260] leading-relaxed">{p.text}</p>
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

// ============================================================
// KOMPONEN: KEAHLIAN (kartu besar bernomor + border gradien hover)
// ============================================================
function Skills() {
  return (
    <section id="skills" className="relative py-28 px-6 overflow-hidden bg-gradient-to-b from-[#f1f2f6] via-[#f7f8fa] to-white">
      <AuroraBalls />
      <div className="absolute inset-0 noise"></div>

      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-[2px] w-10 bg-[#0b0c0e]"></span>
          <span className="text-[12px] font-medium tracking-[0.35em] text-[#6b7280] uppercase">02 — Keahlian</span>
        </div>
        <h2 className="display-md text-[clamp(2.4rem,5.5vw,4.25rem)] font-semibold text-[#0b0c0e] max-w-3xl text-balance">
          Bidang yang Saya <span className="text-rgb">Kembangkan</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 mt-14">
          {PROFILE_DATA.skills.map((s, i) => (
            <div key={s.name} className="reveal group bg-white rounded-[1.75rem] p-9 shadow-[0_10px_40px_rgba(15,17,35,0.06)] hover:shadow-[0_24px_60px_rgba(79,87,214,0.16)] hover:-translate-y-1.5 transition duration-300">
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-[0_12px_28px_rgba(79,87,214,0.35)] group-hover:scale-110 transition" style={{ background: "#0b0c0e" }}>
                  {s.icon}
                </div>
                <span className="text-[42px] leading-none font-semibold text-[#0b0c0e]/[0.07] tabular-nums">{`0${i + 1}`}</span>
              </div>
              <h3 className="text-xl font-semibold text-[#0b0c0e] tracking-[-0.01em] mb-3">{s.name}</h3>
              <p className="text-[15px] text-[#4d5260] leading-relaxed">{s.desc}</p>
              <div className="mt-7 h-[3px] w-12 rounded-full group-hover:w-24 transition-all duration-500" style={{ background: "#0b0c0e" }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// KOMPONEN: PROYEK (kartu proyek published — halaman /projects)
// ============================================================
function Projects() {
  const published = PROJECTS_DATA.filter((p) => p.status === "published");

  return (
    <section id="projects" className="relative py-24 px-6 overflow-hidden">
      <AuroraBalls />
      <div className="absolute inset-0 noise"></div>
      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-[2px] w-10 bg-[#0b0c0e]"></span>
          <span className="text-[12px] font-medium tracking-[0.35em] text-[#6b7280] uppercase">Proyek</span>
        </div>
        <h2 className="display-md text-[clamp(2.2rem,5vw,3.75rem)] font-semibold text-[#0b0c0e] max-w-3xl text-balance">
          Karya yang Pernah <span className="text-rgb">Saya Kerjakan</span>
        </h2>

        {published.length === 0 ? (
          <p className="text-[#8a8f98] mt-10">Proyek akan tampil di sini.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-14">
            {published.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="group block rounded-[1.75rem] bg-white overflow-hidden shadow-[0_10px_40px_rgba(15,17,35,0.07)] hover:shadow-[0_24px_60px_rgba(79,87,214,0.18)] transition duration-300 hover:-translate-y-1.5">
                <div className="relative h-52 overflow-hidden">
                  <img src={p.screenshot} alt={`Screenshot ${p.name}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-medium text-white bg-black/50 backdrop-blur-md">{p.category}</span>
                </div>
                <div className="p-7">
                  <h3 className="text-[19px] font-semibold text-[#0b0c0e] tracking-[-0.01em] mb-2.5 group-hover:text-[#4f57d6] transition">{p.name}</h3>
                  <p className="text-[14px] text-[#4d5260] leading-relaxed line-clamp-2">{p.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {p.tech.slice(0, 3).map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-medium text-[#3d4250] bg-[#4f57d6]/[0.07]">{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// HALAMAN PROYEK (/projects)
// ============================================================
function ProjectsPage() {
  useReveal();
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#0b0c0e]">
      <ScrollProgress />
      <Navbar />
      <main className="pt-24">
        <Projects />
      </main>
      <Footer />
    </div>
  );
}

// ============================================================
// HALAMAN DETAIL PROYEK (/projects/:id)
// ============================================================
function ProjectDetail() {
  const { id } = useParams();
  const project: Project | undefined = PROJECTS_DATA.find((p) => p.id === id);

  if (!project || project.status !== "published") {
    return (
      <div className="min-h-screen bg-[#f7f8fa] text-[#0b0c0e]">
        <Navbar />
        <div className="pt-40 pb-24 px-6 text-center max-w-xl mx-auto">
          <h1 className="display-md text-3xl font-semibold mb-4">Proyek Tidak Tersedia</h1>
          <p className="text-[#4d5260] mb-8">Proyek ini belum dipublikasikan atau tidak ditemukan.</p>
          <Link to="/" className="inline-block px-8 py-3.5 rounded-full bg-[#4f57d6] hover:bg-[#7c3aed] text-white font-medium transition">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#0b0c0e]">
      <ScrollProgress />
      <Navbar />
      <main className="pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/projects" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#4f57d6] hover:text-[#7c3aed] mb-8 transition">
            &larr; Semua Proyek
          </Link>

          <span className="inline-block px-3 py-1 rounded-full bg-[#4f57d6]/[0.08] text-[11px] font-medium text-[#3d4250] mb-5">{project.category}</span>
          <h1 className="display text-4xl md:text-5xl font-semibold mb-6">{project.name}</h1>

          <div className="rounded-[1.75rem] overflow-hidden border border-black/[0.07] mb-10 shadow-[0_30px_80px_rgba(15,17,35,0.12)]">
            <img src={project.screenshot} alt={`Screenshot ${project.name}`} className="w-full" />
          </div>

          <div className="rounded-[1.5rem] bg-white p-8 md:p-10 mb-6 shadow-[0_10px_40px_rgba(15,17,35,0.06)]">
            <h2 className="text-xl font-semibold mb-4 tracking-[-0.01em]">Tentang Proyek</h2>
            <p className="text-[#3d4250] leading-relaxed">{project.description}</p>
          </div>

          <div className="rounded-[1.5rem] bg-white p-8 md:p-10 mb-6 shadow-[0_10px_40px_rgba(15,17,35,0.06)]">
            <h2 className="text-xl font-semibold mb-6 tracking-[-0.01em]">Fitur Utama</h2>
            <ul className="space-y-3">
              {project.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-[#4f57d6] shrink-0"></span>
                  <span className="text-[#3d4250]">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.5rem] bg-white p-8 md:p-10 mb-10 shadow-[0_10px_40px_rgba(15,17,35,0.06)]">
            <h2 className="text-xl font-semibold mb-6 tracking-[-0.01em]">Teknologi</h2>
            <div className="flex flex-wrap gap-2.5">
              {project.tech.map((t) => (
                <span key={t} className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#3d4250] bg-[#4f57d6]/[0.07]">{t}</span>
              ))}
            </div>
          </div>

          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full grad-flow-bg text-white font-medium shadow-[0_16px_40px_rgba(79,87,214,0.3)] hover:-translate-y-0.5 transition btn-glow">
              <IconFolder /> Kunjungi Website
              <span className="group-hover:translate-x-1 transition">&rarr;</span>
            </a>
          )}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// KOMPONEN: KONTAK (pita gradien + form kartu putih)
// ============================================================
function Contact() {
  const [formStatus, setFormStatus] = useState("");

  // Form kontak — mengirim pesan ke backend (POST /api/contact)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setFormStatus("Mengirim...");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          message: formData.get("message"),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setFormStatus("Pesan terkirim! Terima kasih sudah menghubungi saya.");
        form.reset();
      } else {
        setFormStatus(data.error || "Gagal mengirim pesan.");
      }
    } catch {
      setFormStatus("Tidak bisa terhubung ke backend.");
    }
    setTimeout(() => setFormStatus(""), 5000);
  };

  return (
    <section id="contact" className="relative py-28 px-6 overflow-hidden">
      <AuroraBalls />
      <div className="absolute inset-0 noise"></div>

      <div className="relative max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-[2px] w-10 bg-[#0b0c0e]"></span>
          <span className="text-[12px] font-medium tracking-[0.35em] text-[#6b7280] uppercase">03 — Kontak</span>
        </div>
        <h2 className="display-md text-[clamp(2.4rem,5.5vw,4.25rem)] font-semibold text-[#0b0c0e] max-w-3xl text-balance">
          Mari <span className="text-rgb">Terhubung</span>
        </h2>
        <p className="mt-4 text-[#4d5260] max-w-xl">Punya ide kolaborasi atau sekadar ingin menyapa? Kirim pesan melalui formulir di bawah.</p>

        {/* Pita gradien */}
        <div className="mt-12 rounded-[2.25rem] p-1 bg-[#0b0c0e] shadow-[0_30px_80px_rgba(15,17,35,0.18)]">
          <div className="rounded-[2rem] bg-white p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[13px] font-medium text-[#3d4250] mb-2">Nama</label>
                <input type="text" name="name" placeholder="Nama Anda" className="w-full p-4 rounded-xl bg-[#f7f8fa] border border-black/[0.08] text-[#0b0c0e] placeholder:text-[#9aa0ac] focus:border-[#4f57d6] focus:ring-2 focus:ring-[#4f57d6]/20 outline-none transition" required />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#3d4250] mb-2">Pesan</label>
                <textarea name="message" placeholder="Tulis pesan Anda..." rows={5} className="w-full p-4 rounded-xl bg-[#f7f8fa] border border-black/[0.08] text-[#0b0c0e] placeholder:text-[#9aa0ac] focus:border-[#4f57d6] focus:ring-2 focus:ring-[#4f57d6]/20 outline-none transition resize-none" required></textarea>
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl grad-flow-bg text-white font-medium shadow-[0_16px_40px_rgba(79,87,214,0.3)] hover:shadow-[0_20px_56px_rgba(79,87,214,0.45)] transition btn-glow">
                <IconSend /> Kirim Pesan
              </button>
              {formStatus && <p className="text-center text-emerald-600 text-[15px]">{formStatus}</p>}
            </form>

            {/* Media sosial (privasi: tanpa email/no. HP/alamat) */}
            <div className="mt-10 pt-8 border-t border-black/[0.06] text-center">
              <p className="text-[#8a8f98] text-[12px] font-medium mb-5 tracking-[0.25em] uppercase">Temukan saya di</p>
              <div className="flex justify-center gap-4">
                {PROFILE_DATA.socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    title={s.name}
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-[#f7f8fa] border border-black/[0.08] text-[#4d5260] hover:text-white hover:bg-[#4f57d6] hover:border-[#4f57d6] hover:-translate-y-1 transition"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ADMIN — data pesan + tombol publikasi (kunci admin)
// ============================================================
type Message = { id: number; name: string; message: string; createdAt: string };

function Admin({ adminKey }: { adminKey: string }) {
  const [adminMessages, setAdminMessages] = useState<Message[]>([]);
  const [adminError, setAdminError] = useState("");

  // Status tampil = nilai server + "niat terakhir" di localStorage
  const [projStatus, setProjStatus] = useState<Record<string, string>>(
    Object.fromEntries(PROJECTS_DATA.map((p) => [p.id, p.status]))
  );
  const [intent, setIntent] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem("publish-intent") || "{}");
    } catch {
      return {};
    }
  });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmRevert, setConfirmRevert] = useState<string | null>(null);
  const [projNote, setProjNote] = useState("");

  const effStatus = (p: Project) => intent[p.id] ?? projStatus[p.id];

  // Ambil daftar pesan dari backend (GET /api/messages)
  const loadMessages = async () => {
    setAdminError("");
    try {
      const res = await fetch("/api/messages", { headers: { "x-admin-key": adminKey } });
      const data = await res.json();
      if (!data.ok) {
        setAdminMessages([]);
        setAdminError(data.error || "Gagal memuat pesan.");
        return;
      }
      setAdminMessages(data.messages);
    } catch {
      setAdminError("Tidak bisa terhubung ke backend.");
    }
  };

  // Muat status publikasi & pesan terkini dari server (butuh kunci admin)
  useEffect(() => {
    fetch("/api/project-status", { headers: { "x-admin-key": adminKey } })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.status) setProjStatus((prev) => ({ ...prev, ...data.status }));
      })
      .catch(() => {});
    loadMessages();
  }, [adminKey]);

  // Ubah status publikasi proyek (draft/published) via backend
  const togglePublish = async (p: Project) => {
    if (savingId) return;
    const next = effStatus(p) === "published" ? "draft" : "published";
    setSavingId(p.id);
    setProjNote("Menyimpan...");
    try {
      const res = await fetch("/api/project-status", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ id: p.id, status: next }),
      });
      const data = await res.json();
      if (data.ok) {
        setProjStatus((prev) => ({ ...prev, [p.id]: next }));
        const newIntent = { ...intent, [p.id]: next };
        setIntent(newIntent);
        try {
          localStorage.setItem("publish-intent", JSON.stringify(newIntent));
        } catch {
          /* localStorage penuh/di-block — abaikan */
        }
        setProjNote(`Status "${p.name}" -> ${next} TERSIMPAN PERMANEN. Tampil otomatis di website maks ±5 menit.`);
      } else {
        setProjNote(data.error || "Gagal mengubah status.");
      }
    } catch {
      setProjNote("Tidak bisa terhubung ke backend.");
    } finally {
      setSavingId(null);
    }
    setTimeout(() => setProjNote(""), 15000);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#0b0c0e]">
      <ScrollProgress />
      <Navbar />
      <main className="relative pt-28 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 noise"></div>

        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-[2px] w-8 bg-[#0b0c0e]"></span>
                <span className="text-[12px] font-medium tracking-[0.3em] text-[#6b7280] uppercase">Admin</span>
              </div>
              <h1 className="display-md text-4xl font-semibold">Panel Admin</h1>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem("admin-key");
                location.reload();
              }}
              className="px-5 py-2.5 rounded-full bg-white border border-black/[0.08] text-[#3d4250] text-[13px] font-medium shadow-sm hover:border-[#4f57d6] hover:text-[#4f57d6] transition"
            >
              Keluar
            </button>
          </div>

          {adminError && <p className="text-red-500 mb-6">{adminError}</p>}

          {/* Status publikasi proyek */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-5 tracking-[-0.01em]">Status Publikasi Proyek</h2>
            <div className="space-y-3">
              {PROJECTS_DATA.map((p) => (
                <div key={p.id} className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,17,35,0.05)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#0b0c0e]">{p.name}</p>
                      <p className={`text-[12px] font-medium mt-0.5 ${effStatus(p) === "published" ? "text-emerald-600" : "text-amber-600"}`}>
                        {effStatus(p) === "published" ? "Published — tampil publik" : "Draft — belum tampil"}
                      </p>
                    </div>
                    {effStatus(p) === "published" ? (
                      <button
                        onClick={() => {
                          if (confirmRevert === p.id) {
                            setConfirmRevert(null);
                            togglePublish(p);
                          } else {
                            setConfirmRevert(p.id);
                            setTimeout(() => setConfirmRevert((c) => (c === p.id ? null : c)), 5000);
                          }
                        }}
                        disabled={savingId !== null}
                        className="px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-amber-500 hover:bg-amber-600 transition shrink-0 disabled:opacity-60 disabled:cursor-wait"
                      >
                        {savingId === p.id ? "Menyimpan..." : confirmRevert === p.id ? "Yakin? Klik lagi untuk batalkan" : "Kembalikan ke Draft"}
                      </button>
                    ) : (
                      <button
                        onClick={() => togglePublish(p)}
                        disabled={savingId !== null}
                        className="px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-[#4f57d6] hover:bg-[#7c3aed] transition shrink-0 disabled:opacity-60 disabled:cursor-wait"
                      >
                        {savingId === p.id ? "Menyimpan..." : "Publikasikan"}
                      </button>
                    )}
                  </div>
                  {intent[p.id] && (
                    <p className="text-[12px] text-[#4f57d6] mt-2">
                      ✓ Tersimpan permanen — diterapkan otomatis ke website maks ±5 menit. Refresh tidak mengubah status ini.
                    </p>
                  )}
                </div>
              ))}
            </div>
            {projNote && <p className="text-[#4f57d6] text-[14px] mt-4">{projNote}</p>}
          </div>

          {/* Pesan masuk */}
          <div>
            <h2 className="text-xl font-semibold mb-5 tracking-[-0.01em]">Pesan Masuk</h2>
            <div className="space-y-3">
              {adminMessages.length === 0 && !adminError && (
                <p className="text-[#8a8f98] text-[14px]">Belum ada pesan.</p>
              )}
              {adminMessages.map((m) => (
                <div key={m.id} className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,17,35,0.05)]">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-medium text-[#0b0c0e]">{m.name}</span>
                    <span className="text-[12px] text-[#8a8f98]">{new Date(m.createdAt).toLocaleString("id-ID")}</span>
                  </div>
                  <p className="text-[14px] text-[#3d4250]">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// HALAMAN ADMIN (/admin) — terkunci kunci admin
// ============================================================
function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>(() => sessionStorage.getItem("admin-key") || "");
  const [authed, setAuthed] = useState<boolean>(() => !!sessionStorage.getItem("admin-key"));
  const [checking, setChecking] = useState(false);
  const [loginError, setLoginError] = useState("");

  const doLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChecking(true);
    setLoginError("");
    try {
      const res = await fetch("/api/messages", { headers: { "x-admin-key": adminKey } });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem("admin-key", adminKey);
        setAuthed(true);
      } else {
        setLoginError(data.error || "Kunci admin salah.");
      }
    } catch {
      setLoginError("Tidak bisa terhubung ke server.");
    } finally {
      setChecking(false);
    }
  };

  if (authed) return <Admin adminKey={adminKey} />;

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-8rem] left-[-8rem] w-[30rem] h-[30rem] rounded-full blur-[120px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(79,87,214,0.14), transparent 70%)" }}></div>
      <div className="absolute bottom-[-8rem] right-[-8rem] w-[30rem] h-[30rem] rounded-full blur-[120px] animate-aurora" style={{ background: "radial-gradient(circle, rgba(79,87,214,0.06), transparent 70%)", animationDelay: "-6s" }}></div>
      <div className="absolute inset-0 noise"></div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <p className="text-2xl font-semibold tracking-tight">
            <span className="text-[#0b0c0e]">Zidny</span>
            <span className="text-[#8a8f98]">.dev</span>
          </p>
          <p className="text-[#4d5260] text-[14px] mt-2">Halaman Admin — khusus pemilik website</p>
        </div>
        <form onSubmit={doLogin} className="rounded-[1.5rem] bg-white p-8 space-y-5 shadow-[0_30px_80px_rgba(15,17,35,0.12)]">
          <div>
            <label className="block text-[13px] font-medium text-[#3d4250] mb-2">Kunci Admin</label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Masukkan kunci admin"
              className="w-full p-4 rounded-xl bg-[#f7f8fa] border border-black/[0.08] text-[#0b0c0e] placeholder:text-[#9aa0ac] focus:border-[#4f57d6] focus:ring-2 focus:ring-[#4f57d6]/20 outline-none transition"
              required
            />
          </div>
          <button type="submit" disabled={checking} className="w-full py-4 rounded-xl grad-flow-bg text-white font-medium shadow-[0_16px_40px_rgba(79,87,214,0.3)] hover:shadow-[0_20px_56px_rgba(79,87,214,0.45)] transition disabled:opacity-60 btn-glow">
            {checking ? "Memeriksa..." : "Masuk"}
          </button>
          {loginError && <p className="text-red-500 text-[14px] text-center">{loginError}</p>}
        </form>
      </div>
    </div>
  );
}

// ============================================================
// KOMPONEN: FOOTER (nama raksasa outline)
// ============================================================
function Footer() {
  return (
    <footer className="relative border-t border-black/[0.06] bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[#8a8f98]">© {new Date().getFullYear()} — Dibuat dengan React & Tailwind CSS</p>
          <a href="/#home" className="text-[13px] font-medium text-[#4f57d6] hover:text-[#7c3aed] transition">Kembali ke atas &uarr;</a>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// HALAMAN BERANDA
// ============================================================
function HomePage() {
  useReveal();
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#0b0c0e]">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}

// ============================================================
// APLIKASI UTAMA — routing
// ============================================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
