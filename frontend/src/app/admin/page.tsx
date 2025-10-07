'use client'

import Navbar from '@/components/Navbar'; 
import Link from "next/link";
import Button from "@/components/Button";

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Navbar 
        actions={
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline">Log Out</Button>
            </Link>
          </div>
        }
      />
      <main className="container mx-auto px-4 py-8">

      </main>
    </div>
  )
}
