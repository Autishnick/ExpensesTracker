import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Save, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { EMOJIS } from "@/lib/constants";

interface ProfileEditFormProps {
  newName: string;
  setNewName: (name: string) => void;
  selectedAvatar: string;
  setSelectedAvatar: (avatar: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  error: string | null;
  defaultPlaceholder: string;
}

export default function ProfileEditForm({
  newName,
  setNewName,
  selectedAvatar,
  setSelectedAvatar,
  onSubmit,
  isSaving,
  error,
  defaultPlaceholder,
}: ProfileEditFormProps) {
  const t = useTranslations("profile");

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-sm md:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-bold">{t("editTitle")}</CardTitle>
        </div>
        <CardDescription>{t("editSubtitle")}</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">

          {/* Family Nickname */}
          <div className="space-y-2">
            <Label htmlFor="newName" className="font-semibold text-sm">
              {t("labelNewName")}
            </Label>
            <Input
              id="newName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              placeholder={defaultPlaceholder}
            />
          </div>

          {/* Avatar Emoji Selector */}
          <div className="space-y-2">
            <Label className="font-semibold text-sm">
              {t("labelAvatar")}
            </Label>

            {/* Grid of emojis */}
            <div className="grid grid-cols-6 gap-2 rounded-xl border border-border bg-accent/40 p-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${selectedAvatar === emoji
                      ? "bg-primary text-primary-foreground scale-105 shadow-xs"
                      : "hover:bg-accent bg-transparent"
                    }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-destructive">{error}</p>
          )}

        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSaving || !newName.trim()}
            className="w-full flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("savingButton")}</span>
              </>
            ) : (
              <>
                <Save className="h-4.5 w-4.5" />
                <span>{t("saveButton")}</span>
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
