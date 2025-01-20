import { readUserId, sendCredentialService } from "@/services/NotificationService";
import { useCallback } from "react";

const useNotification = () => {
  const getNotification = useCallback(async (deviceId: any, key: any, replacements?: any) => {
    try {


      const result = await sendCredentialService({
        isQueue: false,
        context: "USER",
        key: key,
        replacements: replacements,
        push: {
          receipients: deviceId,
        },
      });

      console.log("Notification sent successfully:", result);

    } catch (error) {
      console.error("Error in getNotification:", error);
    }
  }, []);

  return { getNotification };
};

export default useNotification;
