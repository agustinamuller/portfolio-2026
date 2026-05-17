// Home, Work, About, Contact pages for portfolio UI kit
// Uses global components from Components.jsx

const Hero = () => (
  <section style={{
    width: "100%", background: "var(--bg-1)", overflow: "hidden",
    display: "flex", justifyContent: "center",
  }}>
    {/* Desktop hero */}
    <img
      src="../../assets/hero.svg"
      alt="agustina müller — product designer"
      className="hero-desktop"
      style={{ width: "100%", height: "auto", display: "block" }}
    />
    {/* Mobile hero */}
    <img
      src="../../assets/hero-mobile.svg"
      alt="agustina müller — product designer"
      className="hero-mobile"
      style={{ width: "100%", height: "auto", display: "none" }}
    />
    <style>{`
      @media (max-width: 600px) {
        .hero-desktop { display: none !important; }
        .hero-mobile  { display: block !important; }
      }
    `}</style>
  </section>
);

const WhatIDo = () => (
  <section style={{
    padding: "12px 16px 121.867px", display: "flex", flexDirection: "column",
    alignItems: "center",
  }}>
    <p style={{
      maxWidth: 560, textAlign: "center", fontSize: 20,
      lineHeight: 1.75, color: "var(--fg-3)", margin: 0, fontWeight: 400,
      fontFamily: '"Neue Montreal", var(--font-sans)',
    }}>
      UX/UI &amp; Product Designer de Argentina.<br/>
      Diseño aplicaciones mobile y plataformas web, conectando necesidades de usuario con objetivos de negocio,<br/>
      con foco en design systems y productos escalables.
    </p>
  </section>
);

const TagStrip = () => null;

const ExploreSection = ({ onOpen }) => {
  const projects = [
    { id: "fitpair", year: "2025", tags: ["FINTECH","MOBILE","B2C"],
      title: "Aumenté la conversión en una experiencia de escaneo facial 3D",
      description: "Diseño de una app B2C para la compra de lentes personalizados, combinando escaneo facial 3D, datos biométricos y gestión de prescripciones médicas en un flujo simple y guiado.",
      video: "../../assets/work-video-1.mp4" },
    { id: "fleet", year: "2024", tags: ["SAAS","B2B","MOBILE"],
      title: "Rediseñé una plataforma de fleet tracking para operadores en terreno",
      description: "Redesign de una app de gestión y seguimiento de flotas para choferes y operarios. Foco en densidad de información y eficiencia en condiciones de baja conectividad." },
    { id: "commerce", year: "2024", tags: ["E-COMMERCE","WEB"],
      title: "Relancé una tienda de moda con un checkout 2x más rápido",
      description: "Rediseño completo de la experiencia de compra y checkout con foco en conversión, reutilización de componentes y una sola estética editorial." },
  ];
  return (
    <section style={{
      padding: "56px 112px 48px", display: "flex", flexDirection: "column",
      gap: 32, alignItems: "center",
    }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 500,
        fontSize: "56px", lineHeight: 0.95,
        letterSpacing: "-0.02em", color: "var(--fg-1)", margin: 0,
        textAlign: "center",
      }}>Explore my work</h2>
      <div style={{
        display: "flex", flexDirection: "column", gap: 48,
        width: "100%", maxWidth: 1056,
      }}>
        {projects.map(p => <WorkCard key={p.id} {...p} onClick={() => onOpen && onOpen(p)} />)}
      </div>
    </section>
  );
};

const StatsList = () => (
  <section style={{padding: "56px 112px", display: "flex", justifyContent: "center"}}>
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24,
      width: "100%", maxWidth: 1056,
    }}>
      {[
        {title: "SERVICES", items: ["Product Design","UX & Strategy","App Design","Web Design","UI & Design Systems","Product & Collaboration"]},
        {title: "EXPERIENCE", items: ["5+ Years","Product Designer","UX/UI Designer"]},
        {title: "INDUSTRY", items: ["Mobile applications","SaaS B2B & B2C","Fintech","E-commerce"]},
      ].map((c, i) => (
        <div key={i} style={{display:"flex", flexDirection:"column", gap: 20}}>
          <div style={{
            color: "var(--color-accent)", fontWeight: 500, fontSize: 16,
            textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.75,
          }}>{c.title}</div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 20, lineHeight: "32px",
            color: "var(--fg-1)", fontWeight: 400, whiteSpace: "pre-line",
          }}>{c.items.join("\n")}</div>
        </div>
      ))}
    </div>
  </section>
);

