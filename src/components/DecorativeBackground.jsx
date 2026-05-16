import deco from '../styles/decorations.module.css';

export function DecorativeBackground() {
  return (
    <div className={deco.bg} aria-hidden>
      <span className={deco.orb1} />
      <span className={deco.orb2} />
      <span className={deco.orb3} />
      <span className={deco.garland} />
      <span className={deco.garlandRight} />
      <span className={deco.sparkle} />
      <span className={deco.sparkle2} />
    </div>
  );
}
