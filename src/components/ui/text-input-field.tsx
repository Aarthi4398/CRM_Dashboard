type TextInputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

export function TextInputField({ label, value, onChange, type = "text" }: TextInputFieldProps) {
  return (
    <label>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      <input className="field" required type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
