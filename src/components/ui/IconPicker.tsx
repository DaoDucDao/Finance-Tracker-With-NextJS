"use client";

interface IconPickerProps {
  icons: string[];
  selected: string;
  onSelect: (icon: string) => void;
}

export default function IconPicker({ icons, selected, onSelect }: IconPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {icons.map((iconOption) => (
        <button
          key={iconOption}
          type="button"
          onClick={() => onSelect(iconOption)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all ${
            selected === iconOption
              ? "bg-zinc-600 ring-2 ring-emerald-500"
              : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          {iconOption}
        </button>
      ))}
    </div>
  );
}
