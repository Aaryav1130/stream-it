import { currentUser } from "@clerk/nextjs"
import { db } from "@/lib/db"

const ensureUser = async () => {
    const self = await currentUser();

    if(!self || !self.username){
        throw new Error("Unauthorized")
    }

    const user = await db.user.upsert({
        where: {
            externalUserId: self.id,
        },
        update: {
            username: self.username,
            imageUrl: self.imageUrl,
        },
        create: {
            externalUserId: self.id,
            username: self.username,
            imageUrl: self.imageUrl,
            stream: {
                create: {
                    name: `${self.username}'s Stream`,
                },
            },
        },
    });

    const stream = await db.stream.findUnique({
        where: {
            userId: user.id,
        },
        select: {
            id: true,
        },
    });

    if (!stream) {
        await db.stream.create({
            data: {
                userId: user.id,
                name: `${user.username}'s Stream`,
            },
        });
    }

    return user;
};

export const getSelf = async () => {
    return await ensureUser();
}

export const getSelfByUsername = async (username: string) => {
    const self = await ensureUser();

    const user = await db.user.findUnique({
        where: {
            username
        }
    });

    if(!user){
        throw new Error("User not found")
    }

    if(self.id !== user.id){
        throw new Error("Unauthorized")
    }

    return user;
}
