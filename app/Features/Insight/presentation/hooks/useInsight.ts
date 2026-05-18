import { useCallback, useEffect, useRef, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { standartMoods } from "@/app/share/moodType";
import { handleAppError } from "@/cors/utils/errorHandler";
import { inspectResponse } from "@/cors/utils/debugResponse";
import type { CauseEntity } from "../../domain/entities/CauseEntity";
import type {
  MoodLogEntity,
  MoodLogPageEntity,
} from "../../domain/entities/MoodLogEntity";
import { insightUseCases } from "../../dependencyInjection";

export const useInsight = () => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasInitializedMoodLogs = useRef(false);

  const [moodLogPage, setMoodLogPage] = useState<MoodLogPageEntity | null>(
    null,
  );
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMoodLog, setEditingMoodLog] = useState<MoodLogEntity | null>(
    null,
  );
  const [editNote, setEditNote] = useState("");
  const [editMood, setEditMood] = useState<number>();
  const [customCauses, setCustomCauses] = useState<CauseEntity[]>([]);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const mood = searchParams.get("mood") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const updateQueryParams = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const fetchMoodLogs = useCallback(async (isInitial: boolean = false) => {
    if (status !== "authenticated") return;
    if (isInitial) {
      setIsInitialLoading(true);
    } else {
      setIsListLoading(true);
    }
    try {
      const entity = await insightUseCases.getMoodLogs({
        page,
        limit,
        mood,
        startDate,
        endDate,
      });
      setMoodLogPage(entity);
      inspectResponse(entity, "mood logs");
    } catch (error) {
      handleAppError(
        error instanceof Error ? error.message : "ไม่สามารถโหลดประวัติอารมณ์ได้",
      );
    } finally {
      setIsInitialLoading(false);
      setIsListLoading(false);
    }
  }, [endDate, limit, mood, page, startDate, status]);

  const fetchCauses = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      const entity = await insightUseCases.getCauses();
      setCustomCauses(entity);
    } catch (error) {
      console.error(error);
    }
  }, [status]);

  const handleFilterChange = useCallback(
    (newParams: Record<string, string | null>) => {
      updateQueryParams({ ...newParams, page: "1" });
    },
    [updateQueryParams],
  );

  useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("limit")) {
      updateQueryParams({ page: "1", limit: "10" });
    }
  }, [searchParams, updateQueryParams]);

  useEffect(() => {
    fetchCauses();
  }, [fetchCauses]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const shouldShowInitialLoader = !hasInitializedMoodLogs.current;
    hasInitializedMoodLogs.current = true;
    fetchMoodLogs(shouldShowInitialLoader);
  }, [fetchMoodLogs, status]);

  const handleDeleteMoodLog = async (id: string) => {
    if (!confirm("ต้องการลบบันทึกนี้ใช่หรือไม่?")) return;
    await insightUseCases.deleteMoodLog(id);
    fetchMoodLogs();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const logId = String(active.id);
    const newMoodValue = Number(over.id);
    const previousMoodLogPage = moodLogPage;

    setMoodLogPage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          String(item.id) === logId ? { ...item, mood: newMoodValue } : item,
        ),
      };
    });

    try {
      const originalLog = previousMoodLogPage?.items.find(
        (item) => String(item.id) === logId,
      );
      await insightUseCases.updateMoodLog(logId, {
        mood: newMoodValue,
        note: originalLog?.note || "",
        causes: originalLog?.causes || [],
      });
    } catch {
      setMoodLogPage(previousMoodLogPage);
      alert("การเชื่อมต่อขัดข้อง!");
    }
  };

  const handleSaveMoodLog = async () => {
    if (!editingMoodLog || editMood === undefined) return;
    await insightUseCases.updateMoodLog(editingMoodLog.id, {
      mood: editMood,
      note: editNote,
      causes: selectedCauses,
    });
    setIsModalOpen(false);
    fetchMoodLogs();
  };

  const toggleCause = (name: string) => setSelectedCauses([name]);

  const openEditMoodLogModal = (moodLog: MoodLogEntity) => {
    setEditingMoodLog(moodLog);
    setEditNote(moodLog.note);
    const moodConfig = standartMoods.find(
      (m) => String(m.value) === String(moodLog.mood),
    );
    setEditMood(moodConfig ? Number(moodConfig.value) : 0);
    setSelectedCauses(moodLog.causes || []);
    setIsModalOpen(true);
  };

  return {
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
    page,
    limit,
    mood,
    startDate,
    endDate,
    totalPages: moodLogPage?.total ? Math.ceil(moodLogPage.total / limit) : 1,
    updateQueryParams,
    handlePageChange: (p: number) => updateQueryParams({ page: String(p) }),
    handleDeleteMoodLog,
    handleSaveMoodLog,
    openEditMoodLogModal,
    router,
    pathname,
    toggleCause,
    handleFilterChange,
    customCauses,
    selectedCauses,
    setSelectedCauses,
    handleDragEnd,
  };
};
