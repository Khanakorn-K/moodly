export function thaiDate(): string {
  return new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
export function toThaiDate(date: Date | string | null | undefined): string {
  if (!date) return "ไม่ระบุวันที่";

  let inputDate: Date;

  if (typeof date === "string") {
    const formattedDate = date.includes("T") ? date : date.replace(" ", "T");
    inputDate = new Date(formattedDate);
  } else {
    inputDate = date as Date;
  }

  if (
    !inputDate ||
    typeof inputDate.getTime !== "function" ||
    isNaN(inputDate.getTime())
  ) {
    return "วันที่ไม่ถูกต้อง";
  }

  return inputDate.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const getThailandTime = (): string => {
  return new Date().toISOString();
};
