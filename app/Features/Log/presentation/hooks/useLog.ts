"use client";

import { useCallback, useEffect, useState } from "react";
import { standartMoods } from "@/app/share/moodType";
import type { CauseEntity } from "../../domain/entities/CauseEntity";
import { logUseCases } from "../../dependencyInjection";

export const useLog = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [myCustomCauses, setMyCustomCauses] = useState<CauseEntity[]>([]);
  const [newCauseName, setNewCauseName] = useState("");
  const [isAddingCause, setIsAddingCause] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeMood = standartMoods.find((m) => m.value === selectedMood);

  const fetchMyCustomCauses = useCallback(async () => {
    try {
      const data = await logUseCases.getCauses();
      setMyCustomCauses(Array.isArray(data) ? data : []);
    } catch {
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
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
      );
    } finally {
      setIsAddingCause(false);
    }
  };

  const handleDeleteCustomCause = async (id: string) => {
    try {
      const targetCause = myCustomCauses.find((c) => c.id === id);
      await logUseCases.deleteCause({ id });
      setMyCustomCauses((prev) => prev.filter((c) => c.id !== id));
      if (targetCause && selectedCause === targetCause.name) {
        setSelectedCause(null);
      }
    } catch (err) {
      console.error(err);
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
      });
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
      );
    } finally {
      setSubmitted(false);
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
    activeMood,
    errorMessage,
    handleAddCustomCause,
    handleDeleteCustomCause,
    toggleCause,
    handleSubmit,
  };
};
