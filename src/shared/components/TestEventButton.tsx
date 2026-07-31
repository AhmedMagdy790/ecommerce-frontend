import { useState } from "react";
import { testEventService } from "@/services/testEventService";

export default function TestEventButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTriggerEvent = async () => {
    try {
      setLoading(true);
      setMessage("");

      // استدعاء الـ API لتشغيل الحدث
      const response = await testEventService.triggerTestOrderEvent();
      
      setMessage("تم إرسال الحدث بنجاح! تحقق من استقبال الإشعار.");
      console.log("Response:", response);
    } catch (error) {
      console.error("Error triggering event:", error);
      setMessage("فشل إرسال الحدث، تأكد من تسجيل الدخول والصلاحيات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col items-start gap-3">
      <button
        onClick={handleTriggerEvent}
        disabled={loading}
        className="
          px-4 py-2 
          bg-[var(--color-primary)] text-white 
          rounded-xl font-medium
          hover:opacity-90 transition-opacity
          disabled:opacity-50
        "
      >
        {loading ? "جاري الإرسال..." : "إرسال حدث طلب جديد تجريبي"}
      </button>

      {message && (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {message}
        </p>
      )}
    </div>
  );
}