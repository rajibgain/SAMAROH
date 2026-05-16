import { DecorativeBackground } from './DecorativeBackground';
import layout from '../styles/decorations.module.css';

export function PageLayout({ children, className = '' }) {
  return (
    <div className={`${layout.pageShell} ${className}`.trim()}>
      <DecorativeBackground />
      <div className={layout.pageContent}>{children}</div>
    </div>
  );
}
