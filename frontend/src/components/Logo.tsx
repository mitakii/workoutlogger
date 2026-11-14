type LogoProps = {
  className?: string;
};

/** App mark: an olympic weight plate seen face-on. Follows the theme's primary colors. */
const Logo = ({ className = "size-7" }: LogoProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <rect width="64" height="64" rx="14" className="fill-primary" />
    <circle cx="32" cy="32" r="21" className="fill-primary-foreground" />
    <circle cx="32" cy="32" r="15" fill="none" strokeWidth="2" className="stroke-primary" />
    <circle cx="32" cy="32" r="5" className="fill-primary" />
    <rect x="29" y="13.5" width="6" height="4" rx="2" className="fill-primary" />
  </svg>
);

export default Logo;
