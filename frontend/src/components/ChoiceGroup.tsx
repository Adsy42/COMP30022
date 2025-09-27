import * as React from "react";

type Mode = "single" | "multi";

export default function ChoiceGroup({
  mode = "single",
  options,
  className = "",
}: {
  mode?: Mode;
  options: string[];
  className?: string;
}) {
  // For now, keep selection internal. (Step 2 can expose it via onChange.)
  const [selected, setSelected] = React.useState<string[]>([]);
  const isSelected = (o: string) => selected.includes(o);

  const toggle = (o: string) => {
    if (mode === "single") {
      const next = [o];
      setSelected(next);
    } else {
      setSelected(prev => {
        const next = prev.includes(o) ? prev.filter(v => v !== o) : [...prev, o];
        return next;
      });
    }
  };  

  const groupRole = mode === "single" ? "radiogroup" : "group";
  const itemRole = mode === "single" ? "radio" : "checkbox";

  return (
    <div className={`w-full ${className}`} role={groupRole}>
      <div className="overflow-x-auto overflow-y-visible no-scrollbar py-1">
        <div className="flex gap-3 w-max mx-auto">
          {options.map((o) => {
            const on = isSelected(o);
            return (
              <button
                key={o}
                role={itemRole}
                aria-checked={on}
                onClick={() => toggle(o)}
                className={[
                  "rounded-full px-4 py-1.5 text-sm font-medium",
                  "text-white transition border border-transparent",
                  "active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-blue-600",
                  on ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500",
                ].join(" ")}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
