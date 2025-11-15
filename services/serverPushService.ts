/**
 * Server-Side Push Notification Service
 * Handles sending browser push notifications from the server
 *
 * Note: This service is deprecated. Push subscriptions are now stored in-memory
 * and this file is kept for reference only. The web-push dependency is not installed.
 */

// import * as webpush from "web-push";

// Stub for deprecated web-push
const webpush = {
  setVAPIDDetails: (_subject: string, _publicKey: string, _privateKey: string) => {},
  sendNotification: (_subscription: any, _payload: string) => Promise.reject(new Error("Push notifications not configured")),
};

// Initialize VAPID details
const initializeVAPID = () => {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:noreply@yourdomain.com";

  if (publicKey && privateKey) {
    webpush.setVAPIDDetails(subject, publicKey, privateKey);
    console.log("✅ VAPID details configured (deprecated)");
    return true;
  } else {
    console.warn(
      "⚠️ VAPID keys not configured. Push notifications will not work."
    );
    console.warn("Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY");
    return false;
  }
};

// Initialize on module load
const isConfigured = initializeVAPID();

/**
 * Send a push notification to a single subscription
 */
export async function sendPushNotification(
  subscription: any,
  notification: {
    title: string;
    message: string;
    postId?: number;
    actionUrl?: string;
    icon?: string;
    badge?: string;
  }
): Promise<{ success: boolean; expired?: boolean; error?: string }> {
  if (!isConfigured) {
    return {
      success: false,
      error: "VAPID keys not configured",
    };
  }

  try {
    const payload = JSON.stringify({
      title: notification.title,
      message: notification.message,
      icon: notification.icon || "/next.svg",
      badge: notification.badge || "/next.svg",
      tag: notification.postId ? `post-${notification.postId}` : "notification",
      data: {
        url: notification.actionUrl || "/",
        postId: notification.postId,
        timestamp: Date.now(),
      },
      requireInteraction: false,
    });

    await webpush.sendNotification(subscription, payload);
    console.log(`✅ Push notification sent successfully`);

    return { success: true };
  } catch (error: any) {
    // Handle specific error cases
    if (error.statusCode === 410) {
      // 410 Gone - subscription is no longer valid
      console.log("⚠️ Subscription expired (410 Gone)");
      return {
        success: false,
        expired: true,
        error: "Subscription expired",
      };
    }

    if (error.statusCode === 401 || error.statusCode === 403) {
      // Authentication error - usually invalid VAPID keys
      console.error("❌ Authentication error - check VAPID keys");
      return {
        success: false,
        error: "Invalid VAPID keys",
      };
    }

    console.error("Error sending push notification:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send push notification to multiple subscriptions (batch)
 */
export async function sendPushNotificationToSubscriptions(
  subscriptions: any[],
  notification: {
    title: string;
    message: string;
    postId?: number;
    actionUrl?: string;
    icon?: string;
    badge?: string;
  }
): Promise<{
  total: number;
  sent: number;
  failed: number;
  expired: number;
  errors: Array<{ index: number; error: string }>;
}> {
  if (!subscriptions || subscriptions.length === 0) {
    console.log("No subscriptions provided");
    return {
      total: 0,
      sent: 0,
      failed: 0,
      expired: 0,
      errors: [],
    };
  }

  console.log(
    `📢 Sending push notification to ${subscriptions.length} subscriptions...`
  );

  let sent = 0;
  let failed = 0;
  let expired = 0;
  const errors: Array<{ index: number; error: string }> = [];
  const expiredSubscriptions: any[] = [];

  // Send to all subscriptions in parallel
  const results = await Promise.allSettled(
    subscriptions.map((sub, index) =>
      sendPushNotification(sub, notification).then((result) => ({
        ...result,
        index,
        subscription: sub,
      }))
    )
  );

  // Process results
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      const { success, expired: isExpired, error, index, subscription } =
        result.value;

      if (success) {
        sent++;
      } else {
        failed++;

        if (isExpired) {
          expired++;
          expiredSubscriptions.push(subscription);
        }

        if (error) {
          errors.push({ index, error });
        }
      }
    } else {
      failed++;
      console.error("Promise rejected:", result.reason);
    }
  });

  console.log(
    `📊 Push notification results: Sent=${sent}, Failed=${failed}, Expired=${expired}`
  );

  return {
    total: subscriptions.length,
    sent,
    failed,
    expired,
    errors,
  };
}

/**
 * Send push to all users (convenience function)
 * Note: In production, you'd want to batch this or use a queue system
 */
export async function sendBroadcastPushNotification(
  subscriptions: any[],
  notification: {
    title: string;
    message: string;
    postId?: number;
    actionUrl?: string;
  }
): Promise<{ success: boolean; stats?: any; error?: string }> {
  try {
    const stats = await sendPushNotificationToSubscriptions(subscriptions, {
      title: notification.title,
      message: notification.message,
      postId: notification.postId,
      actionUrl: notification.actionUrl,
    });

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error("Error sending broadcast push notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Validate a push subscription
 */
export function isValidSubscription(subscription: any): boolean {
  if (!subscription) return false;

  return (
    subscription.endpoint &&
    typeof subscription.endpoint === "string" &&
    subscription.keys &&
    subscription.keys.auth &&
    subscription.keys.p256dh
  );
}

/**
 * Get push subscription from JSON
 */
export function parsePushSubscription(subscriptionJson: any): any {
  if (!subscriptionJson) return null;

  return {
    endpoint: subscriptionJson.endpoint,
    keys: {
      auth: subscriptionJson.keys?.auth,
      p256dh: subscriptionJson.keys?.p256dh,
    },
  };
}

/**
 * Check if VAPID is configured
 */
export function isVAPIDConfigured(): boolean {
  return isConfigured;
}
