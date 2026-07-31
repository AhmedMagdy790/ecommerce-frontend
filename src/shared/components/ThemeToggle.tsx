import { Moon, Sun } from 'lucide-react';
import { useUIStore } from '@/shared/store/uiStore';

export const ThemeToggle = () => {
  const { theme, setTheme } = useUIStore();
  
  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="absolute top-10 right-10 p-3 rounded-full glass-effect z-50 hover:scale-110 transition-transform"
    >
      {theme === 'dark' ? <Sun size={20} color="white" /> : <Moon size={20} color="#0f172a" />}
    </button>
  );
};