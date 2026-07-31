import  Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from '@/store/authStore';

// Define Pusher globally (required by Laravel Echo)
declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}
window.Pusher = Pusher;

// Validate environment variables safely
const reverbAppKey = import.meta.env.VITE_PUSHER_APP_KEY;

if (!reverbAppKey) {
  console.error("❌ VITE_PUSHER_APP_KEY is missing from your environment variables!");
}

console.log(`${import.meta.env.VITE_BASE_URL || ''}/broadcasting/auth`)
// Instantiate Laravel Echo with Reverb / Pusher
const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  wsHost: import.meta.env.VITE_PUSHER_HOST,
  wsPort: Number(import.meta.env.VITE_PUSHER_PORT),
  forceTLS: import.meta.env.VITE_PUSHER_SCHEME === "https",
  enabledTransports: ['ws', 'wss'],
  
  // Authentication endpoint configuration for Private/Presence Channels
  authEndpoint: `${import.meta.env.VITE_BASE_URL || ''}/broadcasting/auth`,
  auth: {
    headers: {
      get Authorization() {
        // Dynamically fetch from Zustand store first, falling back to localStorage
        const token = useAuthStore.getState().accessToken;
        return token ? `Bearer ${token}` : '';
      },
      Accept: 'application/json',
    },
  },
});

window.Echo = echo;

export default echo;