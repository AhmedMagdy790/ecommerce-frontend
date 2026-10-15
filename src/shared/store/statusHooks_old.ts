// src/shared/store/statusHooks.ts

// import {
//   useStatusCenter,
//   type EntityKey,
//   type StatusEntity,
//   type EntityStats,
// } from "./stats.store";

// /* =========================================================
//  * Types
//  * =======================================================*/

// type ExtractStats<TResponse, TStats> = (
//   response: TResponse,
// ) => TStats | null | undefined;

// export interface StatusHooksOptions<TItem> {
//   getActiveStatus: (item: TItem) => boolean;
// }

// /* =========================================================
//  * Factory
//  * =======================================================*/

// export function createStatusHooks<
//   TItem,
//   TEntity extends EntityKey,
// >(
//   entity: TEntity,
//   options?: TEntity extends StatusEntity
//     ? StatusHooksOptions<TItem>
//     : never,
// ) {
//   const getStatusCenter = () =>
//     useStatusCenter.getState();

//   return {
//     /* =====================================================
//      * CRUD
//      * ===================================================*/

//     crud: {
//       onFetched: <TResponse>(
//         response: TResponse,
//         extractStats?: ExtractStats<
//           TResponse,
//           EntityStats<TEntity>
//         >,
//       ) => {
//         const stats = extractStats?.(response);

//         if (stats == null) {
//           return;
//         }

//         getStatusCenter().set(entity, stats);
//       },

//       onCreated: (item: TItem) => {
//         if (!options) {
//           return;
//         }

//         getStatusCenter().create(
//           entity as StatusEntity,
//           options.getActiveStatus(item),
//         );
//       },

//       onDeleted: (
//         _id: number | string,
//         previousItem?: TItem,
//       ) => {
//         if (!options || !previousItem) {
//           return;
//         }

//         getStatusCenter().delete(
//           entity as StatusEntity,
//           options.getActiveStatus(previousItem),
//         );
//       },
//     },

//     /* =====================================================
//      * Soft Delete
//      * ===================================================*/

//     softDelete: {
//       onTrashed: (item: TItem) => {
//         if (!options) {
//           return;
//         }

//         getStatusCenter().trash(
//           entity as StatusEntity,
//           options.getActiveStatus(item),
//         );
//       },

//       onRestored: (item: TItem) => {
//         if (!options) {
//           return;
//         }

//         getStatusCenter().restore(
//           entity as StatusEntity,
//           options.getActiveStatus(item),
//         );
//       },

//       onForceDeleted: () => {
//         if (!options) {
//           return;
//         }

//         getStatusCenter().forceDelete(
//           entity as StatusEntity,
//         );
//       },
//     },

//     /* =====================================================
//      * Toggle
//      * ===================================================*/

//     onToggled: (item: TItem) => {

//       if (!options) {
//         return;
//       }

//       const isActive =
//         options.getActiveStatus(item);

//       getStatusCenter().toggle(
//         entity as StatusEntity,
//         !isActive,
//       );
//     },
//   };
// }