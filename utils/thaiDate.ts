export function thaiDate(): string {
  return new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
export function toThaiDate(date: Date | string): string {
  const inputDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(inputDate.getTime())) return "วันที่ไม่ถูกต้อง";

  return inputDate.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric", // เพิ่มปี พ.ศ. ให้สมบูรณ์ครับมาสเตอร์
  });
}
