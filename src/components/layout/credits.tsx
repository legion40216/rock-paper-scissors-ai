const linkClass =
  "text-white underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none";

export function Credits() {
  return (
    <p className="text-center text-xs text-white/70">
      Challenge by{" "}
      <a
        href="https://www.frontendmentor.io?ref=challenge"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Frontend Mentor
      </a>
      . Coded by{" "}
      <a
        href="https://github.com/legion40216"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Suleman Lohar
      </a>
      . Powered by <span className="font-bold text-white">SYNAPTIC.js</span>.
    </p>
  );
}
