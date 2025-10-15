import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
// import { AnalyticsTracker } from "@/components/analytics-tracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <AnalyticsTracker /> */}
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
