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
import { moods, stadartCauses } from "@/app/share/moodType";
import { Input } from "@/components/ui/input";
import { moodColors } from "@/app/share/moodColors";

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
    mood,
    startDate,
    endDate,
    totalPages,
    handlePageChange,
    handleDelete,
    handleSave,
    openEditModal,
    router,
    handleFilterChange,
    pathname,
    myCustomCauses,
    selectedCauses,
    toggleCause,
  } = useHistory();

  const allCauses = [
    ...stadartCauses.map((c) => ({ name: c.label })),
    ...myCustomCauses.map((c) => ({ name: c.name })),
  ];

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
            <h1 className="text-2xl font-bold text-white tracking-tight font-outfit">
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

        <div className="bg-[#16161E] border border-white/5 rounded-3xl p-5 space-y-5 shadow-xl">
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
                className="bg-black/20 border-white/5 text-white text-xs font-bold"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) =>
                  handleFilterChange({ endDate: e.target.value })
                }
                className="bg-black/20 border-white/5 text-white text-xs font-bold"
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
                className={`px-4 py-1.5 rounded-full text-[11px] border transition-all ${
                  !mood
                    ? "bg-[#FFD166] text-black border-[#FFD166]"
                    : "border-white/10 text-white/40 hover:border-white/20"
                }`}
              >
                ทั้งหมด
              </Button>
              {moods.map((m) => {
                const isActive = mood === String(m.value);
                const mColor = moodColors[m.value as number];
                return (
                  <Button
                    key={m.value}
                    onClick={() =>
                      handleFilterChange({ mood: String(m.value) })
                    }
                    style={
                      isActive
                        ? {
                            backgroundColor: mColor,
                            borderColor: mColor,
                            color: "#000",
                          }
                        : {}
                    }
                    className={`px-4 py-1.5 rounded-full text-[11px] border transition-all ${
                      !isActive
                        ? "border-white/10 text-white/40 hover:border-white/20"
                        : "font-bold"
                    }`}
                  >
                    {m.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {data?.data.map((log) => {
            const moodConfig =
              moods.find(
                (m) =>
                  String(m.value) === String(log.mood) || m.label === log.mood,
              ) || moods[2];

            const themeColor =
              moodColors[Number(moodConfig.value)] || "#D1D5DB";

            return (
              <Card
                key={log.id}
                className="bg-[#16161E] border-white/5 overflow-hidden hover:border-white/10 transition-colors"
              >
                <CardContent className="p-4 flex gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${themeColor}15`,
                      border: `1px solid ${themeColor}30`,
                    }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: themeColor }}
                    >
                      {moodConfig.value}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                          {moodConfig.label} {moodConfig.emoji}
                        </h5>
                        <p className="text-[10px] text-white/30">
                          {new Intl.DateTimeFormat("th-TH", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(log.date))}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(log)}
                          className="text-white/30 hover:text-white transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="text-white/30 hover:text-[#EF476F] transition-colors"
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
                            className="text-[9px] border-none bg-white/5"
                            style={{ color: `${themeColor}CC` }}
                          >
                            {c.cause}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {log.note && (
                      <div className="flex items-start gap-1.5 p-2 rounded-xl bg-black/20 border border-white/5">
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
              className="bg-transparent border-white/10 text-white hover:bg-white/5 rounded-xl"
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
              className="bg-transparent border-white/10 text-white hover:bg-white/5 rounded-xl"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#1E1E2E] border border-white/10 p-6 rounded-3xl w-full max-w-sm space-y-5 shadow-2xl">
            <div className="flex justify-between items-center text-white font-bold">
              <h3>{editItem ? "แก้ไขบันทึก" : "สร้างบันทึกใหม่"}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/30 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex justify-between gap-2">
              {moods.map((m) => {
                const isSelected = editMood === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() => setEditMood(m.value)}
                    style={
                      isSelected
                        ? {
                            backgroundColor: moodColors[m.value as number],
                            color: "#000",
                          }
                        : {}
                    }
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      !isSelected
                        ? "bg-white/5 text-white/30"
                        : "font-black shadow-lg"
                    }`}
                  >
                    {m.value}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {allCauses.map((c, index) => {
                const isActive = selectedCauses.includes(c.name);
                return (
                  <Button
                    key={index}
                    onClick={() => toggleCause(c.name)}
                    className={`px-4 py-2 h-auto rounded-full border text-xs font-medium transition-all duration-300
                  ${isActive ? "bg-white text-black border-white shadow-lg shadow-white/5" : "border-white/[0.08] text-white/40 bg-transparent hover:border-white/20 hover:text-white/70"}`}
                  >
                    {c.name}
                  </Button>
                );
              })}
            </div>
            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white h-28 resize-none focus:outline-none focus:ring-1 focus:ring-white/20"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="บันทึกความรู้สึกของคุณ..."
            />
            <Button
              onClick={handleSave}
              disabled={!editMood || selectedCauses.length === 0}
              className="w-full bg-white hover:bg-white/90 text-black font-bold rounded-2xl h-12 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editItem ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มข้อมูลใหม่"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
