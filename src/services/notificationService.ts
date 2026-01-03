import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

/**
 * Set up the notification handler to configure how notifications are displayed
 */
export const setupNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

/**
 * Get device information
 */
export const getDeviceInfo = () => {
  return {
    platform: Platform.OS as "android" | "ios",
    deviceId: Device.modelName || "unknown",
  };
};

/**
 * Validate Expo push token format
 */
export const isValidExpoPushToken = (token: string): boolean => {
  return /^ExponentPushToken\[.+\]$/.test(token);
};

/**
 * Request notification permissions and get Expo push token
 * Returns the token if successful, null otherwise
 */
export const getExpoPushToken = async (): Promise<string | null> => {
  try {
    // Check if running on a physical device
    if (!Device.isDevice) {
      console.warn("Push notifications only work on physical devices");
      return null;
    }

    // Request permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    // Get the Expo push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      console.error("Expo project ID not found in app.json");
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const token = tokenData.data;

    if (!isValidExpoPushToken(token)) {
      console.error("Invalid Expo push token format:", token);
      return null;
    }

    // Store token locally
    await AsyncStorage.setItem("expoToken", token);

    return token;
  } catch (error) {
    console.error("Error getting expo push token:", error);
    return null;
  }
};

/**
 * Register for push notifications and save token to backend
 * This function should be called after successful login
 */
export const registerForPushNotifications = async (
  registerTokenMutation: any
): Promise<boolean> => {
  try {
    const token = await getExpoPushToken();

    if (!token) {
      return false;
    }

    const { platform, deviceId } = getDeviceInfo();

    // Register token with backend
    await registerTokenMutation.mutateAsync({
      expoToken: token,
      platform,
      appType: "consumer" as const,
      deviceId,
    });

    console.log("Push notifications registered successfully");
    return true;
  } catch (error) {
    console.error("Failed to register push notifications:", error);
    return false;
  }
};

/**
 * Unregister push notifications
 * This function should be called on logout
 */
export const unregisterPushNotifications = async (
  removeTokenMutation: any
): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("expoToken");

    if (!token) {
      console.log("No expo token found to remove");
      return true;
    }

    // Remove token from backend
    await removeTokenMutation.mutateAsync({
      expoToken: token,
    });

    // Remove token from local storage
    await AsyncStorage.removeItem("expoToken");

    console.log("Push notifications unregistered successfully");
    return true;
  } catch (error) {
    console.error("Failed to unregister push notifications:", error);
    return false;
  }
};
