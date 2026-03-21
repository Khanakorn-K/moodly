"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  PenLine,
  BarChart2,
  Lightbulb,
  Flame,
  LogOut,
  User,
} from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/", icon: Home, label: "หน้าแรก" },
  { href: "/log", icon: PenLine, label: "บันทึก" },
  { href: "/history", icon: BarChart2, label: "History" },
  // { href: "/suggestions", icon: Lightbulb, label: "แนะนำ" },
  // { href: "/streak", icon: Flame, label: "Streak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto">
      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between px-8 py-3 bg-[#0E0E18]/90 backdrop-blur-xl border-b border-white/5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌙</span>
          <span className="text-white font-bold text-lg tracking-tight">
            Moodly
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[#FFD166]/10 text-[#FFD166] border border-[#FFD166]/20"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-150 outline-none cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarImage src={session?.user?.image ?? ""} />
                <AvatarFallback className="bg-[#FFD166]/20 text-[#FFD166] text-xs font-semibold">
                  {session?.user?.name?.[0] ?? "M"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-white/70 font-medium">
                {session?.user?.name?.split(" ")[0] ?? "ลงชื่อเพื่อเข้าใช้งาน"}
                {/* <Image
                  width={30}
                  height={30}
                  src={session?.user?.image ?? "/default-avatar.png"}
                  alt="avatar"
                  className="rounded-full"
                />{" "} */}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#1A1A28] border-white/10 text-white rounded-xl shadow-xl w-48"
          >
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold text-white">
                {session?.user?.name}
              </p>
              <p className="text-xs text-white/40 truncate">
                {session?.user?.email}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-white/5" />

            <DropdownMenuSeparator className="bg-white/5" />
            {session ? (
              <>
                <DropdownMenuItem className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/5 cursor-pointer rounded-lg mx-1">
                  <User size={14} />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-[#EF476F] hover:text-[#EF476F] hover:bg-[#EF476F]/10 cursor-pointer rounded-lg mx-1 mb-1"
                >
                  <LogOut size={14} />
                  ออกจากระบบ
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-white/70 hover:text-white cursor-pointer rounded-lg mx-1 mb-1"
                >
                  <User size={14} />
                  เข้าสู่ระบบ
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="flex md:hidden items-center justify-around px-3 py-3 pb-6 bg-[#0E0E18]/95 backdrop-blur-xl border-t border-white/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all duration-150 ${
                  isActive
                    ? "bg-[#FFD166]/10 border-[#FFD166]/20"
                    : "border-transparent"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-[#FFD166]" : "text-white/30"}
                />
                <span
                  className={`text-[10px] font-medium ${isActive ? "text-[#FFD166]" : "text-white/30"}`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
