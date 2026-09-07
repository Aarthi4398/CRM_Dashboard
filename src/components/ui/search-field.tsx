import { Search } from "lucide-react";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  "aria-label": string;
  className?: string;
};

export function SearchField({
  value,
  onChange,
  placeholder,
  "aria-label": ariaLabel,
  className = "relative max-w-md",
}: SearchFieldProps) {
  return (
    <div className={className}>
      <Search className="muted absolute left-3 top-1/2 -translate-y-1/2" size={18} />
      <input
        className="field !pl-10"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
      />
    </div>
  );
}
