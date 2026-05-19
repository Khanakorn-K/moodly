import { useCallback, useEffect, useRef, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { standardMoods } from "@/app/shared/moodType";
import { handleAppError } from "@/cores/utils/errorHandler";
import { inspectResponse } from "@/cores/utils/debugResponse";
import type { CauseEntity } from "@/app/shared/entities/CauseEntity";
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

  const fetchMoodLogs = useCallback(
    async (isInitial: boolean = false) => {
      if (status !== "authenticated") return;
      if (isInitial) {
        setIsInitialLoading(true);
      } else {
        setIsListLoading(true);
      }
      try {
        const entity = await insightUseCases.getMoodLogs({
          mood,
          startDate,
          endDate,
        });
        setMoodLogPage(entity);
        inspectResponse(entity, "mood logs");
      } catch (error) {
        handleAppError(
          error instanceof Error
            ? error.message
            : "ไม่สามารถโหลดประวัติอารมณ์ได้",
        );
      } finally {
        setIsInitialLoading(false);
        setIsListLoading(false);
      }
    },
    [endDate, mood, startDate, status],
  );

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
      updateQueryParams({ ...newParams });
    },
    [updateQueryParams],
  );

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
    await fetchMoodLogs();
  };

  const updateMoodLogMoodInPage = useCallback(
    (logId: string, nextMood: number, expectedCurrentMood?: number) => {
      setMoodLogPage((currentPage) => {
        if (!currentPage) return currentPage;

        let didUpdate = false;
        const nextItems = currentPage.items.map((item) => {
          if (String(item.id) !== logId) return item;

          if (
            expectedCurrentMood !== undefined &&
            Number(item.mood) !== expectedCurrentMood
          ) {
            return item;
          }

          if (Number(item.mood) === nextMood) return item;

          didUpdate = true;
          return { ...item, mood: nextMood };
        });

        return didUpdate ? { ...currentPage, items: nextItems } : currentPage;
      });
    },
    [],
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const logId = String(active.id);
    const newMoodValue = Number(over.id);
    const originalLog = moodLogPage?.items.find(
      (item) => String(item.id) === logId,
    );

    if (!originalLog || Number.isNaN(newMoodValue)) return;

    const previousMoodValue = Number(originalLog.mood);
    if (previousMoodValue === newMoodValue) return;

    updateMoodLogMoodInPage(logId, newMoodValue, previousMoodValue);

    try {
      await insightUseCases.updateMoodLog(logId, {
        mood: newMoodValue,
        note: originalLog.note,
        causes: originalLog.causes,
      });
    } catch {
      updateMoodLogMoodInPage(logId, previousMoodValue, newMoodValue);
      handleAppError("การเชื่อมต่อขัดข้อง!");
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
    await fetchMoodLogs();
  };

  const toggleCause = (name: string) => setSelectedCauses([name]);

  const openEditMoodLogModal = (moodLog: MoodLogEntity) => {
    setEditingMoodLog(moodLog);
    setEditNote(moodLog.note);
    const moodConfig = standardMoods.find(
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
    mood,
    startDate,
    endDate,
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
