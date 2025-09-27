"use client";

import Navbar from "@/components/Navbar";
import ChatInput from "@/components/ChatInput";

export default function ChatPage() {return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pb-32">
        <ChatInput />


      </main>
    </>
  );
}