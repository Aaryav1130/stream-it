import { db } from "./db";
import { getSelf } from "./auth-service";

export const getRecommended = async () => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    let userId;
    try {
        const self = await getSelf();
        userId = self.id;
    } catch (e) {
        userId = null;
    }

    let users = [];

    if (userId) {
        users = await db.user.findMany({
            where: {
                AND: [
                    {
                        NOT: {
                            id: userId
                        }
                    },
                    {
                        NOT: {
                            followers: {
                                some: {
                                    followerId: userId
                                }
                            
                            }
                        }
                    },
                    {
                        NOT: {
                            blocking: {
                                some: {
                                    blockerId: userId,
                                },
                            },
                        },
                    }
                ]
            },
            include: {
                stream: true,
            },
            orderBy: {
                createdAt: "desc"
            },
        });
    } else {
        users = await db.user.findMany({
            include: {
                stream: true,
            },
            orderBy: {
                createdAt: "desc"
            },
        });
    }

    return users;
}
