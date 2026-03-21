import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dataSoruceHistory from "../services/dataSoruceHistory";
import { moodsEntity, moodsResultEntity } from "../entity/moodsEntity";
import { moods } from "../../../share/moodType";

export const useHistory = () => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<moodsEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<moodsResultEntity | null>();
  const [editNote, setEditNote] = useState("");
  const [editMood, setEditMood] = useState<number>();

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
  const handleFilterChange = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
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
    fetchHistory();
  }, [page, status, mood, startDate, endDate]);

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบบันทึกนี้ใช่หรือไม่?")) return;
    await dataSoruceHistory.deleteMood(id);
    fetchHistory();
  };

  const handleSave = async () => {
    if (editItem) {
      await dataSoruceHistory.updateMood(editItem.id, {
        note: editNote,
        mood: editMood,
      });
      // } else {
      //   await dataSoruceHistory.createMood({
      //     note: editNote,
      //     mood: editMood,
      //   });
    }
    setIsModalOpen(false);
    fetchHistory();
  };

  const openEditModal = (log: moodsResultEntity) => {
    setEditItem(log);
    setEditNote(log.note);
    const moodData = moods.find((m) => m.label === log.mood);
    setEditMood(moodData ? moodData.value : 0);
    setIsModalOpen(true);
  };

  return {
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
    limit,
    mood,
    startDate,
    endDate,
    totalPages: data?.total ? Math.ceil(data.total / limit) : 1,
    updateQueryParams,
    handlePageChange: (p: number) => updateQueryParams({ page: String(p) }),
    handleDelete,
    handleSave,
    openEditModal,
    router,
    pathname,
    handleFilterChange,
  };
};
