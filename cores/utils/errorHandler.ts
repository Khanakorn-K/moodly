export interface AppError {
  success: boolean;
  message: string;
  code: string | number;
}

// วิธีใช้งาน:
// try {
//   await fetchSomething();
// } catch(error) {
//   const myError = handleAppError(error);
//   console.log(myError.message); // นำไปแสดงผลหรือแจ้งเตือนต่อ
// }
export function handleAppError(error: unknown): AppError {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axError = error as any;
    return {
      success: false,
      message:
        axError.response?.data?.error ||
        axError.response?.data?.message ||
        "เซิร์ฟเวอร์ขัดข้อง",
      code: axError.response?.status || 500,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
      code: "APP_ERROR",
    };
  }

  return {
    success: false,
    message: "เกิดข้อผิดพลาดที่ไม่รู้จัก",
    code: "UNKNOWN_ERROR",
  };
}
