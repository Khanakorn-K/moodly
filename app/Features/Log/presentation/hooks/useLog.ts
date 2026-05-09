"use client";

import { useEffect, useState } from "react";
import { standartMoods } from "../../../../share/moodType";
import { CausesEntity } from "../../../../share/entities/causesEntity";
import { makeGetLogUseCase } from "../../DependenciesInjection";

export const useLog = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [myCustomCauses, setMyCustomCauses] = useState<CausesEntity[]>([]);
  const [newCauseName, setNewCauseName] = useState("");
  const [isAddingCause, setIsAddingCause] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeMood = standartMoods.find((m) => m.value === selectedMood);

  const fetchmyCustomCauses = async () => {
    try {
      const data = await makeGetLogUseCase.getMyCausesUseCase();
      setMyCustomCauses(Array.isArray(data) ? data : []);
    } catch (err) {
      setMyCustomCauses([]);
    }
  };

  useEffect(() => {
    fetchmyCustomCauses();
  }, []);

  const handleAddCustomCause = async () => {
    setIsAddingCause(true);
    setErrorMessage(null);
    try {
      await makeGetLogUseCase.addCauseUseCase(newCauseName);
      setNewCauseName("");
      await fetchmyCustomCauses();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsAddingCause(false);
    }
  };

  const handleDeleteCustomCause = async (id: string) => {
    try {
      const targetCause = myCustomCauses.find((c) => c.id === id);
      await makeGetLogUseCase.deleteCauseUseCase(id);
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
      await makeGetLogUseCase.addMoodLogUseCase(
        selectedMood,
        selectedCause,
        note,
      );
      setSubmitted(true);
    } catch (error: any) {
      setErrorMessage(error.message);
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
