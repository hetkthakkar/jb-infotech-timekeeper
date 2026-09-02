import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fingerprint, ArrowRight, Clock, PlusCircle, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ManualPunchRequest } from "@/services/api";

export type PendingManualPunchesCardProps = {
  requests?: ManualPunchRequest[] | undefined;
  loading?: boolean | undefined;
};

export function PendingManualPunchesCard({
  requests = [],
  loading,
}: PendingManualPunchesCardProps) {
  if (loading) {
    return (
      <Card className="h-full border-border/80 shadow-xs animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-5 w-44 bg-muted rounded" />
          <div className="h-3.5 w-28 bg-muted rounded mt-1.5" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-16 bg-muted/60 rounded-lg" />
          <div className="h-16 bg-muted/60 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-border/80 shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Manual Punch Requests
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Submitted attendance adjustment and regularization requests
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs text-primary gap-1">
            <Link to="/manual-punch">
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="pt-1">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-border/70 rounded-lg bg-muted/10 px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2">
                <CheckCircle2 className="h-5 w-5 opacity-60" />
              </div>
              <p className="text-xs font-semibold text-foreground">No Pending Requests</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
                All manual punch adjustment requests have been reviewed or none are pending.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {requests.slice(0, 3).map((req, i) => {
                const isIN = req.type?.toUpperCase() === "IN";
                return (
                  <div
                    key={req.id || i}
                    className="rounded-lg border border-border/70 bg-card p-3 text-xs shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-[11px] px-1.5 py-0.5 rounded ${
                            isIN
                              ? "bg-emerald-500/15 text-emerald-700"
                              : "bg-blue-500/15 text-blue-700"
                          }`}
                        >
                          {req.type?.toUpperCase()} @ {req.requestedTime}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-medium text-foreground">{req.date}</span>
                      </div>
                      <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 text-[10px] px-1.5 py-0 flex items-center gap-1 font-medium">
                        <Clock className="h-2.5 w-2.5" />
                        {req.status || "Pending"}
                      </Badge>
                    </div>

                    {req.reason ? (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        Reason: <span className="text-foreground">{req.reason}</span>
                      </p>
                    ) : null}

                    {req.appliedOn ? (
                      <p className="text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                        Requested on {req.appliedOn}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </div>

      <div className="px-6 pb-4 pt-2">
        <Button variant="outline" size="sm" asChild className="w-full text-xs h-8 gap-1.5">
          <Link to="/manual-punch">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Request Manual Punch</span>
          </Link>
        </Button>
      </div>
    </Card>
  );
}
