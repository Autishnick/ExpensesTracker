import { User } from "@/lib/api";

interface ProfileHeaderProps {
  currentUser: User;
  subtitle: string;
}

export default function ProfileHeader({ currentUser, subtitle }: ProfileHeaderProps) {
  const initials = currentUser.username.slice(0, 2).toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-xl md:p-8">
      {/* Decorative background glows */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        {/* Avatar display (Emoji or Initials fallback) */}
        {currentUser.avatar ? (
          <div className="flex h-20 w-20 shrink-0 select-none items-center justify-center rounded-2xl bg-accent text-4xl shadow-md border border-border ring-4 ring-primary/15 transition-transform hover:scale-105">
            {currentUser.avatar}
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 select-none items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-indigo-400 text-3xl font-extrabold text-primary-foreground shadow-md ring-4 ring-primary/15 transition-transform hover:scale-105">
            {initials}
          </div>
        )}

        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="text-3xl font-extrabold tracking-tight">{currentUser.username}</h1>
          </div>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
