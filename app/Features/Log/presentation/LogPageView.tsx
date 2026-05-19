"use client";

import { standardMoods } from "@/app/shared/moodType";
import { createCauseOptions } from "@/app/shared/causes";
import { moodColors } from "@/app/shared/moodColors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Heart,
  Loader2,
  MessageSquare,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { displayGetCurrentThaiDate } from "@/cores/utils/thaiDate";
import { useLog } from "./hooks/useLog";

export default function LogPageView() {
  const {
    selectedMood,
    setSelectedMood,
    selectedCause,
    note,
    setNote,
    isSubmitting,
    submitted,
    myCustomCauses,
    newCauseName,
    setNewCauseName,
    isAddingCause,
    editingCauseId,
    editingCauseName,
    setEditingCauseName,
    updatingCauseId,
    activeMood,
    errorMessage,
    handleAddCustomCause,
    handleDeleteCustomCause,
    startEditCustomCause,
    cancelEditCustomCause,
    handleUpdateCustomCause,
    toggleCause,
    handleSubmit,
  } = useLog();

  const themeColor = activeMood ? moodColors[activeMood.value] : "#6366f1";
  const allCauses = createCauseOptions(myCustomCauses);

  const today = displayGetCurrentThaiDate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 md:p-8 lg:p-12 font-z overflow-x-hidden">
      <div className="w-full max-w-6xl min-h-[85vh] bg-white/[0.02] border border-white/[0.05] my-7 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl relative shadow-2xl flex flex-col">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: `${themeColor}20` }}
        />

        <header className="mb-10 flex justify-between items-start relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart
                size={16}
                style={{ color: themeColor }}
                className="animate-pulse"
              />
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
                {today}
              </p>
            </div>
            <h1 className="text-3xl md:text-5xl text-white font-bold tracking-tight">
              วันนี้เป็นยังไงบ้าง?
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1 relative z-10">
          <div className="space-y-12">
            <section className="space-y-5">
              <p className="text-xs uppercase tracking-widest text-white/30 font-semibold ml-1">
                ระดับอารมณ์
              </p>
              <div className="grid grid-cols-5 gap-3">
                {standardMoods.map((m) => {
                  const isActive = selectedMood === m.value;
                  return (
                    <button
                      key={m.value}
                      onClick={() => setSelectedMood(m.value)}
                      className={`flex flex-col items-center gap-4 py-6 rounded-[2rem] border transition-all duration-300
                        ${isActive ? "bg-white/[0.08] border-white/20 scale-105" : "border-white/[0.05] bg-transparent opacity-40 hover:opacity-100"}`}
                    >
                      <span
                        className={`text-4xl transition-transform ${isActive ? "animate-bounce" : ""}`}
                      >
                        {m.emoji}
                      </span>
                      <span
                        className="text-[10px] font-bold"
                        style={{
                          color: isActive ? moodColors[m.value] : "#666",
                        }}
                      >
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex justify-between items-center">
                <p className="text-xs uppercase tracking-widest text-white/30 font-semibold ml-1">
                  สาเหตุหลักที่ทำให้รู้สึกแบบนี้
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="group flex items-center gap-1.5 px-4 py-2 h-auto rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/50 hover:text-white transition-all">
                      <Plus
                        size={14}
                        className="group-hover:rotate-90 transition-transform"
                      />
                      จัดการสาเหตุ
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#12121a] border-white/10 text-white rounded-[2.5rem] max-w-[400px] p-8 shadow-3xl">
                    <AlertDialogHeader className="mb-4">
                      <AlertDialogTitle className="text-2xl font-bold">
                        จัดการสาเหตุ
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-6">
                      <div className="flex gap-2">
                        <Input
                          placeholder="เช่น ออกกำลังกาย..."
                          value={newCauseName}
                          onChange={(e) => setNewCauseName(e.target.value)}
                          className="bg-white/5 border-white/10 rounded-2xl h-12"
                        />
                        <Button
                          onClick={handleAddCustomCause}
                          disabled={isAddingCause || !newCauseName}
                          className="bg-white text-black hover:bg-white/90 rounded-2xl h-12 px-6 font-bold"
                        >
                          {isAddingCause ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            "เพิ่ม"
                          )}
                        </Button>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {myCustomCauses.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between gap-2 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4"
                          >
                            {editingCauseId === c.id ? (
                              <>
                                <Input
                                  value={editingCauseName}
                                  onChange={(e) =>
                                    setEditingCauseName(e.target.value)
                                  }
                                  className="h-9 rounded-xl border-white/10 bg-white/5 text-sm"
                                />
                                <Button
                                  onClick={() => handleUpdateCustomCause(c.id)}
                                  disabled={
                                    updatingCauseId === c.id ||
                                    !editingCauseName.trim()
                                  }
                                  className="h-9 w-9 rounded-xl bg-white p-0 text-black hover:bg-white/90"
                                >
                                  {updatingCauseId === c.id ? (
                                    <Loader2
                                      className="animate-spin"
                                      size={16}
                                    />
                                  ) : (
                                    <Check size={16} />
                                  )}
                                </Button>
                                <Button
                                  onClick={cancelEditCustomCause}
                                  className="h-9 w-9 rounded-xl bg-transparent p-0 text-white/30 hover:text-white"
                                >
                                  <X size={16} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <span className="min-w-0 flex-1 truncate text-sm font-medium text-white/80">
                                  {c.name}
                                </span>
                                <Button
                                  onClick={() =>
                                    startEditCustomCause(c.id, c.name)
                                  }
                                  className="h-8 w-8 rounded-xl bg-transparent p-0 text-white/20 hover:text-white"
                                >
                                  <Pencil size={15} />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteCustomCause(c.id,c.name)}
                                  className="h-8 w-8 rounded-xl bg-transparent p-0 text-white/10 hover:text-red-400"
                                >
                                  <X size={16} />
                                </Button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                      {errorMessage && (
                        <p className="text-xs text-red-300">{errorMessage}</p>
                      )}
                      <AlertDialogCancel className="w-full bg-white/5 border-white/10 rounded-2xl h-12">
                        ปิดหน้าต่าง
                      </AlertDialogCancel>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex flex-wrap gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {allCauses.map((c, index) => {
                  const isActive = selectedCause === c.name;
                  return (
                    <Button
                      key={index}
                      onClick={() => toggleCause(c.name)}
                      className={`px-6 py-3 h-auto rounded-2xl border text-xs font-medium transition-all duration-300
                      ${isActive ? "bg-white text-black border-white shadow-lg" : "border-white/[0.08] text-white/40 bg-transparent hover:border-white/20"}`}
                    >
                      {c.name}
                    </Button>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="flex flex-col space-y-8">
            <section className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4 ml-1">
                <MessageSquare size={16} className="text-white/20" />
                <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">
                  บันทึกเพิ่มเติม
                </p>
              </div>
              <textarea
                placeholder="วันนี้เป็นยังไงบ้าง เขียนระบายไว้ตรงนี้ได้นะ..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full flex-1 min-h-[250px] bg-white/[0.03] border border-white/[0.06] rounded-[2.5rem] px-8 py-6 text-white text-lg placeholder-white/10 resize-none outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
              />
            </section>

            <Button
              onClick={handleSubmit}
              disabled={
                !selectedMood || !selectedCause || isSubmitting || submitted
              }
              className={`group w-full py-8 h-auto rounded-[2.5rem] text-lg font-bold transition-all duration-500
                ${submitted ? "bg-green-500 text-white" : selectedMood && selectedCause ? "bg-white text-black hover:scale-[1.02] shadow-xl" : "bg-white/[0.05] text-white/20"}`}
            >
              {submitted
                ? "✓ บันทึกสำเร็จ"
                : isSubmitting
                  ? "กำลังบันทึก..."
                  : "บันทึกอารมณ์วันนี้"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
