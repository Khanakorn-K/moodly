"use client";

import { useLog } from "./hooks/useLog";
import { standartMoods, stadartCauses } from "../../share/moodType";
import { moodColors } from "@/app/share/moodColors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Loader2, MessageSquare, Heart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { thaiDate } from "@/utils/thaiDate";

export default function LogIndex() {
  const {
    selectedMood,
    setSelectedMood,
    selectedCauses,
    note,
    setNote,
    isSubmitting,
    submitted,
    myCustomCauses,
    newCauseName,
    setNewCauseName,
    isAddingCause,
    activeMood,
    handleAddCustomCause,
    handleDeleteCustomCause,
    toggleCause,
    handleSubmit,
  } = useLog();

  const themeColor = activeMood ? moodColors[activeMood.value] : "#6366f1";
  const allCauses = [
    ...stadartCauses.map((c) => ({ name: c.label })),
    ...myCustomCauses.map((c) => ({ name: c.name })),
  ];

  const today = thaiDate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-20 pb-32 font-kanit">
      <div className="w-full max-w-md bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 backdrop-blur-3xl relative shadow-2xl">
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: `${themeColor}20` }}
        />

        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Heart
              size={14}
              style={{ color: themeColor }}
              className="animate-pulse"
            />
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
              {today}
            </p>
          </div>
          <h1 className="text-4xl text-white font-bold tracking-tight">
            วันนี้เป็นยังไงบ้าง?
          </h1>
        </header>

        <section className="space-y-4 mb-10">
          <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold ml-1">
            ระดับอารมณ์
          </p>
          <div className="flex gap-2.5">
            {standartMoods.map((standartMoods) => {
              const isActive = selectedMood === standartMoods.value;
              return (
                <Button
                  key={standartMoods.value}
                  onClick={() => setSelectedMood(standartMoods.value)}
                  style={{ borderColor: isActive ? moodColors[standartMoods.value] : "" }}
                  className={`flex-1 flex flex-col items-center gap-2 py-4 h-auto rounded-[1.5rem] border transition-all duration-300
                    ${isActive ? "bg-white/[0.05] -translate-y-2 shadow-lg" : "border-white/[0.05] bg-transparent opacity-50 hover:opacity-100"}`}
                >
                  <span
                    className={`text-3xl transition-transform duration-500 ${isActive ? "scale-110 rotate-6" : ""}`}
                  >
                    {standartMoods.emoji}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${isActive ? "" : "text-white/40"}`}
                    style={{ color: isActive ? moodColors[standartMoods.value] : "" }}
                  >
                    {standartMoods.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-5">
            <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold ml-1">
              สาเหตุที่ทำให้รู้สึกแบบนี้
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="group flex items-center gap-1.5 px-3 py-1.5 h-auto rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/50 hover:text-white transition-all">
                  <Plus
                    size={12}
                    className="group-hover:rotate-90 transition-transform"
                  />
                  จัดการ
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#12121a] border-white/10 text-white rounded-[2rem] max-w-[380px] p-8 shadow-3xl">
                <AlertDialogHeader className="mb-4">
                  <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
                    จัดการสาเหตุ{" "}
                    <span className="text-xs font-normal opacity-40 uppercase tracking-widest">
                      Custom
                    </span>
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="เช่น ออกกำลังกาย..."
                      value={newCauseName}
                      onChange={(e) => setNewCauseName(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-2xl h-12 focus:ring-1 focus:ring-white/20"
                    />
                    <Button
                      onClick={handleAddCustomCause}
                      disabled={isAddingCause || !newCauseName}
                      className="bg-white text-black hover:bg-white/90 rounded-2xl h-12 px-6 font-bold shrink-0"
                    >
                      {isAddingCause ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        "เพิ่ม"
                      )}
                    </Button>
                  </div>
                  <div className="max-h-[250px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {myCustomCauses.map((c) => (
                      <div
                        key={c.id}
                        className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] group"
                      >
                        <span className="text-sm font-medium text-white/80">
                          {c.name}
                        </span>
                        <Button
                          onClick={() => handleDeleteCustomCause(c.id)}
                          className="p-1 h-auto bg-transparent hover:bg-transparent text-white/10 hover:text-red-400 transition-colors"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <AlertDialogCancel className="w-full bg-white/5 border-white/10 rounded-2xl h-12 hover:bg-white/10 hover:text-white mt-2">
                    ปิดหน้าต่าง
                  </AlertDialogCancel>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {allCauses.map((c, index) => {
              const isActive = selectedCauses.includes(c.name);
              return (
                <Button
                  key={index}
                  onClick={() => toggleCause(c.name)}
                  className={`px-5 py-2.5 h-auto rounded-full border text-xs font-medium transition-all duration-300
                  ${isActive ? "bg-white text-black border-white shadow-lg shadow-white/5" : "border-white/[0.08] text-white/40 bg-transparent hover:border-white/20 hover:text-white/70"}`}
                >
                  {c.name}
                </Button>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 ml-1">
            <MessageSquare size={12} className="text-white/20" />
            <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold">
              บันทึกเพิ่มเติม
            </p>
          </div>
          <textarea
            rows={4}
            placeholder="วันนี้เป็นยังไงบ้าง เขียนระบายไว้ตรงนี้ได้นะ..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-[1.5rem] px-5 py-4 text-white text-sm placeholder-white/10 resize-none outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-300"
          />
        </section>

        <Button
          onClick={handleSubmit}
          disabled={
            !selectedMood ||
            selectedCauses.length === 0 ||
            isSubmitting ||
            submitted
          }
          className={`group w-full py-7 h-auto rounded-[1.8rem] text-[15px] font-bold transition-all duration-500 relative overflow-hidden
    ${submitted ? "bg-green-500 text-white" : selectedMood && selectedCauses.length > 0 ? "bg-white text-black hover:scale-[1.02] active:scale-[0.98]" : "bg-white/[0.05] text-white/20 cursor-not-allowed"}`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {submitted ? (
              "✓ บันทึกสำเร็จ"
            ) : isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} /> กำลังบันทึก...
              </>
            ) : !selectedMood ? (
              "เลือกอารมณ์ของคุณก่อน"
            ) : selectedCauses.length === 0 ? (
              "เลือกสาเหตุอย่างน้อย 1 อย่าง"
            ) : (
              "บันทึกอารมณ์วันนี้"
            )}
          </span>
        </Button>
      </div>
    </div>
  );
}
