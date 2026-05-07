import { Card, CardContent } from "@/components/ui/card";
import { DynamicSkeleton } from "@/components/ui/DynamicSkeleton";
import { Badge } from "@/components/ui/badge";
import { Edit2, Filter, MessageSquare, Trash2 } from "lucide-react";
import React from "react";
import { moodsEntity } from "../entity/moodsEntity";
import { moodColors } from "@/app/share/moodColors";
import { standartMoods } from "@/app/share/moodType";
import { convertDateToThaiDateFormat } from "@/cors/utils/thaiDate";

interface MoodInsightListProps {
  isListLoading: boolean;
  moodList: moodsEntity | null;
  openEditModal: (log: any) => void;
  handleDelete: (id: string) => void;
}

const MoodInsightList = ({
  isListLoading,
  moodList,
  openEditModal,
  handleDelete,
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
      ) : moodList?.data && moodList.data.length > 0 ? (
        moodList.data.map((log) => {
          const moodConfig =
            standartMoods.find(
              (standartMoods) =>
                String(standartMoods.value) === String(log.mood) ||
                standartMoods.label === log.mood,
            ) || standartMoods[2];
          const themeColor = moodColors[Number(moodConfig.value)] || "#D1D5DB";

          return (
            <Card
              key={log.id}
              className="group bg-[#16161E] border-white/5 overflow-hidden hover:border-[#FFD166]/20 transition-all duration-300 rounded-2xl"
            >
              <CardContent className="p-4 flex gap-4">
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

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        {moodConfig.label}
                        <span className="text-[10px] text-white/20 font-normal">
                          Level {moodConfig.value}
                        </span>
                      </h5>
                      <p className="text-[10px] text-white/30 font-medium">
                        {convertDateToThaiDateFormat(log.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(log)}
                        className="p-1.5 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-1.5 text-white/20 hover:text-[#EF476F] hover:bg-[#EF476F]/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* ส่วนการแสดง Tag สาเหตุ */}
                  {log.causes && log.causes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {log.causes.map((c, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-[9px] border-none bg-white/5 px-2 py-0"
                          style={{ color: `${themeColor}CC` }}
                        >
                          {/* # {cause}asda */}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {log.note && (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <MessageSquare
                        size={12}
                        className="text-white/20 mt-0.5"
                      />
                      <p className="text-[11px] text-white/60 leading-relaxed italic">
                        {log.note}
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
