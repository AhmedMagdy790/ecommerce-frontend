import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { socketConnection } from '@/lib/socket';

export const useAuthEvents = () => {
    const { user, logout } = useAuthStore();
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!user?.id) return;

        const channel = socketConnection.private(`User.${user.id}`);

        channel.listen(".SessionExpired", (data: any) => {
            console.log("🔔 إشارة سوكت مستلمة!", data);
            
            // ضبط الوقت المتبقي (مثلاً 60 ثانية)
            let counter = data.expires_in || 60;
            setSecondsLeft(counter);

            const timer = setInterval(() => {
                counter--;
                setSecondsLeft(counter);

                if (counter <= 0) {
                    clearInterval(timer);
                    logout(); // تسجيل الخروج الفعلي
                    window.location.href = '/login';
                }
            }, 1000);

            return () => clearInterval(timer);
        });

        return () => {
            socketConnection.leave(`User.${user.id}`);
        };
    }, [user?.id, logout]);

    return { secondsLeft }; // نعيد الوقت المتبقي لاستخدامه في الشاشة
};