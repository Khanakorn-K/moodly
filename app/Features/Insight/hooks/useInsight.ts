import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dataSourceInsights from "../services/dataSourceInsights";
import { CausesEntity } from "@/app/share/entities/causesEntity";
import { standartMoods } from "@/app/share/moodType";
import { insightEntity, moodsResultEntity } from "../domain/entity/InsightEntity";

export const useInsight = () => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [insightList, setInsightList] = useState<insightEntity | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<moodsResultEntity | null>();
  const [editNote, setEditNote] = useState("");
  const [editMood, setEditMood] = useState<number>();
  const [myCustomCauses, setMyCustomCauses] = useState<CausesEntity[]>([]);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);

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
    router.push(`${pathname}?${params.toString()}`);
  };

  const fetchInsight = async (isInitial: boolean = false) => {
    if (status !== "authenticated") return;

    if (isInitial) {
      setIsInitialLoading(true);
    } else {
      setIsListLoading(true);
    }

    try {
      const entity = await dataSourceInsights.getMoods(
        page,
        limit,
        mood,
        startDate,
        endDate,
      );
      setInsightList(entity);
    } catch (error) {
      console.error(error);
    } finally {
      setIsInitialLoading(false);
      setIsListLoading(false);
    }
  };

  const fetchMyCauses = async () => {
    if (status !== "authenticated") return;
    try {
      const entity = await dataSourceInsights.getMyCauses();
      setMyCustomCauses(entity);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("limit")) {
      updateQueryParams({ page: "1", limit: "10" });
    }
  }, []);

  useEffect(() => {
    fetchMyCauses();
  }, [status]);

  useEffect(() => {
    const isFirstLoad = !insightList;
    fetchInsight(isFirstLoad);
  }, [page, status, mood, startDate, endDate]);

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบบันทึกนี้ใช่หรือไม่?")) return;
    await dataSourceInsights.deleteMood(id);
    fetchInsight();
  };
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const logId = String(active.id);
    const newMoodValue = Number(over.id);

    const previousinsightList = insightList;

    setInsightList((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: prev.data.map((item: any) =>
          String(item.id) === logId ? { ...item, mood: newMoodValue } : item,
        ),
      };
    });

    try {
      const originalLog = previousinsightList?.data.find(
        (item) => String(item.id) === logId,
      );

      await dataSourceInsights.updateMood(logId, {
        mood: newMoodValue,
        note: originalLog?.note || "",
        causes: originalLog?.causes || [],
      });

      // await fetchInsight();
    } catch (error) {
      console.error("อัปเดตพลาดครับ:", error);
      setInsightList(previousinsightList);
      alert("การเชื่อมต่อขัดข้อง!");
    }
  };
  const handleSave = async () => {
    if (!editItem || editMood === undefined) return;
    await dataSourceInsights.updateMood(editItem.id, {
      note: editNote,
      mood: editMood,
      causes: selectedCauses,
    });
    setIsModalOpen(false);
    fetchInsight();
  };

  const toggleCause = (name: string) => {
    setSelectedCauses([name]);
  };

  const openEditModal = (log: moodsResultEntity) => {
    setEditItem(log);
    setEditNote(log.note);
    const moodConfig = standartMoods.find(
      (m: any) => String(m.value) === String(log.mood) || m.label === log.mood,
    );

    setEditMood(moodConfig ? Number(moodConfig.value) : 0);

    setSelectedCauses(log.causes || []);
    setIsModalOpen(true);
  };

  return {
    insightList,
    isInitialLoading,
    isListLoading,
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
    totalPages: insightList?.total ? Math.ceil(insightList.total / limit) : 1,
    updateQueryParams,
    handlePageChange: (p: number) => updateQueryParams({ page: String(p) }),
    handleDelete,
    handleSave,
    openEditModal,
    router,
    pathname,
    toggleCause,
    handleFilterChange,
    myCustomCauses,
    selectedCauses,
    setSelectedCauses,
    handleDragEnd,
  };
};
