/**
 * Push Notification Service
 * Handles browser push notifications and Service Worker registration
 */

// Check if push notifications are supported
export const isPushNotificationSupported = (): boolean => {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window;
};

// Get public key from environment
const getPublicKey = (): string => {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!key) {
    console.warn(
      "Push notification public key not found. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY in environment."
    );
  }
  return key || "";
};

// Convert base64 to Uint8Array
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

// Register Service Worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  try {
    if (!isPushNotificationSupported()) {
      console.log("Push notifications not supported in this browser");
      return null;
    }

    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    console.log("✅ Service Worker registered successfully");
    return registration;
  } catch (error) {
    console.error("❌ Service Worker registration failed:", error);
    return null;
  }
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!isPushNotificationSupported()) {
      console.log("Push notifications not supported");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const publicKey = getPublicKey();

    if (!publicKey) {
      console.error("VAPID public key is required for push subscriptions");
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
    });

    console.log("✅ Push notification subscription created");

    // Send subscription to server
    await savePushSubscription(subscription);

    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return null;
  }
};

// Save push subscription to database
export const savePushSubscription = async (
  subscription: PushSubscription
): Promise<boolean> => {
  try {
    const response = await fetch("/api/push-subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save push subscription");
    }

    console.log("✅ Push subscription saved to server");
    return true;
  } catch (error) {
    console.error("Error saving push subscription:", error);
    return false;
  }
};

// Check if user is already subscribed
export const checkPushSubscription = async (): Promise<PushSubscription | null> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error("Error checking push subscription:", error);
    return null;
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  try {
    const subscription = await checkPushSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log("✅ Unsubscribed from push notifications");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
    return false;
  }
};

// Show local notification
export const showLocalNotification = (
  title: string,
  options?: NotificationOptions
) => {
  try {
    if (!isPushNotificationSupported()) {
      console.log("Push notifications not supported");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, {
        icon: "/next.svg",
        badge: "/next.svg",
        ...options,
      });
    }
  } catch (error) {
    console.error("Error showing notification:", error);
  }
};

// Initialize push notifications
export const initializePushNotifications = async (): Promise<void> => {
  try {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Register service worker
    await registerServiceWorker();

    // Request permission
    const hasPermission = await requestNotificationPermission();

    if (hasPermission) {
      // Check if already subscribed
      const existing = await checkPushSubscription();

      if (!existing) {
        // Subscribe to push notifications
        await subscribeToPushNotifications();
      } else {
        console.log("✅ Already subscribed to push notifications");
      }
    } else {
      console.log(
        "User denied notification permission. Push notifications disabled."
      );
    }
  } catch (error) {
    console.error("Error initializing push notifications:", error);
  }
};
