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
import { Calendar } from "@/components/ui/calendar";
import Tiptap from "@/components/ui/Tiptap";

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
    date,
    setDate,
  } = useLog();

  const themeColor = activeMood ? moodColors[activeMood.value] : "#6366f1";
  const allCauses = createCauseOptions(myCustomCauses);

  return (
    <div className="flex min-h-screen items-stretch justify-center overflow-x-hidden bg-[#0a0a0f] px-3 py-6 pb-28 font-z sm:px-4 md:p-8 md:pb-28 lg:p-12 lg:pt-28">
      <div className="relative my-0 flex w-full max-w-6xl flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.05] bg-white/[0.02] p-4 shadow-2xl backdrop-blur-3xl sm:rounded-[2.25rem] sm:p-6 md:p-8 lg:my-7 lg:min-h-[85vh] lg:rounded-[3rem] lg:p-12">
        <div
          className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full blur-[100px] transition-colors duration-700 sm:h-96 sm:w-96 sm:blur-[120px]"
          style={{ backgroundColor: `${themeColor}20` }}
        />

        <header className="relative z-10 mb-8 flex items-start justify-between sm:mb-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-5xl">
              วันนี้เป็นยังไงบ้าง?
            </h1>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 flex-col gap-8">
          <section className="space-y-5">
            <p className="ml-1 text-xs font-semibold uppercase tracking-widest text-white/30">
              ระดับอารมณ์
            </p>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
              {standardMoods.map((m) => {
                const isActive = selectedMood === m.value;

                return (
                  <button
                    key={m.value}
                    onClick={() => setSelectedMood(m.value)}
                    className={`flex min-w-0 flex-col items-center gap-2 rounded-2xl border px-1 py-4 transition-all duration-300 sm:gap-4 sm:rounded-[2rem] sm:py-6 ${
                      isActive
                        ? "scale-105 border-white/20 bg-white/[0.08]"
                        : "border-white/[0.05] bg-transparent opacity-40 hover:opacity-100"
                    }`}
                  >
                    <span
                      className={`text-2xl transition-transform sm:text-4xl ${
                        isActive ? "animate-bounce" : ""
                      }`}
                    >
                      {m.emoji}
                    </span>

                    <span
                      className="max-w-full truncate text-[9px] font-bold sm:text-[10px]"
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[1.75rem] border border-white/[0.05] bg-white/[0.025] p-5 sm:rounded-[2rem] sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
                  สาเหตุหลักที่ทำให้รู้สึกแบบนี้
                </p>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="group flex h-auto w-fit items-center gap-1.5 rounded-full border border-white/[0.05] bg-white/[0.03] px-4 py-2 text-[10px] text-white/50 transition-all hover:text-white">
                      <Plus
                        size={14}
                        className="transition-transform group-hover:rotate-90"
                      />
                      จัดการสาเหตุ
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[1.75rem] border-white/10 bg-[#12121a] p-5 text-white shadow-3xl sm:max-w-[400px] sm:rounded-[2.5rem] sm:p-8">
                    <AlertDialogHeader className="mb-4">
                      <AlertDialogTitle className="text-2xl font-bold">
                        จัดการสาเหตุ
                      </AlertDialogTitle>
                    </AlertDialogHeader>

                    <div className="space-y-6">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                        <Input
                          placeholder="เช่น ออกกำลังกาย..."
                          value={newCauseName}
                          onChange={(e) => setNewCauseName(e.target.value)}
                          className="h-12 rounded-2xl border-white/10 bg-white/5"
                        />

                        <Button
                          onClick={handleAddCustomCause}
                          disabled={isAddingCause || !newCauseName}
                          className="h-12 rounded-2xl bg-white px-6 font-bold text-black hover:bg-white/90"
                        >
                          {isAddingCause ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            "เพิ่ม"
                          )}
                        </Button>
                      </div>

                      <div className="custom-scrollbar max-h-[200px] space-y-2 overflow-y-auto pr-2">
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
                                  className="min-w-0 rounded-xl border-white/10 bg-white/5 text-sm sm:h-9"
                                />

                                <Button
                                  onClick={() => handleUpdateCustomCause(c.id)}
                                  disabled={
                                    updatingCauseId === c.id ||
                                    !editingCauseName.trim()
                                  }
                                  className="h-9 w-9 shrink-0 rounded-xl bg-white p-0 text-black hover:bg-white/90"
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
                                  className="h-9 w-9 shrink-0 rounded-xl bg-transparent p-0 text-white/30 hover:text-white"
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
                                  onClick={() =>
                                    handleDeleteCustomCause(c.id, c.name)
                                  }
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

                      <AlertDialogCancel className="h-12 w-full rounded-2xl border-white/10 bg-white/5">
                        ปิดหน้าต่าง
                      </AlertDialogCancel>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="custom-scrollbar flex max-h-[260px] flex-wrap gap-2 overflow-y-auto pr-2 sm:max-h-[320px] sm:gap-3">
                {allCauses.map((c, index) => {
                  const isActive = selectedCause === c.name;

                  return (
                    <Button
                      key={index}
                      onClick={() => toggleCause(c.name)}
                      className={`h-auto rounded-2xl border px-4 py-2.5 text-xs font-medium transition-all duration-300 sm:px-6 sm:py-3 ${
                        isActive
                          ? "border-white bg-white text-black shadow-lg"
                          : "border-white/[0.08] bg-transparent text-white/40 hover:border-white/20"
                      }`}
                    >
                      {c.name}
                    </Button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-white/[0.05] bg-white/[0.025] p-5 sm:rounded-[2rem] sm:p-6">
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/30">
                วันที่บันทึก
              </p>

              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if (!newDate || newDate.getTime() === date?.getTime()) {
                    return;
                  }

                  const selectedDate = new Date(newDate);
                  selectedDate.setHours(0, 0, 0, 0);
                  setDate(selectedDate);
                }}
                className="mx-auto max-w-full border-none bg-transparent p-0 text-white [--cell-size:--spacing(6)] sm:[--cell-size:--spacing(7)]"
              />
            </section>
          </div>

          <section className="flex flex-col">
            <div className="mb-4 ml-1 flex items-center gap-2">
              <MessageSquare size={16} className="text-white/20" />
              <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
                บันทึกเพิ่มเติม
              </p>
            </div>

            {/* <textarea
              placeholder="วันนี้เป็นยังไงบ้าง เขียนระบายไว้ตรงนี้ได้นะ..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[220px] w-full resize-none rounded-[1.75rem] border border-white/[0.06] bg-white/[0.03] px-5 py-5 text-base text-white outline-none transition-all placeholder-white/10 focus:border-white/20 focus:bg-white/[0.05] sm:rounded-[2.5rem] sm:px-8 sm:py-6 sm:text-lg"
            /> */}
            <Tiptap setText={setNote} />
          </section>

          <Button
            onClick={handleSubmit}
            disabled={
              !selectedMood || !selectedCause || isSubmitting || submitted
            }
            className={`group h-auto w-full rounded-[1.75rem] py-5 text-base font-bold transition-all duration-500 sm:rounded-[2.5rem] sm:py-8 sm:text-lg ${
              submitted
                ? "bg-green-500 text-white"
                : selectedMood && selectedCause
                  ? "bg-white text-black shadow-xl hover:scale-[1.02]"
                  : "bg-white/[0.05] text-white/20"
            }`}
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
  );
}
