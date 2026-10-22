import { Stack } from "expo-router";

import { useNotifications } from "../hooks/useNotifications";

export default function RootLayout() {
  /* ========================================================
     NOTIFICATION SYSTEM
  ======================================================== */

  useNotifications();

  /* ========================================================
     ROUTER
  ======================================================== */

  return (
    <Stack
      screenOptions={{
        headerShown: false,

        animation:
          "slide_from_right",

        contentStyle: {
          backgroundColor:
            "#050816",
        },
      }}
    />
  );
}