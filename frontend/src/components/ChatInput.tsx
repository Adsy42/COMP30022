"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function ChatInput() {
    const [text, setText] = useState("");       // contents state with empty default
    const [isBusy, setIsBusy] = useState(false) // busy state with false default
    const textareaRef = useRef<HTMLTextAreaElement>(null);
  
    // Helpers to use later
    const toggleOn = () => setIsBusy(true);
    const toggleOff = () => setIsBusy(false);

    // Take focus on re-enable
    useEffect(() => {
        if (!isBusy) {
          textareaRef.current?.focus();
        }
      }, [isBusy]);
  
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
        <form
        onSubmit={(e) => {
            e.preventDefault(); // override default page refresh behavior
            submit();
        }}
        className="w-full"
        >
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-lg ring-1 ring-black/5">
            <textarea
            ref={textareaRef}
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
            <Image
                src="/send.svg"
                alt="Send"
                width={28}
                height={28}
                className="h-7 w-7 -translate-x-[2.5px] pointer-events-none"
            />
            </button>
        </div>
        </form>
    );
  }