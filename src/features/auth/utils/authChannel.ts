
export type AuthEventType = "LOGIN" | "LOGOUT";

export function broadcastAuthEvent(type: AuthEventType) {
    if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("auth-channel");

        channel.postMessage({ type });
        channel.close();
        return;
    }

    localStorage.setItem(
        "auth:event",
        JSON.stringify({ type, id: crypto.randomUUID() })
    );
}

export function subscribeAuthEvents(
    callback: (type: AuthEventType) => void
) {
    const handleMessage = (event: MessageEvent) => {
        if (
            event.data?.type === "LOGIN" ||
            event.data?.type === "LOGOUT"
        ) {
            callback(event.data.type);
        }
    };

    let channel: BroadcastChannel | null = null;

    if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel("auth-channel");
        channel.addEventListener("message", handleMessage);
    }

    const handleStorage = (event: StorageEvent) => {
        if (event.key !== "auth:event" || !event.newValue) return;

        try {
            const data = JSON.parse(event.newValue);

            if (data.type === "LOGIN" || data.type === "LOGOUT") {
                callback(data.type);
            }
        } catch {
            // تجاهل الحدث غير الصحيح
        }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
        channel?.removeEventListener("message", handleMessage);
        channel?.close();
        window.removeEventListener("storage", handleStorage);
    };
}
