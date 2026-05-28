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
 * แปลงออบเจกต์ Date ให้อยู่ในรูปแบบ YYYY-MM
 */
export function convertDateToYYMM(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * ตรวจสอบวันที่รูปแบบ YYYY-MM-DD และกันวันที่ที่ไม่มีจริง เช่น 2026-02-31
 */
export function isValidYYMMDDDate(value: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    dateRegex.test(value) &&
    !Number.isNaN(date.getTime()) &&
    date.toISOString().startsWith(value)
  );
}

/**
 * ตรวจสอบเดือนรูปแบบ YYYY-MM และกันเดือนที่ไม่มีจริง เช่น 2026-13
 */
export function isValidYYMMMonth(value: string): boolean {
  const monthRegex = /^\d{4}-\d{2}$/;
  if (!monthRegex.test(value)) return false;

  const month = Number(value.split("-")[1]);
  return month >= 1 && month <= 12;
}

/**
 * แปลง YYYY-MM เป็นช่วงวันแรกและวันสุดท้ายของเดือนในรูปแบบ YYYY-MM-DD
 */
export function createYYMMMonthDateRange(value: string): {
  startDate: string;
  endDate: string;
} {
  const [yearValue, monthValue] = value.split("-");
  const year = Number(yearValue);
  const monthIndex = Number(monthValue) - 1;
  const lastDate = new Date(Date.UTC(year, monthIndex + 1, 0));

  return {
    startDate: `${value}-01`,
    endDate: lastDate.toISOString().split("T")[0],
  };
}

/**
 * แปลง YYYY-MM-DD เป็นเวลาเริ่มต้นของวันสำหรับ query database
 */
export function convertYYMMDDToStartOfDayISO(value: string): string {
  return `${value}T00:00:00.000Z`;
}

/**
 * แปลง YYYY-MM-DD เป็นเวลาสิ้นสุดของวันสำหรับ query database
 */
export function convertYYMMDDToEndOfDayISO(value: string): string {
  return `${value}T23:59:59.999Z`;
}

/**
 * สร้างรายการวันที่แบบ YYYY-MM-DD ตั้งแต่วันเริ่มต้นถึงวันสิ้นสุด
 */
export function createYYMMDDDateRange(
  startDate: string,
  endDate: string,
): string[] {
  const dates: string[] = [];
  const currentDate = new Date(convertYYMMDDToStartOfDayISO(startDate));
  const lastDate = new Date(convertYYMMDDToStartOfDayISO(endDate));

  while (currentDate <= lastDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dates;
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

/**
 * แปลงวันที่ให้เป็นรูปแบบสั้นสำหรับ label บนกราฟ เช่น 18 พ.ค.
 */
export function convertDateToShortThaiDateFormat(
  date: Date | string | null | undefined,
): string {
  if (!date) return "";

  let inputDate: Date;

  if (typeof date === "string") {
    const dateOnly = date.split("T")[0];
    inputDate = new Date(`${dateOnly}T00:00:00.000Z`);
  } else {
    inputDate = date;
  }

  if (isNaN(inputDate.getTime())) {
    return "";
  }

  return inputDate.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}
