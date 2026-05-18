"use client";
import React from "react";
import { useOverView } from "./hook/useOverView";

const OverViewView = () => {
  const { overViewData, isLoading, error } = useOverView();
  return <div>OverViewView</div>;
};

export default OverViewView;
