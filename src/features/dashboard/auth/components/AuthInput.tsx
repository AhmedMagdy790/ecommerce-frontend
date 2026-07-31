interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
}

export const AuthInput = ({ label, icon, ...props }: AuthInputProps) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 px-1">{label}</label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">{icon}</span>
      <input {...props} className="input-field" />
    </div>
  </div>
);