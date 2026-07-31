import { useEffect } from "react";

import apiClient from "@/api/client";
import { setAccessToken } from "@/api/token";

export function useAuthBootstrap() {
  useEffect(() => {
    async function init() {
      try {
        const response = await apiClient.post("/auth/refresh");

        setAccessToken(response.data.data.accessToken);
      } catch (error) {
        console.log("No active session");
      }
    }

    init();
  }, []);
}
