 want to implement expo token in this consumer app .

 here is api doc for this -

 # Consumer App - Expo Push Notification API Documentation

## Overview

This document describes the API endpoints for managing Expo push notification tokens in the **Consumer Mobile App**. These endpoints allow users to register their devices to receive push notifications about order updates.

---

## Base URL

```
https://your-api-domain.com/api/v1
```

> **Note:** The token endpoints are at `/api/v1/token/expo`, not under `/user` path. The authentication middleware accepts both user and admin tokens.

---

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <user_access_token>
```

---

## Endpoints

### 1. Register/Update Push Token

Register or update the Expo push notification token for the current user's device.

**Endpoint:** `POST /token/expo`

**Headers:**

```http
Content-Type: application/json
Authorization: Bearer <user_access_token>
```

**Request Body:**

```json
{
  "expoToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "platform": "android",
  "appType": "consumer",
  "deviceId": "optional-unique-device-identifier"
}
```

**Request Parameters:**

| Parameter | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| expoToken | string | Yes      | The Expo push token obtained from the device |
| platform  | string | No       | Device platform: `"android"` or `"ios"`      |
| appType   | string | Yes      | Must be `"consumer"` for consumer app        |
| deviceId  | string | No       | Optional unique device identifier            |

**Success Response:**

```json
{
  "success": true,
  "message": "Token saved successfully",
  "token": {
    "_id": "65abc123def456789",
    "userId": "65xyz789abc123456",
    "expoToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "platform": "android",
    "appType": "consumer",
    "deviceId": "device-123",
    "isActive": true,
    "lastActive": "2026-01-03T10:28:15.000Z"
  }
}
```

**Error Responses:**

| Status Code | Message                                      | Description                             |
| ----------- | -------------------------------------------- | --------------------------------------- |
| 400         | Expo token is required                       | Missing expo token in request body      |
| 400         | Invalid Expo push token format               | Token format is invalid                 |
| 400         | appType must be either 'consumer' or 'admin' | Invalid appType value                   |
| 401         | User not authenticated                       | Missing or invalid authentication token |

**Example Request (JavaScript/React Native):**

```javascript
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function registerForPushNotifications() {
  // Request permissions
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Push notification permission required!");
    return;
  }

  // Get Expo push token
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: "your-expo-project-id",
  });

  // Get user authentication token
  const authToken = await AsyncStorage.getItem("authToken");

  // Register token with backend
  const response = await fetch(
    "https://your-api-domain.com/api/v1/token/expo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        expoToken: token.data,
        platform: Platform.OS,
        appType: "consumer",
        deviceId: DeviceInfo.getUniqueId(), // Optional
      }),
    }
  );

  const data = await response.json();
  console.log("Token registered:", data);
}
```

---

### 2. Remove Push Token

Remove the Expo push notification token (e.g., when user logs out).

**Endpoint:** `DELETE /token/expo`

**Headers:**

```http
Content-Type: application/json
Authorization: Bearer <user_access_token>
```

**Request Body:**

```json
{
  "expoToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

**Request Parameters:**

| Parameter | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| expoToken | string | Yes      | The Expo push token to remove |

**Success Response:**

```json
{
  "success": true,
  "message": "Token removed successfully"
}
```

**Error Responses:**

| Status Code | Message                | Description                             |
| ----------- | ---------------------- | --------------------------------------- |
| 400         | Expo token is required | Missing expo token in request body      |
| 401         | User not authenticated | Missing or invalid authentication token |
| 404         | Token not found        | Token doesn't exist for this user       |

**Example Request (JavaScript/React Native):**

```javascript
async function unregisterPushNotifications() {
  const authToken = await AsyncStorage.getItem("authToken");
  const expoToken = await AsyncStorage.getItem("expoToken");

  const response = await fetch(
    "https://your-api-domain.com/api/v1/token/expo",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        expoToken: expoToken,
      }),
    }
  );

  const data = await response.json();
  console.log("Token removed:", data);
}
```

---

### 3. Get User Tokens (Debug)

Retrieve all registered Expo push tokens for the current user. Useful for debugging.

**Endpoint:** `GET /token/expo`

**Headers:**

```http
Authorization: Bearer <user_access_token>
```

**Success Response:**

```json
{
  "success": true,
  "count": 2,
  "tokens": [
    {
      "_id": "65abc123def456789",
      "userId": "65xyz789abc123456",
      "expoToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
      "platform": "android",
      "appType": "consumer",
      "deviceId": "device-123",
      "isActive": true,
      "lastActive": "2026-01-03T10:28:15.000Z"
    },
    {
      "_id": "65def456ghi789012",
      "userId": "65xyz789abc123456",
      "expoToken": "ExponentPushToken[yyyyyyyyyyyyyyyyyyyyyy]",
      "platform": "ios",
      "appType": "consumer",
      "deviceId": "device-456",
      "isActive": false,
      "lastActive": "2026-01-02T08:15:30.000Z"
    }
  ]
}
```

**Error Responses:**

| Status Code | Message                | Description                             |
| ----------- | ---------------------- | --------------------------------------- |
| 401         | User not authenticated | Missing or invalid authentication token |

**Example Request (JavaScript/React Native):**

```javascript
async function getUserTokens() {
  const authToken = await AsyncStorage.getItem("authToken");

  const response = await fetch(
    "https://your-api-domain.com/api/v1/token/expo",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  const data = await response.json();
  console.log("User tokens:", data);
}
```

---

## Notification Triggers

When the consumer app registers tokens, the user will receive push notifications for the following events:

### Order Status Updates

When an admin updates the order status, users receive notifications:

| Status     | Notification Title  | Notification Body                              |
| ---------- | ------------------- | ---------------------------------------------- |
| shipped    | Order Shipped! 🚚   | Your order has been shipped and is on the way! |
| delivered  | Order Delivered! ✅ | Your order has been delivered successfully!    |
| cancelled  | Order Cancelled     | Your order has been cancelled                  |

**Notification Data Payload:**

```json
{
  "orderId": "65abc123def456789",
  "status": "shipped"
}
```

---

## Integration Guide

### Step 1: Install Dependencies

```bash
npx expo install expo-notifications expo-device
```

### Step 2: Configure Notifications

```javascript
import * as Notifications from "expo-notifications";

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

### Step 3: Request Permissions & Register Token

```javascript
import { useEffect } from "react";

useEffect(() => {
  registerForPushNotifications();

  // Listen for notifications
  const subscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notification received:", notification);
    }
  );

  // Handle notification tap
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      // Navigate to order detail screen
      if (data.orderId) {
        navigation.navigate("OrderDetail", { orderId: data.orderId });
      }
    });

  return () => {
    subscription.remove();
    responseSubscription.remove();
  };
}, []);
```

### Step 4: Unregister on Logout

```javascript
async function handleLogout() {
  await unregisterPushNotifications();
  await AsyncStorage.clear();
  navigation.navigate("Login");
}
```

---

## Best Practices

1. **Register on Login**: Call the register endpoint after successful login
2. **Unregister on Logout**: Call the remove endpoint when user logs out
3. **Handle Permissions**: Always check and request notification permissions
4. **Store Token Locally**: Save expo token locally to avoid unnecessary API calls
5. **Update Regularly**: Update the token on app launch to ensure it's active
6. **Handle Navigation**: Use notification data to navigate to relevant screens

---

## Troubleshooting

### Token Registration Fails

- Ensure you're using a valid Expo push token format
- Verify authentication token is valid
- Check that `appType` is set to `"consumer"`

### Not Receiving Notifications

- Verify token is registered and active
- Check notification permissions on device
- Ensure app is properly configured in Expo
- Verify device is not in Do Not Disturb mode

### Duplicate Tokens

- Multiple devices for the same user will create multiple token records
- This is expected behavior and allows multi-device support

---

## Support

For issues or questions, contact the backend development team.
