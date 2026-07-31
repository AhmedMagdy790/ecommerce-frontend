function required(value: string | undefined, key: string): string {
  if (!value) {
    throw new Error(`❌ Missing env variable: ${key}`);
  }
  return value;
}

export const env = {
  API_BASE_URL: required(import.meta.env.VITE_API_BASE_URL, "VITE_API_BASE_URL"),
  appName: import.meta.env.VITE_APP_NAME || "App",
  REVERB_APP_KEY: import.meta.env.VITE_REVERB_APP_KEY,
  REVERB_HOST: import.meta.env.VITE_REVERB_HOST,
  REVERB_PORT: import.meta.env.VITE_REVERB_PORT,
  REVERB_SCHEME: import.meta.env.VITE_REVERB_SCHEME,
  REVERB_APP_ID: import.meta.env.VITE_REVERB_APP_ID,
  
};

