import Link from "next/link";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
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
      <Hero />
    </main>
  );
}