// src/shared/store/softDeleteStats.helper.ts


// export function createSoftDeleteStatsHooks<TItem, TStats extends Stats>() {
//   return {
//     // يمكنك تخصيص ما يحدث عند عمل Trash أو Restore لتحديث الـ stats مباشرة
//     onTrashed(item: TItem, state: any) {
//       if (state.stats) {
//         // مثلاً: تقليل النشط/الإجمالي وزيادة الـ trashed حسب منطق العمل لديك
//         if ('is_active' in item && (item as any).is_active) {
//           state.stats.active = Math.max(0, state.stats.active - 1);
//         } else {
//           state.stats.inactive = Math.max(0, state.stats.inactive - 1);
//         }
//         state.stats.trashed = (state.stats.trashed || 0) + 1;
//       }
//     },
//     onRestored(item: TItem, state: any) {
//       if (state.stats) {
//         state.stats.trashed = Math.max(0, (state.stats.trashed || 0) - 1);
//         if ('is_active' in item && (item as any).is_active) {
//           state.stats.active += 1;
//         } else {
//           state.stats.inactive += 1;
//         }
//       }
//     },
//     onForceDeleted(id: number | string, state: any) {
//       if (state.stats) {
//         // إذا كان محذوفاً مسبقاً وتم حذفه نهائياً
//         state.stats.trashed = Math.max(0, (state.stats.trashed || 0) - 1);
//         state.stats.total = Math.max(0, (state.stats.total || 0) - 1);
//       }
//     }
//   };
// }