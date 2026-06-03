import Image from "next/image";
import Link from "next/link";
import { BarChart3, BookHeart, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/cores/lib/site";

const features = [
  {
    icon: BookHeart,
    title: "บันทึกอารมณ์รายวัน",
    description:
      "จดระดับอารมณ์ สาเหตุ และรายละเอียดของแต่ละวัน เพื่อเก็บเรื่องราวของใจอย่างเป็นระบบ",
  },
  {
    icon: BarChart3,
    title: "มองเห็นแนวโน้ม",
    description:
      "ดูภาพรวมและค่าเฉลี่ยอารมณ์ผ่านกราฟกับปฏิทินสี เพื่อเข้าใจการเปลี่ยนแปลงได้ง่ายขึ้น",
  },
  {
    icon: SearchCheck,
    title: "ค้นหาสาเหตุสำคัญ",
    description:
      "สำรวจว่าสาเหตุใดเกิดขึ้นบ่อย และมีความสัมพันธ์กับความรู้สึกของคุณอย่างไร",
  },
];

export default function PublicLandingPageView() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    inLanguage: "th-TH",
  };

  return (
    <main className="min-h-screen bg-[#0A0A0F] px-4 py-20 text-white sm:px-6 lg:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <Image
          src="/Logo.png"
          alt="Moodly แอปบันทึกอารมณ์"
          width={88}
          height={95}
          priority
          className="mb-6 h-20 w-auto"
        />

        <p className="mb-4 rounded-full border border-moodly-primary/25 bg-moodly-primary/10 px-4 py-2 text-sm font-medium text-moodly-primary-soft">
          สมุดบันทึกอารมณ์สำหรับทุกวัน
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          บันทึกอารมณ์ เข้าใจตัวเองได้ดีขึ้นในทุกวัน
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
          Moodly ช่วยให้คุณจดความรู้สึก สำรวจสาเหตุ และมองเห็นแนวโน้มอารมณ์
          เพื่อดูแลใจด้วยข้อมูลที่เป็นของคุณเอง
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="h-12 rounded-xl bg-moodly-primary px-7 font-bold text-[#0A0A0F] hover:bg-moodly-primary-soft"
          >
            <Link href="/login">เริ่มบันทึกอารมณ์</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-12 rounded-xl border-white/15 bg-white/[0.03] px-7 text-white hover:bg-white/10"
          >
            <Link href="#features">ดูความสามารถ</Link>
          </Button>
        </div>
      </section>

      <section
        id="features"
        aria-labelledby="features-title"
        className="mx-auto mt-24 max-w-5xl"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="features-title" className="text-2xl font-bold sm:text-3xl">
            เข้าใจอารมณ์จากสิ่งที่เกิดขึ้นจริง
          </h2>
          <p className="mt-3 leading-7 text-white/55">
            เริ่มจากการบันทึกสั้น ๆ ในแต่ละวัน แล้วให้ Moodly
            ช่วยจัดข้อมูลให้อ่านง่ายขึ้น
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              <Icon className="h-6 w-6 text-moodly-calm" aria-hidden="true" />
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/55">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
