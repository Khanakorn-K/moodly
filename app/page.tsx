import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import LandingPageView from "./Features/Landing/presentation/LandingPageView";
import PublicLandingPageView from "./Features/Landing/presentation/components/PublicLandingPageView";
import { authOptions } from "@/cores/lib/auth";
import { siteConfig } from "@/cores/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  return session ? <LandingPageView /> : <PublicLandingPageView />;
}
