import type { KeyboardEvent } from "react";
import { ChevronRight, Filter, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicSkeleton } from "@/components/ui/DynamicSkeleton";
import { Badge } from "@/components/ui/badge";
import { moodColors } from "@/app/shared/moodColors";
import { standardMoods } from "@/app/shared/moodType";
import { convertDateToThaiDateFormat } from "@/cores/utils/thaiDate";
import type {
  MoodLogEntity,
  MoodLogPageEntity,
} from "../../domain/entities/MoodLogEntity";

interface MoodInsightListProps {
  isListLoading: boolean;
  moodLogPage: MoodLogPageEntity | null;
  isDetailOpen: boolean;
  editingMoodLog: MoodLogEntity | null;
  openEditMoodLogModal: (moodLog: MoodLogEntity) => void;
}

function getMoodConfig(mood: number) {
  return (
    standardMoods.find(
      (moodOption) => String(moodOption.value) === String(mood),
    ) || standardMoods[2]
  );
}

function MoodInsightList({
  isListLoading,
  moodLogPage,
  isDetailOpen,
  editingMoodLog,
  openEditMoodLogModal,
}: MoodInsightListProps) {
  function handleOpenDetail(moodLog: MoodLogEntity) {
    openEditMoodLogModal(moodLog);
  }

  function handleCardKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
    moodLog: MoodLogEntity,
  ) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleOpenDetail(moodLog);
  }

  return (
    <div className="space-y-3">
      {isListLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="bg-[#16161E]/50 border-white/5 rounded-2xl p-4"
            >
              <div className="flex gap-4">
                <DynamicSkeleton width="w-12" height="h-12" rounded="2xl" />
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <DynamicSkeleton width="w-1/3" height="h-4" />
                    <DynamicSkeleton width="w-12" height="h-4" />
                  </div>
                  <DynamicSkeleton width="w-full" height="h-3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : moodLogPage?.items && moodLogPage.items.length > 0 ? (
        moodLogPage.items.map((moodLog) => {
          const moodConfig = getMoodConfig(moodLog.mood);
          const themeColor = moodColors[Number(moodConfig.value)] || "#D1D5DB";
          const isSelected = isDetailOpen && editingMoodLog?.id === moodLog.id;

          return (
            <Card
              key={moodLog.id}
              role="button"
              tabIndex={0}
              onClick={() => handleOpenDetail(moodLog)}
              onKeyDown={(event) => handleCardKeyDown(event, moodLog)}
              className={`group cursor-pointer bg-[#16161E] border-white/5 overflow-hidden transition-all duration-300 rounded-2xl outline-none hover:border-moodly-primary/25 focus-visible:border-moodly-primary/50 focus-visible:ring-2 focus-visible:ring-moodly-primary/20 ${
                isSelected
                  ? "border-moodly-primary/40 ring-2 ring-moodly-primary/15"
                  : ""
              }`}
            >
              <CardContent className="flex gap-3 p-4 sm:gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 relative"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    border: `1px solid ${themeColor}30`,
                  }}
                >
                  <span
                    className="text-lg font-bold relative z-10"
                    style={{ color: themeColor }}
                  >
                    {moodConfig.emoji}
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h5 className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-bold text-white">
                        {moodConfig.label}
                        <span className="text-[10px] text-white/20 font-normal">
                          Level {moodConfig.value}
                        </span>
                      </h5>
                      <p className="text-[10px] text-white/30 font-medium">
                        {convertDateToThaiDateFormat(moodLog.createdAt)}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="mt-1 shrink-0 text-white/20 transition-colors group-hover:text-white/60"
                    />
                  </div>

                  {moodLog.causes && moodLog.causes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {moodLog.causes.map((cause, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-[9px] border-none bg-white/5 px-2 py-0"
                          style={{ color: `${themeColor}CC` }}
                        >
                          # {cause}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {moodLog.note && (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <MessageSquare
                        size={12}
                        className="text-white/20 mt-0.5"
                      />
                      <div
                        className="min-w-0 break-words text-[11px] leading-relaxed text-white/60 italic"
                        dangerouslySetInnerHTML={{ __html: moodLog.note }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <div className="py-20 text-center space-y-3 bg-[#16161E]/30 rounded-3xl border border-dashed border-white/5">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Filter size={20} className="text-white/20" />
          </div>
          <p className="text-sm text-white/40">
            ไม่พบประวัติอารมณ์ในช่วงที่คุณค้นหาครับ
          </p>
        </div>
      )}
    </div>
  );
}

export default MoodInsightList;
