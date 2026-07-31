
// import { echo } from '@/lib/echo';
// import { useOrderStore } from '../store/useOrderStore';
// import { IOrder } from '../types/types';



// export const subscribeToOrderEvents = (userId: number) => {
//     let unsubscribe: (() => void) | null = null;


//     const channel = echo.private(`orders.${userId}`);

//     channel
//         .listen('.OrderCancelledEvent', (e: { order: { id: number } }) => {
//             console.log('Event Received: OrderCancelledEvent', e);
//             useOrderStore.getState().handleOrderCancelled(e.order.id);
//         })
//         // .listen('.OrderStatusUpdatedEvent', (e: { order: IOrder }) => {
//         //     console.log('Event Received: OrderStatusUpdatedEvent', e);
//         //     useOrderStore.getState().handleOrderUpdated(e.order);
//         // })
//         .error((error: any) => {
//             console.error('Echo Channel Error:', error);
//         });

//     channel.notification((notification: any) => {
//         console.log('Notification received:', notification);
//     });

//     // تعيين دالة التنظيف
//     unsubscribe = () => {
//         echo.leaveChannel(`orders.${userId}`);
//     };

//     // إرجاع دالة التنظيف (ستعمل بمجرد استدعائها لاحقاً)
//     return () => {
//         if (unsubscribe) unsubscribe();
//     };
// };