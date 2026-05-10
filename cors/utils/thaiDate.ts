/**
 * แปลงออบเจกต์ Date ให้อยู่ในรูปแบบ ISO มาตราฐาน database
 */
export function convertDateToISO(date: Date): string {
  return date.toISOString();
}
/**
 * แปลงออบเจกต์ Date ให้อยู่ในรูปแบบ ISO มาตราฐาน database   // บวกเวลาเพิ่มไป 7 ชั่วโมง (ตามโซนไทย) ก่อนแปลงเป็น ISO
 */
export function convertDateToLocalISO(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60000; // หน่วยเป็นมิลลิวินาที
  const localISOTime = new Date(date.getTime() - tzOffset).toISOString();

  return localISOTime;
}
/**
 * แปลงออบเจกต์ Date ให้อยู่ในรูปแบบ YYYY-MM-DD
 */
export function convertDateToYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * ดึงวันที่ปัจจุบันมาแสดงผลเป็นภาษาไทยแบบไม่มีปี (เช่น วันจันทร์ที่ 1 มกราคม)
 */
// display == ใช้บน view
export function displayGetCurrentThaiDate(): string {
  return new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * แปลงค่าวันที่จากหลายรูปแบบ ให้เป็นวันที่ภาษาไทยแบบเต็ม (มีระบุปี)
 */
export function convertDateToThaiDateFormat(
  date: Date | string | null | undefined,
): string {
  if (!date) return "ไม่ระบุวันที่";

  let inputDate: Date;

  if (typeof date === "string") {
    // ตัดเอาแค่ YYYY-MM-DD เพื่อไม่ให้โดน Timezone (เขตเวลา) ปัดเศษเวลาจนข้ามวัน
    const dateOnly = date.split("T")[0];
    inputDate = new Date(dateOnly);
  } else {
    inputDate = date;
  }

  if (isNaN(inputDate.getTime())) {
    return "วันที่ไม่ถูกต้อง";
  }

  return inputDate.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    // ไม่ต้องระบุ timeZone เพื่อให้อิงตามวันที่ที่เรา Set ไว้ตรงๆ
  });
}
