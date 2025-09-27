import Link from "next/link";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Navbar
        actions={
          <div className="flex gap-3">
            <Link href="/chat">
              <Button>Start Chat</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        }
      />
      {/* Hero fills the remaining space without scrolling */}
      <div className="flex-1 flex items-center justify-center">
        <Hero />
      </div>
    </main>
  );
}