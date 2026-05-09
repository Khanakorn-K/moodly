"use client";

import { useEffect, useState } from "react";
import { standartMoods } from "../../../../share/moodType";
import { CausesEntity } from "../../../../share/entities/causesEntity";
import { moodLogUseCase } from "../../DependenciesInjection";
export const useLog = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [myCustomCauses, setMyCustomCauses] = useState<CausesEntity[]>([]);
  const [newCauseName, setNewCauseName] = useState("");
  const [isAddingCause, setIsAddingCause] = useState(false);

  const activeMood = standartMoods.find((m) => m.value === selectedMood);

  const fetchmyCustomCauses = async () => {
    try {
      // 2. เปลี่ยนมาเรียกใช้งานผ่าน Use Case แทน
      const data = await moodLogUseCase.getMyCausesUseCase();
      setMyCustomCauses(Array.isArray(data) ? data : []);
    } catch (err) {
      setMyCustomCauses([]);
    }
  };

  useEffect(() => {
    fetchmyCustomCauses();
  }, []);

  const handleAddCustomCause = async () => {
    if (!newCauseName.trim()) return;
    setIsAddingCause(true);
    try {
      // 2. เปลี่ยนมาเรียกใช้งานผ่าน Use Case แทน
      await moodLogUseCase.addCauseUseCase(newCauseName);
      setNewCauseName("");
      await fetchmyCustomCauses();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingCause(false);
    }
  };

  const handleDeleteCustomCause = async (id: string) => {
    try {
      const targetCause = myCustomCauses.find((c) => c.id === id);
      // 2. เปลี่ยนมาเรียกใช้งานผ่าน Use Case แทน
      await moodLogUseCase.deleteCauseUseCase(id);
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
    if (!selectedMood || !selectedCause) return;
    setIsSubmitting(true);
    try {
      // 2. เปลี่ยนมาเรียกใช้งานผ่าน Use Case แทน และส่ง Parameter ให้ตรงกับที่ Use Case ต้องการ
      await moodLogUseCase.addMoodLogUseCase(selectedMood, [selectedCause], note);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedMood(null);
        setSelectedCause(null);
        setNote("");
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
    handleAddCustomCause,
    handleDeleteCustomCause,
    toggleCause,
    handleSubmit,
  };
};
