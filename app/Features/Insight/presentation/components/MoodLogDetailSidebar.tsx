import type { Dispatch, ReactNode, SetStateAction } from "react";
import { CalendarDays, Clock, Hash, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tiptap from "@/components/ui/Tiptap";
import { createCauseOptions } from "@/app/shared/causes";
import type { CauseEntity } from "@/app/shared/entities/CauseEntity";
import { moodColors } from "@/app/shared/moodColors";
import { standardMoods } from "@/app/shared/moodType";
import { convertDateToThaiDateFormat } from "@/cores/utils/thaiDate";
import type { MoodLogEntity } from "../../domain/entities/MoodLogEntity";

interface MoodLogDetailSidebarProps {
  customCauses: CauseEntity[];
  isOpen: boolean;
  moodLog: MoodLogEntity | null;
  editNote: string;
  setEditNote: (note: string) => void;
  editMood: number | undefined;
  setEditMood: Dispatch<SetStateAction<number | undefined>>;
  selectedCauses: string[];
  toggleCause: (name: string) => void;
  isUpdating: boolean;
  setIsDetailOpen: Dispatch<SetStateAction<boolean>>;
  handleUpdateMoodLog: () => Promise<boolean>;
  handleDeleteMoodLog: (id: string) => Promise<boolean>;
}

type InfoRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function getMoodConfig(mood: number) {
  return (
    standardMoods.find(
      (moodOption) => String(moodOption.value) === String(mood),
    ) || standardMoods[2]
  );
}

function MoodLogDetailSidebar({
  customCauses,
  isOpen,
  moodLog,
  editNote,
  setEditNote,
  editMood,
  setEditMood,
  selectedCauses,
  toggleCause,
  isUpdating,
  setIsDetailOpen,
  handleUpdateMoodLog,
  handleDeleteMoodLog,
}: MoodLogDetailSidebarProps) {
  if (!isOpen || !moodLog) return null;

  const selectedMoodLog = moodLog;
  const allCauses = createCauseOptions(customCauses);
  const moodConfig = getMoodConfig(selectedMoodLog.mood);
  const themeColor = moodColors[Number(moodConfig.value)] || "#D1D5DB";

  async function handleDeleteSelectedMoodLog() {
    const didDelete = await handleDeleteMoodLog(selectedMoodLog.id);
    if (didDelete) setIsDetailOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl"
      onClick={() => setIsDetailOpen(false)}
    >
      <aside
        className="absolute inset-y-0 right-0 flex w-full flex-col border-l border-white/10 bg-[#101017] shadow-[0_0_100px_rgba(0,0,0,0.65)] sm:max-w-[460px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `${themeColor}15`,
                border: `1px solid ${themeColor}35`,
              }}
            >
              <span className="text-xl" style={{ color: themeColor }}>
                {moodConfig.emoji}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-black text-white">
                {moodConfig.label}
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">
                Level {moodConfig.value}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDetailOpen(false)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/35 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/25">
              อารมณ์
            </p>
            <div className="grid grid-cols-5 gap-2">
              {standardMoods.map((moodOption) => {
                const isSelected = editMood === moodOption.value;
                const mColor = moodColors[moodOption.value as number];

                return (
                  <button
                    key={moodOption.value}
                    type="button"
                    onClick={() => setEditMood(moodOption.value)}
                    style={
                      isSelected
                        ? { backgroundColor: mColor, color: "#000" }
                        : {}
                    }
                    className={`flex aspect-square items-center justify-center rounded-2xl text-base transition-all active:scale-95 sm:text-lg ${
                      !isSelected
                        ? "bg-white/5 text-white/25 hover:bg-white/10 hover:text-white"
                        : "scale-105 font-black shadow-xl"
                    }`}
                  >
                    {moodOption.emoji}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/25">
              สาเหตุ
            </p>
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1 scrollbar-hide">
              {allCauses.map((cause, index) => {
                const isActive = selectedCauses.includes(cause.name);

                return (
                  <Button
                    key={`${cause.name}-${index}`}
                    type="button"
                    onClick={() => toggleCause(cause.name)}
                    className={`h-auto rounded-xl border px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? "border-white bg-white text-black shadow-xl"
                        : "border-white/5 bg-white/5 text-white/30 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {cause.name}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/25">
              บันทึก
            </p>
            <Tiptap setText={setEditNote} oldValue={editNote} />
          </div>

          <div className="space-y-3 rounded-2xl border border-white/5 bg-black/30 p-4">
            <InfoRow
              icon={<Hash size={14} />}
              label="Record ID"
              value={selectedMoodLog.id}
            />
            <InfoRow
              icon={<CalendarDays size={14} />}
              label="สร้างเมื่อ"
              value={convertDateToThaiDateFormat(selectedMoodLog.createdAt)}
            />
            <InfoRow
              icon={<Clock size={14} />}
              label="อัปเดตล่าสุด"
              value={convertDateToThaiDateFormat(selectedMoodLog.updatedAt)}
            />
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-white/10 bg-[#101017]/95 p-5 sm:p-6">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteSelectedMoodLog}
            disabled={isUpdating}
            className="h-12 rounded-2xl px-4 font-bold"
          >
            <Trash2 size={16} />
            ลบ
          </Button>
          <Button
            type="button"
            onClick={handleUpdateMoodLog}
            disabled={!editMood || selectedCauses.length !== 1 || isUpdating}
            className="h-12 rounded-2xl bg-white font-bold text-black hover:bg-white/90 disabled:bg-white/5 disabled:text-white/20"
          >
            <Save size={16} />
            {isUpdating ? "กำลังบันทึก" : "บันทึก"}
          </Button>
        </div>
      </aside>
    </div>
  );
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="grid grid-cols-[1.25rem_5.5rem_1fr] items-start gap-3 text-xs">
      <span className="mt-0.5 text-white/20">{icon}</span>
      <span className="font-bold text-white/30">{label}</span>
      <span className="min-w-0 break-all text-right font-medium text-white/60">
        {value}
      </span>
    </div>
  );
}

export default MoodLogDetailSidebar;
