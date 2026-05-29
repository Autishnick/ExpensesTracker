import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface MemberItem {
  name: string;
  total: number;
  count: number;
  share: number;
}

interface MembersContributionProps {
  membersData: MemberItem[];
}

export default function MembersContribution({ membersData }: MembersContributionProps) {
  const t = useTranslations("profile");
  const tGlobal = useTranslations();

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-sm md:col-span-3">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-bold">{t("membersTitle")}</CardTitle>
        </div>
        <CardDescription>{t("membersSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {membersData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Sparkles className="h-8 w-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium">{t("noExpenses")}</p>
            <Link href="/add-expense" className="mt-3">
              <Button size="sm" variant="outline" className="cursor-pointer">
                {tGlobal("dashboard.list.emptyButton")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {membersData.map((member) => (
              <div key={member.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground border border-border">
                      {member.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-foreground">{member.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({tGlobal("analytics.totalTransactions", { count: member.count }).replace(/.*:/, "").trim()})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-foreground">{member.total.toFixed(2)} ₴</span>
                    <span className="text-xs font-semibold text-primary ml-2 bg-primary/10 px-2 py-0.5 rounded-full">
                      {member.share.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Beautiful progress bar */}
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-1000 ease-out"
                    style={{ width: `${member.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
