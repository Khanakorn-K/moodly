"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { OverViewDailyMoodEntity } from "../../domain/entities/OverViewEntity";
import { convertDateToShortThaiDateFormat } from "@/cores/utils/thaiDate";
import { moodColors } from "@/app/shared/moodColors";

export const description = "A simple area chart";

const chartConfig = {
  averageMood: {
    label: "อารมณ์เฉลี่ย",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ChartAreaDefaultProps = {
  data: OverViewDailyMoodEntity[];
  startDate: string;
  endDate: string;
  isLoading?: boolean;
  error?: string | null;
};

function getCalculableMoodData(data: OverViewDailyMoodEntity[]) {
  return data.filter((item) => item.averageMood > 0);
}

function getTrendText(data: OverViewDailyMoodEntity[]) {
  const calculableMoodData = getCalculableMoodData(data);

  if (calculableMoodData.length < 2) {
    return "ยังไม่มีข้อมูลพอสำหรับดูแนวโน้ม";
  }

  const firstMood = calculableMoodData[0].averageMood;
  const lastMood = calculableMoodData[calculableMoodData.length - 1].averageMood;
  const diff = Number((lastMood - firstMood).toFixed(1));
  if (diff === 0) return "แนวโน้มอารมณ์ยังคงที่";
  if (diff > 0) return `อารมณ์เฉลี่ยดีขึ้น ${diff} คะแนน`;

  return `อารมณ์เฉลี่ยลดลง ${Math.abs(diff)} คะแนน`;
}

export function ChartAreaDefault({
  data,
  startDate,
  endDate,
  isLoading = false,
  error,
}: ChartAreaDefaultProps) {
  const calculableMoodData = getCalculableMoodData(data);
  const chartData = data.map((item) => ({
    date: item.date,
    averageMood: item.averageMood,
    totalLogs: item.totalLogs,
  }));
  const overallAverage =
    calculableMoodData.length > 0
      ? calculableMoodData.reduce((sum, item) => sum + item.averageMood, 0) /
        calculableMoodData.length
      : 3;

  const moodIndex = Math.round(overallAverage);
  const graphColor = moodColors[moodIndex];
  const hasLogs = calculableMoodData.length > 0;
  const rangeText =
    startDate && endDate
      ? `${convertDateToShortThaiDateFormat(startDate)} - ${convertDateToShortThaiDateFormat(endDate)}`
      : "เลือกช่วงวันที่";

  return (
    <Card className="border-white/10 bg-white/[0.04] text-white">
      <CardHeader>
        <CardTitle>ภาพรวมอารมณ์</CardTitle>
        <CardDescription>{rangeText}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-white/10 text-sm text-white/50">
            กำลังโหลด...
          </div>
        ) : error ? (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-red-400/20 text-sm text-red-200">
            {error}
          </div>
        ) : hasLogs ? (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={convertDateToShortThaiDateFormat}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="averageMood"
                type="natural"
                fill={graphColor}
                fillOpacity={0.4}
                stroke={graphColor}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-white/10 text-sm text-white/50">
            ไม่มีข้อมูลในช่วงวันที่เลือก
          </div>
        )}
      </CardContent>
      <CardFooter className="border-white/10 bg-white/[0.03]">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {getTrendText(data)} <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              จำนวนวันที่มีบันทึก{" "}
              {calculableMoodData.length} วัน
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
