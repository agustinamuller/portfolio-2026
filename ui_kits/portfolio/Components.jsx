// UI Kit components for Agustina Müller portfolio
// All components exported to window at the bottom

// Arrow diagonal (up-right) — used on secondary/CTA buttons, size≈20
const ArrowDiag = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{flexShrink:0}}>
    <path d="M16.2337 14.6946C16.2552 14.6946 16.6661 14.4486 17.1467 14.1478C17.6274 13.8469 18.0112 13.5829 17.9997 13.561C17.9882 13.5391 17.7573 13.2276 17.4867 12.8687C16.9433 12.148 16.4201 11.1953 16.1882 10.5042C15.4657 8.35033 15.7982 6.11369 17.1095 4.30831L17.4434 3.84855L16.1721 2.57803L15.7519 2.87727C12.9992 4.83781 9.69984 4.61222 6.77471 2.26356C6.58372 2.11018 6.42041 1.99181 6.41178 2.00044C6.33227 2.0799 5.33243 3.71364 5.33267 3.76367C5.33284 3.79984 5.50771 3.94782 5.72125 4.09238C8.08565 5.6934 10.7909 6.21541 12.882 5.47428L13.3836 5.29651L2 16.7144L3.28644 18L14.7065 6.62872L14.4948 7.27456C13.9459 8.94999 14.1707 10.9356 15.1363 12.9375C15.4113 13.5078 16.1523 14.6942 16.2337 14.6946Z" fill={color}/>
  </svg>
);

// Arrow left-to-right (rotated) — used on large primary CTAs, size≈24
const ArrowRight = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
    <path d="M13.0755 22.3939C13.0552 22.4144 12.431 22.5708 11.6886 22.7415C10.9461 22.9121 10.3306 23.0256 10.3207 22.9939C10.3109 22.9622 10.2341 22.4468 10.1501 21.8487C9.98137 20.6477 9.57281 19.2453 9.13624 18.3683C7.77544 15.635 5.33393 13.8252 2.3727 13.3548L1.61863 13.235V10.82L2.30209 10.7053C6.77985 9.95408 9.69913 6.60602 10.2452 1.59563C10.2809 1.26846 10.3235 1.00085 10.3399 1.00085C10.4909 1.00085 12.9932 1.60391 13.0406 1.65168C13.0748 1.68622 13.0493 1.99294 12.9839 2.33315C12.2598 6.10041 10.1865 9.16593 7.49603 10.4477L6.85065 10.7552L22.3809 10.7552V13.2777L6.86036 13.2777L7.67514 13.6905C9.78887 14.7614 11.4624 16.862 12.4479 19.6817C12.7287 20.4849 13.1524 22.3163 13.0755 22.3939Z" fill={color}/>
  </svg>
);

// Keep legacy alias so nothing else breaks
const ArrowGlyph = ArrowDiag;

const Ast = ({ size = 24, style = {} }) => (
  <span style={{
    fontFamily: '"IM Fell English", Georgia, serif',
    fontStyle: 'italic',
    color: 'var(--color-accent)',
    fontSize: size,
    lineHeight: 1,
    ...style,
  }}>*</span>
);

const Button = ({ variant = "primary", size = "md", children, onClick, ...rest }) => {
  const [hovered, setHovered] = React.useState(false);
  const fs = size === "lg" ? 20 : 16;
  const lh = size === "lg" ? "32px" : "28px";
  const pad = size === "lg" ? "8px 16px" : "6px 14px";

  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: pad, borderRadius: 100,
    fontFamily: '"Neue Montreal", var(--font-sans)', fontWeight: 500, fontSize: fs, lineHeight: lh,
    border: "1px solid transparent", cursor: "pointer",
    transition: "all 220ms cubic-bezier(0.2,0.8,0.2,1)",
    whiteSpace: "nowrap", opacity: 1,
  };
  let style = {};
  let arrowColor = "#fafafa";
  if (variant === "primary") {
    style = hovered
      ? { background: "transparent", borderColor: "var(--fg-1)", color: "var(--fg-1)" }
      : { background: "var(--color-accent)", color: "#fafafa", borderColor: "var(--color-accent)" };
    arrowColor = hovered ? "#131316" : "#fafafa";
  } else if (variant === "ghost") {
    style = { background: "transparent", color: "var(--fg-1)", padding: "4px 10px" };
  } else if (variant === "outline") {
    style = { background: "transparent", borderColor: "var(--fg-1)", color: "var(--fg-1)" };
    arrowColor = "#131316";
  }
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...style }} {...rest}>
      {children}
      {variant !== "ghost" && <ArrowDiag size={size === "lg" ? 20 : 16} color={arrowColor} />}
    </button>
  );
};

