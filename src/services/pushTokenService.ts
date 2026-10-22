import { Platform } from "react-native";

import { supabase } from "./supabase";

/* ==========================================================
   SAVE / UPDATE PUSH TOKEN
========================================================== */

export async function savePushToken(
    expoPushToken: string
) {
    const cleanToken =
        expoPushToken.trim();

    if (!cleanToken) {
        throw new Error(
            "Expo push token is empty."
        );
    }

    const platform =
        Platform.OS === "ios"
            ? "ios"
            : "android";

    const { error } =
        await supabase
            .from("push_tokens")
            .upsert(
                {
                    expo_push_token:
                        cleanToken,

                    platform,

                    is_active: true,

                    updated_at:
                        new Date().toISOString(),
                },
                {
                    onConflict:
                        "expo_push_token",
                }
            );

    if (error) {
        throw error;
    }

    console.log(
        "Push token registered successfully."
    );

    return cleanToken;
}

/* ==========================================================
   DEACTIVATE PUSH TOKEN
========================================================== */

export async function deactivatePushToken(
    expoPushToken: string
) {
    const cleanToken =
        expoPushToken.trim();

    if (!cleanToken) {
        return;
    }

    const { error } =
        await supabase
            .from("push_tokens")
            .update({
                is_active: false,

                updated_at:
                    new Date().toISOString(),
            })
            .eq(
                "expo_push_token",
                cleanToken
            );

    if (error) {
        throw error;
    }
}