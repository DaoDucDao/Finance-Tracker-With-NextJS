"use client";

interface ColorPickerProps {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
}

export default function ColorPicker({
  colors,
  selected,
  onSelect,
}: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((colorOption) => (
        <button
          key={colorOption}
          type="button"
          onClick={() => onSelect(colorOption)}
          className={`h-8 w-8 rounded-full transition-all ${
            selected === colorOption
              ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
              : ""
          }`}
          style={{ backgroundColor: colorOption }}
        />
      ))}
    </div>
  );
}
