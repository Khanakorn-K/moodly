import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React from "react";

const Causes = ({ topCausesList = [] }: { topCausesList: any[] }) => {
  return (
    <Card className="bg-[#161622] border-white/5 rounded-3xl col-span-2 md:col-span-1 shadow-lg overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold text-white/90">
          สาเหตุหลัก & อารมณ์
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {topCausesList.map((c, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-xs font-semibold text-white/80">
                {c.label}
              </span>
              <span className="text-[10px] text-white/30">พบบ่อย {c.pct}%</span>
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
            ยังไม่มีข้อมูลครับ มาสเตอร์
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Causes;
