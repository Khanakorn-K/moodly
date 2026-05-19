import { Card, CardContent } from "@/components/ui/card";
import { DynamicSkeleton } from "@/components/ui/DynamicSkeleton";
import { Badge } from "@/components/ui/badge";
import { Edit2, Filter, MessageSquare, Trash2 } from "lucide-react";
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
  openEditMoodLogModal: (moodLog: MoodLogEntity) => void;
  handleDeleteMoodLog: (id: string) => void;
}

const MoodInsightList = ({
  isListLoading,
  moodLogPage,
  openEditMoodLogModal,
  handleDeleteMoodLog,
}: MoodInsightListProps) => {
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
          const moodConfig =
            standardMoods.find(
              (moodOption) =>
                String(moodOption.value) === String(moodLog.mood),
            ) || standardMoods[2];
          const themeColor = moodColors[Number(moodConfig.value)] || "#D1D5DB";

          return (
            <Card
              key={moodLog.id}
              className="group bg-[#16161E] border-white/5 overflow-hidden hover:border-[#FFD166]/20 transition-all duration-300 rounded-2xl"
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
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
                    <div className="flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        onClick={() => openEditMoodLogModal(moodLog)}
                        className="p-1.5 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteMoodLog(moodLog.id)}
                        className="p-1.5 text-white/20 hover:text-[#EF476F] hover:bg-[#EF476F]/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
                      <p className="min-w-0 break-words text-[11px] leading-relaxed text-white/60 italic">
                        {moodLog.note}
                      </p>
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
};

export default MoodInsightList;
