import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dataSoruceHistory from "../services/dataSoruceHistory";
import { moodsEntity, moodsResultEntity } from "../entity/moodsEntity";
import { CausesEntity } from "@/app/share/entities/causesEntity";
import { standartMoods } from "@/app/share/moodType";

export const useHistory = () => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [moodList, setMoodList] = useState<moodsEntity | null>(null);
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

  const fetchHistory = async (isInitial: boolean = false) => {
    if (status !== "authenticated") return;

    if (isInitial) {
      setIsInitialLoading(true);
    } else {
      setIsListLoading(true);
    }

    try {
      const entity = await dataSoruceHistory.getMoods(
        page,
        limit,
        mood,
        startDate,
        endDate,
      );
      setMoodList(entity);
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
      const entity = await dataSoruceHistory.getMyCauses();
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
    const isFirstLoad = !moodList;
    fetchHistory(isFirstLoad);
  }, [page, status, mood, startDate, endDate]);

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบบันทึกนี้ใช่หรือไม่?")) return;
    await dataSoruceHistory.deleteMood(id);
    fetchHistory();
  };
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const logId = String(active.id);
    const newMoodValue = Number(over.id);

    const previousMoodList = moodList;

    setMoodList((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: prev.data.map((item: any) =>
          String(item.id) === logId ? { ...item, mood: newMoodValue } : item,
        ),
      };
    });

    try {
      const originalLog = previousMoodList?.data.find(
        (item) => String(item.id) === logId,
      );

      await dataSoruceHistory.updateMood(logId, {
        mood: newMoodValue,
        note: originalLog?.note || "",
        causes: originalLog?.causes?.map((c: any) => c.cause) || [],
      });

      // await fetchHistory();
    } catch (error) {
      console.error("อัปเดตพลาดครับ:", error);
      setMoodList(previousMoodList);
      alert("การเชื่อมต่อขัดข้อง!");
    }
  };
  const handleSave = async () => {
    if (!editItem || editMood === undefined) return;
    await dataSoruceHistory.updateMood(editItem.id, {
      note: editNote,
      mood: editMood,
      causes: selectedCauses,
    });
    setIsModalOpen(false);
    fetchHistory();
  };

  const toggleCause = (name: string) => {
    setSelectedCauses((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };
  const openEditModal = (log: moodsResultEntity) => {
    setEditItem(log);
    setEditNote(log.note);
    const moodConfig = standartMoods.find(
      (m: any) => String(m.value) === String(log.mood) || m.label === log.mood,
    );

    setEditMood(moodConfig ? Number(moodConfig.value) : 0);

    setSelectedCauses(log.causes ? log.causes.map((c: any) => c.cause) : []);
    setIsModalOpen(true);
  };

  return {
    moodList,
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
    totalPages: moodList?.total ? Math.ceil(moodList.total / limit) : 1,
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
