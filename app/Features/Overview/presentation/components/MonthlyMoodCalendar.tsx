"use client";

import { CalendarDays } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  MonthlyAverageMoodEntity,
  OverviewDailyCauseDistributionEntity,
} from "../../domain/entities/OverviewEntity";
import { moodColors } from "@/app/shared/moodColors";
import { convertDateToShortThaiDateFormat } from "@/cores/utils/thaiDate";
import Link from "next/link";

type MonthlyMoodCalendarProps = {
  data: MonthlyAverageMoodEntity | null;
  isLoading?: boolean;
  error?: string | null;
};

type CalendarCell = {
  key: string;
  date?: string;
  day?: string;
  averageMood?: number;
  totalLogs?: number;
  causeDistribution?: OverviewDailyCauseDistributionEntity[];
};

const weekdayLabels = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function getMoodColor(averageMood: number) {
  if (averageMood <= 0) return "rgba(255,255,255,0.04)";
  return moodColors[Math.round(averageMood)] ?? moodColors[3];
}

function getMoodTextColor(averageMood: number) {
  if (averageMood <= 0) return "rgba(255,255,255,0.45)";
  return Math.round(averageMood) <= 2 ? "#ffffff" : "#0A0A0F";
}

function createCalendarCells(data: MonthlyAverageMoodEntity): CalendarCell[] {
  const firstDate = new Date(`${data.startDate}T00:00:00.000Z`);
  const leadingEmptyCells = firstDate.getUTCDay();
  const cells: CalendarCell[] = Array.from(
    { length: leadingEmptyCells },
    (_, index) => ({ key: `empty-${index}` }),
  );

  data.dailyMoodAverages.forEach((item) => {
    cells.push({
      key: item.date,
      date: item.date,
      day: String(Number(item.date.split("-")[2])),
      averageMood: item.averageMood,
      totalLogs: item.totalLogs,
      causeDistribution: item.causeDistribution,
    });
  });

  return cells;
}

export function MonthlyMoodCalendar({
  data,
  isLoading = false,
  error,
}: MonthlyMoodCalendarProps) {
  const cells = data ? createCalendarCells(data) : [];
  const monthText = data
    ? `${convertDateToShortThaiDateFormat(data.startDate)} - ${convertDateToShortThaiDateFormat(data.endDate)}`
    : "เลือกเดือน";

  return (
    <Card className="overflow-hidden border-white/10 bg-white/[0.04] text-white">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-white/70" />
              <CardTitle>สีอารมณ์รายวัน</CardTitle>
            </div>
            <CardDescription className="break-words">
              {monthText}
            </CardDescription>
          </div>

          {data && (
            <div className="rounded-lg border border-white/10 bg-[#0A0A0F]/50 px-3 py-2 text-left sm:text-right">
              <p className="text-xs text-white/45">เฉลี่ยทั้งเดือน</p>
              <p className="text-xl font-semibold text-white">
                {data.averageMood}
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        {isLoading ? (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-white/10 text-sm text-white/50">
            กำลังโหลด...
          </div>
        ) : error ? (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-red-400/20 text-sm text-red-200">
            {error}
          </div>
        ) : !data ? (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-white/10 text-sm text-white/50">
            เลือกเดือนเพื่อดูสีอารมณ์รายวัน
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="overflow-x-auto pb-2">
              <div className="grid min-w-[720px] gap-1.5">
                <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-white/45">
                  {weekdayLabels.map((label) => (
                    <div key={label} className="h-6">
                      {label}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {cells.map((cell) => {
                    const averageMood = cell.averageMood ?? 0;
                    const hasDate = Boolean(cell.date);
                    const causeDistribution = cell.causeDistribution ?? [];
                    const causeSummary = causeDistribution
                      .map(({ cause, count }) => `${cause} ${count}`)
                      .join(", ");
                    const cellContent = (
                      <div
                        className="flex min-h-28 flex-col rounded-md border border-white/10 p-2 text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-opacity hover:opacity-70"
                        style={
                          hasDate
                            ? {
                                backgroundColor: getMoodColor(averageMood),
                                color: getMoodTextColor(averageMood),
                              }
                            : {
                                borderColor: "transparent",
                                backgroundColor: "transparent",
                              }
                        }
                        title={
                          cell.date
                            ? `${cell.date}: เฉลี่ย ${averageMood}, ${cell.totalLogs} บันทึก${causeSummary ? `, สาเหตุ ${causeSummary}` : ""}`
                            : undefined
                        }
                      >
                        {hasDate && (
                          <>
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-semibold">{cell.day}</span>
                              <span className="text-[10px] opacity-75">
                                เฉลี่ย {averageMood > 0 ? averageMood : "-"}
                              </span>
                            </div>

                            <div className="mt-2 grid gap-1 border-t border-current/15 pt-1.5">
                              {causeDistribution.length > 0 ? (
                                causeDistribution.map(({ cause, count }) => (
                                  <div
                                    key={cause}
                                    className="flex min-w-0 items-center justify-between gap-1 text-[10px]"
                                  >
                                    <span className="truncate">{cause}</span>
                                    <span className="shrink-0 font-semibold">
                                      {count}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-[10px] opacity-60">
                                  ไม่มีสาเหตุ
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );

                    if (!cell.date) {
                      return <div key={cell.key}>{cellContent}</div>;
                    }

                    return (
                      <Link
                        key={cell.key}
                        href={`/insight?startDate=${cell.date}&endDate=${cell.date}`}
                      >
                        {cellContent}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
              {Object.entries(moodColors).map(([mood, color]) => (
                <div key={mood} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span>Mood {mood}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm border border-white/10 bg-white/[0.04]" />
                <span>ไม่มีบันทึก</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
