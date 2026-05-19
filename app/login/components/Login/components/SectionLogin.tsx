"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const moods = ["😄", "🙂", "😐", "😟", "😭"];

export default function SectionLogin() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0F] px-3 py-8 pb-28 sm:p-5 lg:pb-5">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFD166]/5 blur-[100px] sm:h-[400px] sm:w-[400px] sm:blur-[120px]" />

      <Card className="w-full max-w-[380px] overflow-hidden rounded-[28px] border-white/5 bg-[#12121A] shadow-2xl">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#FFD166] via-[#FF6B6B] to-[#FF6B6B]/0" />

        <CardHeader className="px-5 pt-8 pb-4 text-center sm:px-8">
          <div className="mb-3 text-5xl">🌙</div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Moodly
          </CardTitle>
          <CardDescription className="text-white/40 text-xs mt-1">
            Track your mood. Understand yourself.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 px-5 pb-8 sm:px-8">
          {/* Mood preview */}
          <div className="bg-[#1A1A28] rounded-2xl p-4 border border-white/5 text-center">
            <p className="text-[11px] text-white/30 mb-3">
              บันทึกอารมณ์ทุกวัน แล้วดูว่าชีวิตดีขึ้นยังไง
            </p>
            <div className="flex justify-center gap-2 sm:gap-3">
              {moods.map((m) => (
                <span
                  key={m}
                  className="text-2xl hover:scale-125 transition-transform duration-150 cursor-default"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <Separator className="bg-white/5" />

          {/* Google Login */}
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full bg-white hover:bg-white/90 text-[#0A0A0F] font-semibold h-12 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-150"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            เข้าสู่ระบบด้วย Google
          </Button>

          <p className="text-[10px] text-white/20 text-center leading-relaxed">
            การเข้าสู่ระบบแสดงว่าคุณยอมรับ
            <br />
            Terms of Service และ Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
