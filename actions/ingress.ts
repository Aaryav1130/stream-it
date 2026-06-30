"use server";

import {
    IngressAudioEncodingPreset,
    IngressInput,
    IngressClient,
    IngressVideoEncodingPreset,
    RoomServiceClient,
    TrackSource,
    type CreateIngressOptions,
    IngressVideoOptions,
    IngressAudioOptions
} from "livekit-server-sdk";


import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

const roomService = new RoomServiceClient(
    process.env.LIVEKIT_API_URL!,
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
);

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!, process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRateLimitedError = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    return message.includes("status 429");
};

const runWithLivekitRetry = async <T>(operation: () => Promise<T>, maxAttempts = 4): Promise<T> => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            const shouldRetry = isRateLimitedError(error) && attempt < maxAttempts;

            if (!shouldRetry) {
                throw error;
            }

            const backoffMs = 500 * Math.pow(2, attempt - 1);
            await sleep(backoffMs);
        }
    }

    throw lastError;
};

export const resetIngress = async (hostIdentity: string) => {
    const ingresses = await runWithLivekitRetry(() => ingressClient.listIngress({
        roomName: hostIdentity,
    }));

    const rooms = await runWithLivekitRetry(() => roomService.listRooms([hostIdentity]));

    for (const room of rooms) {
        await runWithLivekitRetry(() => roomService.deleteRoom(room.name));
    }

    for (const ingress of ingresses) {
        if(ingress.ingressId){
            await runWithLivekitRetry(() => ingressClient.deleteIngress(ingress.ingressId!));
        }
    }
}


export const createIngress = async (ingressType: IngressInput) => {
    const self = await getSelf();

    await resetIngress(self.id);

    const options: CreateIngressOptions = {
        name: self.username,
        roomName: self.id,
        participantName: self.username,
        participantIdentity: self.id,
    };

    if (ingressType === IngressInput.RTMP_INPUT) {
        options.video = new IngressVideoOptions({
            source: TrackSource.CAMERA,
            encodingOptions: {
                case: "preset",
                value: IngressVideoEncodingPreset.H264_1080P_30FPS_1_LAYER,
            },
        });

        options.audio = new IngressAudioOptions({
            source: TrackSource.MICROPHONE,
            encodingOptions: {
                case: "preset",
                value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
            },
        });
    }

    const ingress = await runWithLivekitRetry(
        () => ingressClient.createIngress(ingressType, options),
    );

    if(!ingress || !ingress.url || !ingress.streamKey){
        throw new Error("Failed to create ingress");
    }

    await db.stream.update({
        where: {userId: self.id},
        data: {
            ingressId: ingress.ingressId,
            serverUrl: ingress.url,
            streamKey: ingress.streamKey,
        },
    });

    revalidatePath(`/u/${self.username}/keys`);

    return ingress;
}
