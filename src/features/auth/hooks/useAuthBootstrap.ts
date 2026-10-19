// import { useEffect } from "react";


// import { authApi } from "@/api/client";
// import { useAuthStore } from "@/features/auth/model/store/useAuthStore";

// export function useAuthBootstrap() {
//   useEffect(() => {
//     async function init() {
//       try {
//         const response = await authApi.refresh();

//         console.log("response", response)
//         const newToken = response.data?.data?.accessToken;

//         if (!newToken) {
//           throw new Error("No access token returned");
//         }

//         useAuthStore.getState().setAccessToken(newToken);
//       } catch (error) {
//         void error;
//         console.log("No active session");
//       }
//     }

//     init();
//   }, []);
// }
