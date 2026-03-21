"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Trash2,
  Edit2,
  X,
  Filter,
  RotateCcw,
} from "lucide-react";
import { useHistory } from "./hooks/useHistory";
import { moods } from "@/app/share/moodType";
import { Input } from "@/components/ui/input";

const getColorClasses = (colorName: string) => {
  const map: Record<string, { text: string; bg: string }> = {
    red: { text: "text-red-400", bg: "bg-red-500/10" },
    orange: { text: "text-orange-400", bg: "bg-orange-500/10" },
    yellow: { text: "text-yellow-400", bg: "bg-yellow-500/10" },
    green: { text: "text-green-400", bg: "bg-green-500/10" },
    cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10" },
  };
  return map[colorName] || map.yellow;
};

export default function HistoryIndex() {
  const {
    data,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    editNote,
    setEditNote,
    editMood,
    setEditMood,
    editItem,
    page,
    limit,
    mood,
    startDate,
    endDate,
    totalPages,
    updateQueryParams,
    handlePageChange,
    handleDelete,
    handleSave,
    openEditModal,
    router,
    handleFilterChange,
    pathname,
  } = useHistory();

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40">
        กำลังโหลดประวัติ... มาสเตอร์
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-24 pb-24 relative">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ประวัติอารมณ์
            </h1>
            <p className="text-sm text-white/40">
              บันทึกทั้งหมด {data?.total ?? 0} ครั้ง
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(pathname)}
            className="text-white/30 hover:text-white hover:bg-white/5 text-[11px]"
          >
            <RotateCcw size={14} className="mr-1.5" /> ล้างตัวกรอง
          </Button>
        </div>

        <div className="bg-[#16161E] border border-white/5 rounded-3xl p-5 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-wider">
              <Calendar size={12} /> ช่วงวันที่
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) =>
                  handleFilterChange({ startDate: e.target.value })
                }
                className="text-white font-bold"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) =>
                  handleFilterChange({ endDate: e.target.value })
                }
                className="text-white font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-wider">
              <Filter size={12} /> อารมณ์
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleFilterChange({ mood: null })}
                className={`... ${!mood ? "bg-[#FFD166] ..." : "..."}`}
              >
                ทั้งหมด
              </Button>
              {moods.map((m) => (
                <Button
                  key={m.value}
                  onClick={() => handleFilterChange({ mood: m.label })}
                  className={`px-4 py-1.5 rounded-full text-[11px] border transition-all ${mood === m.label ? "bg-white text-black border-white" : "border-white/10 text-white/40 hover:border-white/20"}`}
                >
                  {m.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {data?.data.map((log) => {
            const moodConfig =
              moods.find((m) => m.label === log.mood) || moods[2];
            const colors = getColorClasses(moodConfig.color);

            return (
              <Card
                key={log.id}
                className="bg-[#16161E] border-white/5 overflow-hidden"
              >
                <CardContent className="p-4 flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center shrink-0`}
                  >
                    <span className={`text-lg font-bold ${colors.text}`}>
                      {moodConfig.value}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-white">
                        {moodConfig.label} {moodConfig.emoji}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(log)}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="text-white/40 hover:text-[#EF476F] transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {log.causes && log.causes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {log.causes.map((c) => (
                          <Badge
                            key={c.id}
                            variant="outline"
                            className="text-[9px] border-white/10 text-white/50 bg-white/5"
                          >
                            {c.cause}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {log.note && (
                      <div className="flex items-start gap-1.5 p-2 rounded-lg bg-black/20 border border-white/5">
                        <MessageSquare
                          size={12}
                          className="text-white/20 mt-0.5"
                        />
                        <p className="text-[11px] text-white/60 leading-relaxed">
                          {log.note}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-xs text-white/40">
              หน้า {page} จาก {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1E1E2E] border border-white/10 p-5 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center text-white font-semibold">
              <h3>{editItem ? "แก้ไขบันทึก" : "สร้างบันทึกใหม่"}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex justify-between gap-2">
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setEditMood(String(m.value))}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${editMood === String(m.value) ? "bg-[#06D6A0] text-black font-bold" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
                >
                  {m.value}
                </button>
              ))}
            </div>
            <textarea
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white h-24 resize-none focus:outline-none focus:border-[#06D6A0]"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="เพิ่มโน้ตของคุณ..."
            />
            <Button
              onClick={handleSave}
              className="w-full bg-[#06D6A0] hover:bg-[#06D6A0]/80 text-black font-semibold rounded-xl h-12"
            >
              {editItem ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มข้อมูลใหม่"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
