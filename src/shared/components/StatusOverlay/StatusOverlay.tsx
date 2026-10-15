import { Check, X, Loader2 } from "lucide-react";


type BackgroundStyle = "full" | "blur" | "none" | "simple";
type StatusType = "loading" | "success" | "error" | null;

interface StatusOverlayProps {
  type: StatusType;
  message?: string;
  isVisible: boolean;
  bgStyle?: BackgroundStyle;
  // الإضافات الجديدة
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function StatusOverlay({
  type,
  message,
  isVisible,
  bgStyle = "blur",
  showButton = false,
  buttonText = "إغلاق",
  onButtonClick,
}: StatusOverlayProps) {
  if (!isVisible || !type) return null;


  const backgroundClasses = {
    full: "bg-black/60",
    blur: "bg-black/40 backdrop-blur-md",
    simple: "bg-white/10",
    none: "",
  };

  const config = {
    loading: {
      icon: <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />,
      text: "text-brand-500",
      btnClass: "bg-brand-500 hover:bg-brand-600",
    },
    success: {
      icon: (
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center animate-scaleIn">
          <Check className="w-10 h-10 text-green-600" />
        </div>
      ),
      text: "text-green-600",
      btnClass: "bg-green-600 hover:bg-green-700",
    },
    error: {
      icon: (
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center animate-scaleIn">
          <X className="w-10 h-10 text-red-600" />
        </div>
      ),
      text: "text-red-600",
      btnClass: "bg-red-600 hover:bg-red-700",
    },
  };

  const current = config[type];


  return (
    <div className={`fixed inset-0 z-[999999] flex items-center justify-center transition-all ${backgroundClasses[bgStyle]}`}>
      
      <div className="flex flex-col items-center gap-4 px-10 py-8 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl animate-fadeIn min-w-[280px]">
        {current.icon}
        
        {message && (
          <p className={`text-sm font-bold ${current.text} text-center`}>
            {message}
          </p>
        )}

        {showButton && (
          <button
            onClick={onButtonClick}
            className={`mt-2 px-6 py-2 rounded-lg text-white font-medium transition-all active:scale-95 ${current.btnClass}`}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}