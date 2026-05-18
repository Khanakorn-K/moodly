"use client";

import { Button } from "@/components/ui/button";
import { Calendar, X, Filter, RotateCcw } from "lucide-react";
import { standartMoods } from "@/app/shared/moodType";
import { createCauseOptions } from "@/app/shared/causes";
import { Input } from "@/components/ui/input";
import { moodColors } from "@/app/shared/moodColors";

import { useInsight } from "./hooks/useInsight";
import MoodInsightList from "./components/MoodInsightList";
import MoodLogBoard from "./components/MoodLogBoard";

export default function InsightView() {
  const {
    moodLogPage,
    isInitialLoading,
    isListLoading,
    isModalOpen,
    setIsModalOpen,
    editNote,
    setEditNote,
    editMood,
    setEditMood,
    editingMoodLog,
    mood,
    startDate,
    endDate,
    handleDragEnd,
    handleDeleteMoodLog,
    handleSaveMoodLog,
    openEditMoodLogModal,
    router,
    handleFilterChange,
    pathname,
    customCauses,
    selectedCauses,
    toggleCause,
  } = useInsight();

  const allCauses = createCauseOptions(customCauses);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/40 font-medium">
        กำลังโหลดประวัติ
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-6 py-24 pb-24 relative">
      <div className="max-w-[1600px] mx-auto w-full space-y-8">
        <div className="flex justify-between items-end px-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tight font-outfit uppercase">
              Mood Insight
            </h1>

          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(pathname)}
            className="text-white/30 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider"
          >
            <RotateCcw size={14} className="mr-2" /> ล้างค่า
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#16161E]/50 border border-white/5 rounded-[2.5rem] p-6 shadow-2xl backdrop-blur-md">
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase font-black tracking-widest ml-1">
              <Calendar size={12} className="text-[#FFD166]" /> เลือกวัน
            </div>
            <div className="flex gap-3">
              <Input
                type="date"
                value={startDate}
                onChange={(e) =>
                  handleFilterChange({ startDate: e.target.value })
                }
                className="bg-black/40 border-white/5 text-white text-xs font-bold rounded-2xl h-11 focus:ring-1 focus:ring-[#FFD166]/30 [color-scheme:dark]"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) =>
                  handleFilterChange({ endDate: e.target.value })
                }
                className="bg-black/40 border-white/5 text-white text-xs font-bold rounded-2xl h-11 focus:ring-1 focus:ring-[#FFD166]/30 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase font-black tracking-widest ml-1">
              <Filter size={12} className="text-[#FFD166]" /> Mood Filter
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleFilterChange({ mood: null })}
                className={`px-6 py-2 h-11 rounded-2xl text-[11px] font-bold transition-all border ${
                  !mood
                    ? "bg-[#FFD166] text-black border-[#FFD166] shadow-lg shadow-[#FFD166]/10"
                    : "bg-black/20 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                }`}
              >
                ทั้งหมด
              </Button>
              {standartMoods.map((moodOption) => {
                const isActive = mood === String(moodOption.value);
                const mColor = moodColors[moodOption.value as number];
                return (
                  <Button
                    key={moodOption.value}
                    onClick={() =>
                      handleFilterChange({ mood: String(moodOption.value) })
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
                    className={`px-5 py-2 h-11 rounded-2xl text-[11px] font-bold border transition-all ${
                      !isActive
                        ? "bg-black/20 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                        : "shadow-lg"
                    }`}
                  >
                    {moodOption.emoji} {moodOption.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full min-h-[600px]">
          {!mood ? (
            <MoodLogBoard
              handleDragEnd={handleDragEnd}
              moodLogPage={moodLogPage}
              isListLoading={isListLoading}
            />
          ) : (
            <MoodInsightList
              moodLogPage={moodLogPage}
              isListLoading={isListLoading}
              openEditMoodLogModal={openEditMoodLogModal}
              handleDeleteMoodLog={handleDeleteMoodLog}
            />
          )}
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl px-4">
          <div className="bg-[#16161E] border border-white/10 p-8 rounded-[3rem] w-full max-w-md space-y-6 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {editingMoodLog ? "ปรับปรุง" : ""}
                </h3>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                  ปรับปรุงสถานะ
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {standartMoods.map((moodOption) => {
                const isSelected = editMood === moodOption.value;
                const mColor = moodColors[moodOption.value as number];
                return (
                  <button
                    key={moodOption.value}
                    onClick={() => setEditMood(moodOption.value)}
                    style={
                      isSelected
                        ? { backgroundColor: mColor, color: "#000" }
                        : {}
                    }
                    className={`aspect-square rounded-2xl flex items-center justify-center text-lg transition-all transform active:scale-95 ${
                      !isSelected
                        ? "bg-white/5 text-white/20 hover:bg-white/10"
                        : "font-black shadow-xl scale-110"
                    }`}
                  >
                    {moodOption.emoji}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
              {allCauses.map((c, index) => {
                const isActive = selectedCauses.includes(c.name);

                return (
                  <Button
                    key={index}
                    onClick={() => {
                      toggleCause(c.name);
                    }}
                    className={`px-4 py-2 h-auto rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-300
        ${isActive ? "bg-white text-black border-white shadow-xl" : "border-white/5 text-white/30 bg-white/5 hover:border-white/20 hover:text-white"}`}
                  >
                    {c.name}
                  </Button>
                );
              })}
            </div>
            <textarea
              className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-5 text-sm text-white h-36 resize-none focus:outline-none focus:ring-2 focus:ring-white/10 placeholder:text-white/10"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="What's on your mind"
            />
            <Button
              onClick={handleSaveMoodLog}
              disabled={!editMood || selectedCauses.length !== 1}
              className="..."
            >
              {editingMoodLog ? "Confirm Changes" : "Create Entry"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
