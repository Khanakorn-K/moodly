"use client";
import { useCallback, useEffect, useState } from "react";
import { standardMoods } from "@/app/shared/moodType";
import type { CauseEntity } from "@/app/shared/entities/CauseEntity";
import { logUseCases } from "../../dependencyInjection";
import { toastManager } from "@/cores/utils/toastManager";
import { getErrorMessage } from "@/cores/utils/getErrorMessage";

export const useLog = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [myCustomCauses, setMyCustomCauses] = useState<CauseEntity[]>([]);
  const [newCauseName, setNewCauseName] = useState("");
  const [isAddingCause, setIsAddingCause] = useState(false);
  const [editingCauseId, setEditingCauseId] = useState<string | null>(null);
  const [editingCauseName, setEditingCauseName] = useState("");
  const [updatingCauseId, setUpdatingCauseId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());

  const activeMood = standardMoods.find((m) => m.value === selectedMood);

  const fetchMyCustomCauses = useCallback(async () => {
    try {
      const data = await logUseCases.getCauses();
      setMyCustomCauses(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      toastManager.error(getErrorMessage(error));
      setMyCustomCauses([]);
    }
  }, []);

  useEffect(() => {
    fetchMyCustomCauses();
  }, [fetchMyCustomCauses]);

  const handleAddCustomCause = async () => {
    setIsAddingCause(true);
    setErrorMessage(null);
    try {
      await logUseCases.addCause({ name: newCauseName });
      setNewCauseName("");
      await fetchMyCustomCauses();
      toastManager.success("เพิ่มสาเหตุสำเร็จ");
    } catch (error: unknown) {
      toastManager.fromError(error);
    } finally {
      setIsAddingCause(false);
    }
  };

  const handleDeleteCustomCause = async (id: string, name: string) => {
    const isConfirmed = confirm(`ต้องการลบ ${name} ?`);

    if (!isConfirmed) return;

    try {
      const targetCause = myCustomCauses.find((c) => c.id === id);

      await logUseCases.deleteCause({ id });

      setMyCustomCauses((prev) => prev.filter((c) => c.id !== id));

      if (targetCause && selectedCause === targetCause.name) {
        setSelectedCause(null);
      }
      toastManager.success("ลบสาเหตุสำเร็จ");
    } catch (error: unknown) {
      toastManager.error(getErrorMessage(error));
    }
  };

  const startEditCustomCause = (id: string, name: string) => {
    setEditingCauseId(id);
    setEditingCauseName(name);
    setErrorMessage(null);
  };

  const cancelEditCustomCause = () => {
    setEditingCauseId(null);
    setEditingCauseName("");
    setErrorMessage(null);
  };

  const handleUpdateCustomCause = async (id: string) => {
    const targetCause = myCustomCauses.find((cause) => cause.id === id);

    setUpdatingCauseId(id);
    setErrorMessage(null);
    try {
      await logUseCases.updateCause({ id, name: editingCauseName });
      if (targetCause && selectedCause === targetCause.name) {
        setSelectedCause(editingCauseName.trim());
      }
      cancelEditCustomCause();
      await fetchMyCustomCauses();
      toastManager.success("แก้ไขสาเหตุสำเร็จ");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? getErrorMessage(error) : "เกิดข้อผิดพลาด",
      );
    } finally {
      setUpdatingCauseId(null);
    }
  };

  const toggleCause = (name: string) => {
    setSelectedCause((prev) => (prev === name ? null : name));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await logUseCases.addMoodLog({
        selectedMood,
        selectedCause,
        note,
        createdAt: date,
      });
      setSubmitted(true);
      toastManager.success("บันทึกอารมณ์สำเร็จ");
    } catch (error: unknown) {
      toastManager.fromError(error);
    } finally {
      setNote("");
      setSubmitted(false);
      setIsSubmitting(false);
      setSelectedMood(null);
      setSelectedCause(null);
    }
  };

  return {
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
  };
};
