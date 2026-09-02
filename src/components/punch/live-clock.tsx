import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function LiveClock() {
  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [secondsStr, setSecondsStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Hours and Minutes
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

      setTimeStr(`${formattedHours}:${minutes}`);
      setSecondsStr(`${seconds} ${ampm}`);

      // Date
      const dFormatted = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      setDateStr(dFormatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 rounded-xl bg-card border border-border/80 shadow-2xs">
      <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-primary mb-1">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        <Clock className="h-3.5 w-3.5" />
        <span>Live System Time (IST)</span>
      </div>

      <div className="flex items-baseline justify-center gap-1.5 font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
        <span>{timeStr || "--:--"}</span>
        <span className="text-base sm:text-lg font-semibold text-muted-foreground">
          {secondsStr || "--"}
        </span>
      </div>

      <p className="text-xs font-medium text-muted-foreground mt-1">
        {dateStr || "Loading date..."}
      </p>
    </div>
  );
}
