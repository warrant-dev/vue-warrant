import { CheckMany, WarrantObjectLiteral, isWarrantObject } from "@warrantdev/warrant-js";

export interface MiddlewareOptions extends CheckMany {
    redirectTo: string;
}

export const authorize = (options: MiddlewareOptions) => {
    return async (to: any, from: any, next: any) => {
        await next(async (vm: any) => {
            const { op, warrants, redirectTo } = options;

            let warrantsToCheck = [...warrants].map(warrant => ({...warrant}));
            warrantsToCheck.forEach((warrant) => {
                if (isWarrantObject(warrant.object)) {
                    if (to.params[warrant.object?.getObjectId()]) {
                        warrant.object = {
                            objectType: warrant.object.getObjectType(),
                            objectId: to.params[warrant.object.getObjectId()]
                        }
                    }

                    /** @ts-ignore */
                    if (!warrant.object?.getObjectId()) {
                        throw new Error("Invalid or no objectId provided for ProtectedRoute");
                    }
                } else {
                    if (to.params[warrant.object?.objectId]) {
                        warrant.object.objectId = to.params[warrant.object.objectId];
                    }

                    if (!warrant.object?.objectId) {
                        throw new Error("Invalid or no objectId provided for ProtectedRoute");
                    }
                }
            })

            const isAuthorized = await vm.$warrant.checkMany({ op, warrants: warrantsToCheck });
            if (!isAuthorized) {
                next({ path: redirectTo });
            } else {
                next();
            }
        });
    };
};
