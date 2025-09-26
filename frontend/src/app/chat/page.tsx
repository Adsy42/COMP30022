"use client";

import Link from "next/link";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState } from "react";

export default function ChatPage() {
  const [text, setText] = useState("");       // contents state with empty default
  const [isBusy, setIsBusy] = useState(false) // busy state with false default

  // Helpers to use later
  const toggleOn = () => setIsBusy(true);
  const toggleOff = () => setIsBusy(false);

  function submit() {
    const input = text.trim();  // copy contents into input variable
    if (!input) return;
    console.log(input);         // TODO: replace with actual functionality
    setText("");                // clear the input box
    toggleOn();                 // disable input

    // TODO: Remove this later. Fake bot reply after 1s → re-enable
    setTimeout(() => {
      toggleOff();
    }, 1000);
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pb-32">
        <form
          onSubmit={(e) => {
            e.preventDefault(); // override default page refresh behavior
            submit();
          }}
          className="fixed bottom-8 inset-x-0 mx-auto max-w-3xl px-6"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-lg ring-1 ring-black/5">
            <textarea
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isBusy ? "" : "Start typing..."}   // remove placeholder when busy
              disabled={isBusy}                               // greys out & locks input
              className="flex-1 max-h-24 bg-transparent text-[15px] leading-6 text-slate-800 outline-none
                         placeholder:text-slate-400 resize-none overflow-hidden
                         disabled:opacity-60"
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";                     // reset height
                el.style.height = `${el.scrollHeight}px`;     // grow to fit content
              }}

              // Submit if Enter + !Shift
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();                         // override default newline behavior
                  submit();
                }
              }}
            />

            <button
              type="submit"
              disabled={isBusy || text.trim() === ""}         // lock send button too
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black
                         enabled:hover:bg-gray-100 active:scale-[.98] transition
                         disabled:opacity-50"
            >
              <img
                src="/send.svg"
                alt="Send"
                className="h-7 w-7 -translate-x-[2.5px] pointer-events-none"
              />
            </button>
          </div>
        </form>


      </main>
    </>
  );
}