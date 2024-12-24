
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    NEXT_PUBLIC_FCM_API_KEY: string | undefined | null;
    NEXT_PUBLIC_FCM_VAPID_KEY: string | undefined | null;
    NEXT_PUBLIC_FCM_AUTH_DOMAIN: string | undefined | null;
    NEXT_PUBLIC_FCM_PROJECT_FCM_ID: string | undefined | null;
    NEXT_PUBLIC_FCM_STORAGE_BUCKET: string | undefined | null;
    NEXT_PUBLIC_FCM_MESSAGING_SENDER: string | undefined | null;
    NEXT_PUBLIC_FCM_FCM_APP_ID: string | undefined | null;
    NEXT_PUBLIC_FCM_MEASUREMENT_ID: string | undefined | null;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.status(200).json({
        NEXT_PUBLIC_FCM_API_KEY: process.env.NEXT_PUBLIC_FCM_API_KEY,
        NEXT_PUBLIC_FCM_VAPID_KEY: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
        NEXT_PUBLIC_FCM_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
        NEXT_PUBLIC_FCM_PROJECT_FCM_ID: process.env.NEXT_PUBLIC_FCM_PROJECT_FCM_ID,
        NEXT_PUBLIC_FCM_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
        NEXT_PUBLIC_FCM_MESSAGING_SENDER: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER,
        NEXT_PUBLIC_FCM_FCM_APP_ID: process.env.NEXT_PUBLIC_FCM_FCM_APP_ID,
        NEXT_PUBLIC_FCM_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID,
    });
}
