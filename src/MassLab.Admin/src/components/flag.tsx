// Minimal inline SVG flags for the language switcher.
export function FlagEN({ className = "h-4 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden>
      <clipPath id="t"><path d="M0 0v30h60V0z" /></clipPath>
      <clipPath id="s"><path d="M30 15h30v15zV15H0v15zH0V0h30zV0h30z" /></clipPath>
      <g clipPath="url(#t)">
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" clipPath="url(#s)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function FlagVI({ className = "h-4 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden>
      <rect width="30" height="20" fill="#DA251D" />
      <polygon
        fill="#FF0"
        points="15,4 16.7,9.2 22.1,9.2 17.7,12.4 19.4,17.6 15,14.4 10.6,17.6 12.3,12.4 7.9,9.2 13.3,9.2"
      />
    </svg>
  );
}

export function Flag({ lang, className }: { lang: "en" | "vi"; className?: string }) {
  return lang === "vi" ? <FlagVI className={className} /> : <FlagEN className={className} />;
}