const Logo = ({ size = 20 }) => (
  <span style={{
    fontFamily: 'var(--font-display)', fontWeight: 500,
    fontSize: size, lineHeight: 1.2, color: 'var(--fg-1)',
    letterSpacing: '-0.01em',
  }}>agustina müller</span>
);

const Navbar = ({ active = "home", onNav }) => (
  <nav style={{
    width: "100%", height: 96, padding: "28px 112px",
    boxSizing: "border-box", background: "var(--bg-1)",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    position: "sticky", top: 0, zIndex: 10,
  }}>
    <a onClick={() => onNav && onNav("home")} style={{cursor:"pointer"}}><Logo/></a>
    <div style={{display:"flex", gap: 32, alignItems:"center"}}>
      <Button variant="ghost" onClick={() => onNav && onNav("work")}>work</Button>
      <Button variant="ghost" onClick={() => onNav && onNav("about")}>about me</Button>
      <Button variant="primary" onClick={() => onNav && onNav("contact")}>let's talk</Button>
    </div>
  </nav>
);

const CategoryTag = ({ children, variant = "category" }) => (
  <span style={{
    fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14,
    color: variant === "year" ? "var(--fg-2)" : "var(--color-accent)",
    letterSpacing: "0.02em", textTransform: "uppercase",
  }}>{children}</span>
);

const IconPill = ({ children }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "10px 16px", border: "1px solid var(--border-1)",
    background: "var(--bg-1)", fontWeight: 500, fontSize: 14,
    color: "var(--fg-1)", lineHeight: "24px",
  }}>
    <Ast size={20} />
    {children}
  </span>
);

const WorkCard = ({ year, tags = [], title, description, image, video, onClick }) => (
  <article style={{
    background: "var(--bg-1)", width: "100%", cursor: "pointer",
  }} onClick={onClick}>
    <div style={{
      background: "rgb(224,224,224)", aspectRatio: "16/9",
      overflow: "hidden", borderRadius: 2,
    }}>
      {video
        ? <video src={video} autoPlay loop muted playsInline style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
          }} />
        : image && <img src={image} alt="" style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transition: "transform 400ms ease",
          }}/>
      }
    </div>
    <div style={{
      padding: "16px 0 0", display: "flex", gap: 32, alignItems: "center",
    }}>
      <div style={{flex:1, display:"flex", flexDirection:"column", gap: 4}}>
        <div style={{display:"flex", gap: 14, alignItems:"center"}}>
          {year && <CategoryTag variant="year">{year}</CategoryTag>}
          {tags.map((t, i) => <CategoryTag key={i}>{t}</CategoryTag>)}
        </div>
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 20,
          lineHeight: 1.4, color: "var(--fg-1)", margin: "4px 0 0",
          letterSpacing: "-0.01em",
        }}>{title}</h3>
        {description && <p style={{
          fontSize: 15, lineHeight: 1.6, color: "var(--fg-2)", margin: 0,
        }}>{description}</p>}
      </div>
      <Button variant="primary">ver proyecto</Button>
    </div>
  </article>
);

const Footer = () => (
  <footer style={{
    padding: "72px 16px 56px", textAlign: "center",
    display: "flex", flexDirection: "column", gap: 24, alignItems: "center",
    background: "var(--bg-1)",
  }}>
    <h2 style={{
      fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 64,
      lineHeight: 1.1, color: "var(--fg-1)", margin: 0, letterSpacing: "-0.02em",
    }}>Let's talk!</h2>
    <div style={{display:"flex", flexDirection:"column", gap: 14, alignItems:"center"}}>
      <a href="mailto:magustinamuller@gmail.com" style={{
        display: "inline-flex", gap: 8, alignItems: "center",
        fontWeight: 500, fontSize: 20, color: "var(--fg-1)",
      }}>
        <ArrowRight size={20} color="#131316" />
        magustinamuller@gmail.com
      </a>
      <a style={{
        display:"inline-flex", padding: 6, cursor:"pointer",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{color:"var(--fg-1)"}}>
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56z"/>
        </svg>
      </a>
    </div>
    <div style={{marginTop: 24, fontSize: 14, color: "var(--fg-3)"}}>
      Agustina Müller © 2025
    </div>
  </footer>
);

Object.assign(window, { ArrowGlyph, Ast, Button, Logo, Navbar, CategoryTag, IconPill, WorkCard, Footer });
