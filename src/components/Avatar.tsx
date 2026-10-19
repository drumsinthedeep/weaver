interface AvatarProps {
  name: string;
  avatarUrl?: string;
  accentColor: string;
  size: number;
  className?: string;
}

export default function Avatar({ name, avatarUrl, accentColor, size, className = '' }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const style = { width: size, height: size };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        style={style}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      style={{ ...style, backgroundColor: accentColor, fontSize: size * 0.5 }}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
    >
      {initial}
    </span>
  );
}
