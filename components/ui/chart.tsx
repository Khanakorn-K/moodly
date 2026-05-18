"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/cores/lib/utils";

const THEMES = { light: "", dark: ".dark" } as const;

type ChartTheme = keyof typeof THEMES;

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
    theme?: Record<ChartTheme, string>;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line]:stroke-border/40",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color,
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            const variables = colorConfig
              .map(([key, itemConfig]) => {
                const color =
                  itemConfig.theme?.[theme as ChartTheme] || itemConfig.color;

                return color ? `  --color-${key}: ${color};` : null;
              })
              .filter(Boolean)
              .join("\n");

            return `${prefix} [data-chart=${id}] {\n${variables}\n}`;
          })
          .join("\n"),
      }}
    />
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
}: React.ComponentProps<"div"> & {
  active?: boolean;
  payload?: any[];
  indicator?: "dot" | "line";
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "grid min-w-32 gap-1.5 rounded-lg border bg-background px-2.5 py-2 text-xs text-foreground shadow-xl",
        className,
      )}
    >
      {payload.map((item) => {
        const key = String(item.dataKey || item.name || "value");
        const itemConfig = config[key];
        const color =
          item.color || item.stroke || item.fill || `var(--color-${key})`;

        return (
          <div
            key={key}
            className="flex min-w-0 items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  "shrink-0 rounded-[2px]",
                  indicator === "line" ? "h-4 w-1" : "size-2.5",
                )}
                style={{ backgroundColor: color }}
              />
              <span className="truncate text-muted-foreground">
                {itemConfig?.label || item.name || key}
              </span>
            </div>
            <span className="font-mono font-medium tabular-nums">
              {typeof item.value === "number"
                ? item.value.toLocaleString()
                : item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };
