export const canonicalSiteUrl = "https://moodlyjournal.com";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? canonicalSiteUrl;

export const siteConfig = {
  name: "Moodly",
  description:
    "Moodly ช่วยบันทึกอารมณ์รายวัน วิเคราะห์แนวโน้ม และค้นหาสาเหตุที่ส่งผลต่อความรู้สึก เพื่อให้คุณเข้าใจตัวเองได้ดีขึ้น",
  url: rawSiteUrl.replace(/\/+$/, ""),
};
