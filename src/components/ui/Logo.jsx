import logoSrc from "../../assets/logo.png";

export default function Logo({ size = 40, rounded = "rounded-2xl", className = "" }) {
  return (
    <img
      src={logoSrc}
      alt="PisoPath"
      width={size}
      height={size}
      className={`${rounded} object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}