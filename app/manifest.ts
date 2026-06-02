import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Moodly - บันทึกอารมณ์รายวัน",
    short_name: "Moodly",
    description:
      "บันทึกอารมณ์ วิเคราะห์แนวโน้ม และค้นหาสาเหตุที่ส่งผลต่อความรู้สึก",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0F",
    theme_color: "#0A0A0F",
    lang: "th",
    icons: [
      {
        src: "/Logo.png",
        sizes: "992x1070",
        type: "image/png",
      },
    ],
  };
}
