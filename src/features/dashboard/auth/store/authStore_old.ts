// import { create } from "zustand";
// import { persist, createJSONStorage } from 'zustand/middleware';
// import type { IAuthState, IUser, ILoginPayload, IRegisterPayload } from "@/features/dashboard/auth/types/authType";
// import { authService } from "../features/dashboard/auth/services/authService";



// export const useAuthStore = create<IAuthState>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       accessToken: null,
//       accessTokenTimeout: null,
//       refreshAccessTokenTimeout: null,
//       isAuthenticated: false,
//       isLoading: false,
//       isLoggingOut: false,


//       setAccessToken: (token: string) => set({ accessToken: token }),

//       setUser: (user: IUser) => set({ user }), 

//       clearAuth: () => {
//         const timeout = get().accessTokenTimeout;
//         if (timeout) clearTimeout(timeout);
//         set({
//           accessToken: null,
//           user: null,
//           accessTokenTimeout: null,
//           refreshAccessTokenTimeout: null,
//           isAuthenticated: false,
//           isLoading: false,
//           isLoggingOut: false,
//         });
//       },

//       login: async (data: ILoginPayload) => {
//           set({ isLoading: true });
//           try {
//               const response = await authService.login(data);
//               console.log(response)
//               const { accessToken, user, expires_in } = response;

//               // تنظيف أي تايمر قديم عالق قبل البدء بجديد
//               const existingTimeout = get().accessTokenTimeout;
//               if (existingTimeout) clearTimeout(existingTimeout);

//               // تجديد قبل الانتهاء بدقيقة (أو 60 ثانية)
//               const delay = Math.max((expires_in - 60) * 1000, 0); 
              
//               const timeout = setTimeout(() => {
//                   // تحقق: هل لا يزال المستخدم مسجلاً للدخول قبل التجديد؟
//                   if (get().isAuthenticated) {
//                       get().updateAccessToken(false);
//                   }
//               }, delay);

//               set({
//                   user,
//                   accessToken,
//                   accessTokenTimeout: timeout,
//                   isAuthenticated: true,
//                   isLoading: false
//               });

//               return true;
//           } catch (error) {
//               set({ isLoading: false });
//               throw error; // رمي الخطأ ليتم معالجته في واجهة المستخدم (Form)
//           }
//       },

//       createAcount: async (data: IRegisterPayload) => {
//         set({ isLoading: true });
//         try {
//           await authService.register(data);
//           await get().updateAccessToken(true);
//         } catch (error) {
//           set({ isLoading: false });
//           throw error;
//         }
//       },

//       updateAccessToken: async (showLoading = false) => {
//         if (showLoading) set({ isLoading: true });

//         try {
//             // 1. طلب التجديد من السيرفر
//             const data = await authService.updateAccessToken();
//             const { accessToken, expires_in } = data;

//             // 2. تحديث التوكن في الحالة
//             set({ accessToken, isAuthenticated: true });

//             // 3. إعادة جدولة التجديد القادم (هذه الخطوة تضمن استمرار الحلقة)
//             const currentTimeout = get().accessTokenTimeout;
//             if (currentTimeout) clearTimeout(currentTimeout);

//             const delay = (expires_in - 60) * 1000; // تجديد قبل الانتهاء بدقيقة
//             const newTimeout = setTimeout(() => {
//                 get().updateAccessToken(false);
//             }, delay);

//             set({ accessTokenTimeout: newTimeout });

//         } catch (error) {
//             // إذا فشل التجديد (مثلاً انتهت صلاحية الـ refresh_token)، قم بتسجيل الخروج
//             get().clearAuth();
//         } finally {
//             if (showLoading) set({ isLoading: false });
//         }
//     },


//       updateRefreshAccessToken: async () => {
     
//         return get().updateAccessToken();
//       },

//       logout: async () => {
//         if (get().isLoggingOut) return;
//         set({ isLoggingOut: true });
//         try {
//           await authService.logout();
//         } finally {
//           get().clearAuth();
//         }
//       },

//       fetchUser: async () => {
//         set({ isLoading: true });
//         try {
//           const { user } = await authService.me();
//           set({ user, isAuthenticated: true });
//         } catch (error) {
//           get().clearAuth();
//           throw error;
//         } finally {
//           set({ isLoading: false });
//         }
//       },
//     }),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         user: state.user,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     }
//   )
// );