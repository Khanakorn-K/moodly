import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Causes = ({ topCausesList = [] }: { topCausesList: any[] }) => {
  return (
    <Card className="overflow-hidden rounded-3xl border-white/5 bg-[#161622] shadow-lg md:col-span-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold text-white/90">
          สาเหตุหลัก & อารมณ์
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {topCausesList.map((c, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <span className="min-w-0 truncate text-xs font-semibold text-white/80">
                {c.label}
              </span>
              <span className="shrink-0 text-[10px] text-white/30">
                พบบ่อย {c.pct}%
              </span>
            </div>
            {/* 💡 Stacked Progress Bar */}
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
              {c.moodBreakdown.map((mb: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    width: `${mb.pct}%`,
                    backgroundColor: mb.color,
                  }}
                  className="h-full transition-all duration-500"
                  title={`Level ${mb.value}: ${Math.round(mb.pct)}%`}
                />
              ))}
            </div>
          </div>
        ))}

        {topCausesList.length === 0 && (
          <p className="text-xs text-white/40 text-center py-4">
            ยังไม่มีข้อมูล
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Causes;