const HomePage = ({ onNav, onOpen }) => (
  <>
    <Navbar active="home" onNav={onNav} />
    <Hero />
    <WhatIDo />
    <TagStrip />
    <ExploreSection onOpen={onOpen} />
    <StatsList />
    <Footer />
  </>
);

const WorkPage = ({ onNav, onOpen }) => (
  <>
    <Navbar active="work" onNav={onNav} />
    <section style={{padding: "80px 112px 56px", textAlign: "center"}}>
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 500,
        fontSize: "clamp(56px, 10vw, 135px)", lineHeight: 0.95,
        letterSpacing: "-0.02em", margin: 0, color: "var(--fg-1)",
      }}>Work</h1>
      <p style={{marginTop: 16, color: "var(--fg-2)", fontSize: 16, lineHeight: 1.75}}>
        A selection of case studies &mdash; <Ast size={20} /> selected 2021&ndash;2025
      </p>
    </section>
    <ExploreSection onOpen={onOpen} />
    <Footer />
  </>
);

const AboutPage = ({ onNav }) => (
  <>
    <Navbar active="about" onNav={onNav} />
    <section style={{padding: "80px 112px 48px", maxWidth: 1056, margin: "0 auto"}}>
      <div style={{color: "var(--color-accent)", fontSize: 16, fontWeight: 500, textTransform: "uppercase", marginBottom: 16}}>About me</div>
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 500,
        fontSize: 72, lineHeight: 1.05, letterSpacing: "-0.02em",
        color: "var(--fg-1)", margin: 0, maxWidth: 900,
      }}>Hola, soy Agustina <Ast size={56} />&mdash; diseño productos digitales desde Argentina.</h1>
      <p style={{marginTop: 32, fontSize: 18, lineHeight: 1.75, color: "var(--fg-2)", maxWidth: 680}}>
        Product &amp; UX/UI designer con 5+ años de experiencia diseñando apps móviles y plataformas web.
        Trabajo con startups y equipos de producto en SaaS, fintech y e-commerce, con foco en design systems
        y productos escalables.
      </p>
    </section>
    <StatsList />
    <Footer />
  </>
);

const ProjectDetail = ({ project, onNav }) => (
  <>
    <Navbar onNav={onNav} />
    <article style={{padding: "56px 112px", maxWidth: 1056, margin: "0 auto"}}>
      <button onClick={() => onNav("work")} style={{
        border: 0, background: "transparent", color: "var(--fg-2)",
        cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16,
      }}>&larr; all work</button>
      <div style={{display:"flex", gap: 14, alignItems:"center", marginBottom: 12}}>
        <CategoryTag variant="year">{project.year}</CategoryTag>
        {project.tags.map((t, i) => <CategoryTag key={i}>{t}</CategoryTag>)}
      </div>
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 500,
        fontSize: 56, lineHeight: 1.1, letterSpacing: "-0.02em",
        color: "var(--fg-1)", margin: 0,
      }}>{project.title}</h1>
      <p style={{marginTop: 24, fontSize: 18, lineHeight: 1.75, color: "var(--fg-2)", maxWidth: 720}}>{project.description}</p>
      <div style={{
        marginTop: 48, background: "rgb(224,224,224)", aspectRatio: "16/9",
        overflow: "hidden", borderRadius: 2,
      }}>
        {project.video
          ? <video src={project.video} autoPlay loop muted playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          : project.image && <img src={project.image} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        }
      </div>
    </article>
    <Footer />
  </>
);

Object.assign(window, { HomePage, WorkPage, AboutPage, ProjectDetail, Hero, ExploreSection, StatsList });
