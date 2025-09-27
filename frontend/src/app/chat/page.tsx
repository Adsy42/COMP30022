"use client";

import Navbar from "@/components/Navbar";
import ChatInput from "@/components/ChatInput";
import ChoiceGroup from "@/components/ChoiceGroup"

export default function ChatPage() {
  const OTHER = "Other (please specify)";
  
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pb-32">
        <div className="fixed inset-x-0 bottom-8 mx-auto max-w-3xl px-6">
          <div className="flex flex-col items-center gap-3">
            <ChoiceGroup 
              mode="single" 
              options={["Pre-Award","Post-Award", "asdfpoiu", "iuypiqwhreth", "bjncxzvvjkhldahjk", "oipweqnm,lvscaiu"]} 
            />

            <ChatInput />
          </div>
        </div>

      </main>
    </>
  );
}