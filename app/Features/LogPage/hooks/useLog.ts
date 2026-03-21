"use client";

import { useEffect, useState } from "react";
import dataSourcesLog from "../services/dataSourcesLog";
import { moods } from "../../../share/moodType";
import { CausesEntity } from "../entity/causesEntity";

export const useLog = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [myCustomCauses, setMyCustomCauses] = useState<CausesEntity[]>([]);
  const [newCauseName, setNewCauseName] = useState("");
  const [isAddingCause, setIsAddingCause] = useState(false);

  const activeMood = moods.find((m) => m.value === selectedMood);

  const fetchmyCustomCauses = async () => {
    try {
      const data = await dataSourcesLog.getMyCauses();
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
      await dataSourcesLog.addCauses(newCauseName);
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
      await dataSourcesLog.deleteMyCauses(id);
      setMyCustomCauses((prev) => prev.filter((c) => c.id !== id));
      if (targetCause) {
        setSelectedCauses((prev) =>
          prev.filter((name) => name !== targetCause.name),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCause = (name: string) => {
    setSelectedCauses((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    setIsSubmitting(true);
    try {
      await dataSourcesLog.addMood(selectedMood, selectedCauses, note);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedMood(null);
        setSelectedCauses([]);
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
    selectedCauses,
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
