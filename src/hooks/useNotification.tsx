import {  readUserId, sendCredentialService } from "@/services/NotificationService";
import { useCallback } from "react";

const useNotification = () => {
  const getNotification = useCallback(async (userId: any, key: any, replacements?:any) => {
    try {
      //   const userId = localStorage.getItem("userId");

      // if (!userId) {
      //   console.error("User ID is not found in local storage.");
      //   return;
      // }
      console.log("dvicce id", userId);
      

      const userDetails = await readUserId(userId, false);
      console.log("API Response:", userDetails);

      const deviceId = userDetails?.result?.userData?.deviceId;

      console.log("Device ID from API:", deviceId);

      if (true) {
        const result = await sendCredentialService({
          isQueue: false,
          context: "USER",
          key: key,
        replacements: replacements,
          push: {
            receipients: [deviceId],
          },
        });

        console.log("Notification sent successfully:", result);
      } else {
        console.log("No deviceId found in user details.");
      }
    } catch (error) {
      console.error("Error in getNotification:", error);
    }
  }, []);

  return { getNotification };
};

export default useNotification;
