import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Navbar
        actions={
          <>
              <Link href="/chat"><Button>Start Chat</Button></Link>
              <Link href="/login"><Button variant="outline">Sign In</Button></Link>
          </>
        }
      />

      <h1>Welcome to your Next.js App</h1>
      <p>
        This is a minimal React/Next.js setup. Add your components and features
        as needed.
      </p>
    </main>
  )
}
