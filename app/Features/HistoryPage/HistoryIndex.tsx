"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
import dataSoruceHistory from "./services/dataSoruceHistory";
import { moodsEntity } from "./entity/moodsEntity";
import { moodsModelResponseResult } from "./models/moodsModel";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { moods } from "../LogPage/types/moodType";

const MOOD_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  "1": { label: "แย่มาก", color: "#EF476F", bg: "bg-[#EF476F]/10" },
  "2": { label: "ไม่ดี", color: "#F78C6B", bg: "bg-[#F78C6B]/10" },
  "3": { label: "ปกติ", color: "#118AB2", bg: "bg-[#118AB2]/10" },
  "4": { label: "ดี", color: "#06D6A0", bg: "bg-[#06D6A0]/10" },
  "5": { label: "ดีมาก", color: "#06D6A0", bg: "bg-[#06D6A0]/20" },
};

export default function HistoryIndex() {
  const { status } = useSession();
  const [data, setData] = useState<moodsEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<moodsModelResponseResult | null>();
  const [editNote, setEditNote] = useState("");
  const [editMood, setEditMood] = useState<string>("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const mood = searchParams.get("mood") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const updateQueryParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const fetchHistory = async () => {
    if (status !== "authenticated") return;
    setIsLoading(true);
    try {
      const entity = await dataSoruceHistory.getMoods(
        page,
        limit,
        mood,
        startDate,
        endDate,
      );
      setData(entity);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const p = searchParams.get("page");
    const l = searchParams.get("limit");
    if (!p || !l) {
      const params = new URLSearchParams(searchParams.toString());
      if (!p) params.set("page", "1");
      if (!l) params.set("limit", "10");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    fetchHistory();
  }, [page, status, mood, startDate, endDate]);

  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบบันทึกนี้ใช่หรือไม่?")) return;
    try {
      await dataSoruceHistory.deleteMood(id);
      fetchHistory();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      if (editItem) {
        await dataSoruceHistory.updateMood(editItem.id, {
          note: editNote,
          mood: editMood,
        });
      } else {
        await dataSoruceHistory.createMood({ note: editNote, mood: editMood });
      }
      setIsModalOpen(false);
      setEditItem(null);
      fetchHistory();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (log: moodsModelResponseResult) => {
    setEditItem(log);
    setEditNote(log.note || "");
    const moodMap: Record<string, string> = {
      แย่มาก: "1",
      ไม่ดี: "2",
      ปานกลาง: "3",
      ดี: "4",
      ดีมาก: "5",
    };
    const numericMood = moodMap[log.mood] || log.mood;
    setEditMood(numericMood || "3");
    setIsModalOpen(true);
  };

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
              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  updateQueryParams({ startDate: e.target.value })
                }
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FFD166]/50 w-full"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => updateQueryParams({ endDate: e.target.value })}
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FFD166]/50 w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-wider">
              <Filter size={12} /> อารมณ์
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateQueryParams({ mood: null })}
                className={`px-4 py-1.5 rounded-full text-[11px] border transition-all ${!mood ? "bg-[#FFD166] text-black border-[#FFD166]" : "border-white/10 text-white/40 hover:border-white/20"}`}
              >
                ทั้งหมด
              </button>
              {Object.entries(MOOD_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => updateQueryParams({ mood: config.label })}
                  className={`px-4 py-1.5 rounded-full text-[11px] border transition-all ${mood === config.label ? "bg-white text-black border-white" : "border-white/10 text-white/40 hover:border-white/20"}`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {data?.data.map((log) => {
            const moodData = moods.find((m) => m.label === log.mood);

            const moodKey = moodData
              ? String(moodData.value)
              : String(log.mood);

            const config = MOOD_CONFIG[moodKey] || MOOD_CONFIG["3"];
            return (
              <Card
                key={log.id}
                className="bg-[#16161E] border-white/5 overflow-hidden"
              >
                <CardContent className="p-4 flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center shrink-0`}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: config.color }}
                    >
                      {moodKey}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-white">
                        {config.label}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(log)}
                          className="text-white/40 hover:text-white"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="text-white/40 hover:text-[#EF476F]"
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
              <button onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="flex justify-between gap-2">
              {["1", "2", "3", "4", "5"].map((m) => (
                <button
                  key={m}
                  onClick={() => setEditMood(m)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${editMood === m ? "bg-[#06D6A0] text-black font-bold" : "bg-white/5 text-white/50"}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <textarea
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white h-24 resize-none"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="เพิ่มโน้ตของคุณ..."
            />
            <Button
              onClick={handleSave}
              className="w-full bg-[#06D6A0] text-black font-semibold rounded-xl"
            >
              {editItem ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มข้อมูลใหม่"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
