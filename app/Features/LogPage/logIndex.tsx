"use client";
import { useEffect, useState } from "react";
import dataSourcesLog from "./services/dataSourcesLog";
import { Button } from "@/components/ui/button";
import { moods, moodStyles, stadartCauses } from "../../share/moodType";

import { Plus, X, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { CausesEntity } from "./entity/causesEntity";

export default function LogIndex() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // --- States สำหรับ Custom Causes ---
  const [myCustomCauses, setMyCustomCauses] = useState<CausesEntity[] | null>(
    [],
  );
  const [newCauseName, setNewCauseName] = useState("");
  const [isAddingCause, setIsAddingCause] = useState(false);

  const activeMood = moods.find((m) => m.label === selectedMood);
  const style = activeMood ? moodStyles[activeMood.color] : null;

  const fetchmyCustomCauses = async () => {
    try {
      const data = await dataSourcesLog.getMyCauses();
      console.log("causes = ", data);
      setMyCustomCauses(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
      setMyCustomCauses([]);
    }
  };

  useEffect(() => {
    fetchmyCustomCauses();
  }, []);

  const handleAddCustomCause = async () => {
    if (!newCauseName.trim()) return;
    setIsAddingCause(true);
    try {
      await dataSourcesLog.addCauses(newCauseName);
      setNewCauseName("");
      fetchmyCustomCauses();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingCause(false);
    }
  };

  const handleDeleteCustomCause = async (id: string) => {
    try {
      const targetCause = myCustomCauses?.find((c) => c.id === id);

      await dataSourcesLog.deleteMyCauses(id);

      setMyCustomCauses((prev) => {
        return prev ? prev.filter((c) => c.id !== id) : [];
      });

      if (targetCause) {
        setSelectedCauses((prev) =>
          prev.filter((name) => name !== targetCause.name),
        );
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const toggleCause = (name: string) => {
    setSelectedCauses((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const allCauses = [
    ...stadartCauses.map((c) => ({
      name: c.label,
      isStandard: true,
    })),
    ...(Array.isArray(myCustomCauses)
      ? myCustomCauses.map((c) => ({
          name: c.name,
          isStandard: false,
        }))
      : []),
  ];

  const handleSubmit = async () => {
    if (!selectedMood) return;
    setIsSubmitting(true);
    try {
      await dataSourcesLog.addMood(selectedMood, selectedCauses, note);

      setSubmitted(true);
      setSelectedMood(null);
      setSelectedCauses([]);
      setNote("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-widest text-white/30 font-light mb-2">
            {today}
          </p>
          <h1 className="text-3xl text-white font-light italic leading-snug">
            วันนี้เป็นยังไงบ้าง?
          </h1>
        </div>

        {/* Mood Selector - โค้ดเดิมของมาสเตอร์ */}
        <p className="text-[11px] uppercase tracking-widest text-white/30 mb-3">
          ระดับอารมณ์
        </p>
        <div className="flex gap-2 mb-2">
          {moods.map((m) => {
            const s = moodStyles[m.color];
            const isActive = selectedMood === m.label;
            return (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.label)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border transition-all duration-200
                  ${isActive ? `${s.border} ${s.bg} -translate-y-1` : "border-white/[0.08] hover:border-white/20 hover:-translate-y-0.5"}`}
              >
                <span
                  className={`text-2xl transition-transform duration-200 ${isActive ? "scale-125" : ""}`}
                >
                  {m.emoji}
                </span>
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? s.text : "text-white/30"}`}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="h-6 mb-2">
          {activeMood && (
            <p className={`text-sm ${style?.text}`}>รู้สึก{activeMood.label}</p>
          )}
        </div>
        <div className="w-full h-px bg-white/[0.06] my-7" />

        {/* Causes Section */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-[11px] uppercase tracking-widest text-white/30">
            สาเหตุ
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                <Plus size={12} /> จัดการสาเหตุ
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#16161e] border-white/10 text-white rounded-3xl max-w-[350px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-light">
                  จัดการสาเหตุส่วนตัว
                </AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="เช่น ออกกำลังกาย, อ่านหนังสือ"
                    value={newCauseName}
                    onChange={(e) => setNewCauseName(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-xl text-sm"
                  />
                  <Button
                    onClick={handleAddCustomCause}
                    disabled={isAddingCause || !newCauseName}
                    className="bg-indigo-500 hover:bg-indigo-600 rounded-xl shrink-0"
                  >
                    {isAddingCause ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "เพิ่ม"
                    )}
                  </Button>
                </div>

                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {myCustomCauses?.map((c, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <span className="text-sm font-light">{c.name}</span>
                      <button
                        onClick={() => handleDeleteCustomCause(c.id)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {myCustomCauses?.length === 0 && (
                    <p className="text-center text-xs text-white/20 py-4">
                      ยังไม่มีสาเหตุส่วนตัว
                    </p>
                  )}
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex flex-wrap gap-2 mb-7">
          {allCauses.map((c, index) => {
            const isActive = selectedCauses.includes(c.name);
            return (
              <button
                key={index}
                onClick={() => toggleCause(c.name)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm transition-all duration-200
                  ${
                    isActive
                      ? `${style?.border ?? "border-indigo-500"} ${style?.bg ?? "bg-indigo-500/10"} ${style?.text ?? "text-indigo-400"}`
                      : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
                  }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Note & Submit - โค้ดเดิม */}
        <p className="text-[11px] uppercase tracking-widest text-white/30 mb-3">
          บันทึกเพิ่มเติม
        </p>
        <textarea
          rows={3}
          placeholder="เขียนอะไรก็ได้..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-white text-sm placeholder-white/20 resize-none outline-none focus:border-white/20 transition-colors duration-200"
        />

        <button
          onClick={handleSubmit}
          disabled={
            !selectedMood || selectedCauses.length === 0 || isSubmitting
          }
          className={`mt-5 w-full py-4 rounded-2xl text-[15px] font-medium transition-all duration-200
    ${
      submitted
        ? "bg-green-500 text-white"
        : selectedMood && selectedCauses.length > 0
          ? `bg-gradient-to-r ${style?.btn} text-white`
          : "bg-white/[0.06] text-white/30"
    }`}
        >
          {submitted
            ? "✓ บันทึกแล้ว"
            : isSubmitting
              ? "กำลังบันทึก..."
              : !selectedMood
                ? "กรุณาเลือกระดับอารมณ์"
                : selectedCauses.length === 0
                  ? "กรุณาเลือกสาเหตุ" // 💡 แสดงข้อความเตือนบนปุ่ม
                  : "บันทึกอารมณ์วันนี้"}
        </button>
      </div>
    </div>
  );
}
