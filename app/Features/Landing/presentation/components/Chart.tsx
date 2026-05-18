import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  TooltipItem,
  ActiveElement,
  ChartEvent,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { convertDateToYYMMDD } from "@/cors/utils/thaiDate";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface ChartProps {
  data: {
    label: string;
    heightPercentage: number;
    color: string;
    actualCount: number;
    causes: string[];
    date?: Date;
  }[];
}

const Chart = ({ data }: ChartProps) => {
  const router = useRouter();

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.heightPercentage),
        backgroundColor: data.map((d) => d.color),
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: "easeOutQuart" as const },
    onHover: (event: ChartEvent, chartElement: ActiveElement[]) => {
      const target = event.native?.target as HTMLElement;
      if (target) {
        target.style.cursor = chartElement[0] ? "pointer" : "default";
      }
    },
    onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const moodValue = index + 1;

        // 💡 ดึง Date จากข้อมูลแท่งแรก (เพราะทุกแท่งมี Date เดียวกันจากการเลือกในปฏิทิน)
        const selectedDate = data[0]?.date;

        let url = `/insight?mood=${moodValue}`;

        if (selectedDate) {
          const dateString = convertDateToYYMMDD(selectedDate);

          url += `&startDate=${dateString}&endDate=${dateString}`;
        }

        router.push(url);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#1E1E2E",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            ` บันทึกแล้ว ${data[context.dataIndex].actualCount} ครั้ง`,

          footer: (tooltipItems: TooltipItem<"bar">[]) => {
            const index = tooltipItems[0].dataIndex;
            const causes = data[index].causes;
            if (!causes || causes.length === 0) return "";
            return `\nสาเหตุ: ${causes.join(", ")}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "rgba(255, 255, 255, 0.4)",
          font: { size: 10 },
          autoSkip: false,
        },
        border: { display: false },
      },
      y: {
        display: false,
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="h-24 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Chart;
