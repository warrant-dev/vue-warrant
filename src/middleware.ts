import { WARRANT_IGNORE_ID } from "@warrantdev/warrant-js";

export interface MiddlewareOptions {
    objectType: string;
    objectIdParam: string;
    relation: string;
    redirectTo: string;
}

export const authorize = (options: MiddlewareOptions) => {
    return async (to: any, from: any, next: any) => {
        await next(async (vm: any) => {
            const { objectType, objectIdParam, relation, redirectTo } = options;

            let objectId = "";
            if (objectIdParam === WARRANT_IGNORE_ID) {
                objectId = WARRANT_IGNORE_ID;
            } else {
                objectId = to.params[objectIdParam];
            }

            if (!objectId) {
                throw new Error("Invalid or no objectIdParam provided for ProtectedRoute");
            }

            const hasWarrant = await vm.$warrant.hasWarrant(objectType, objectId, relation);
            if (!hasWarrant) {
                next({ path: redirectTo });
            } else {
                next();
            }
        });
    };
};
