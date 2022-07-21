import { WARRANT_IGNORE_ID, WarrantCheck } from "@warrantdev/warrant-js";

export interface MiddlewareOptions extends WarrantCheck {
    redirectTo: string;
}

export const authorize = (options: MiddlewareOptions) => {
    return async (to: any, from: any, next: any) => {
        await next(async (vm: any) => {
            const { op, warrants, redirectTo } = options;

            warrants.forEach((warrant) => {
                if (warrant.objectId === WARRANT_IGNORE_ID) {
                    warrant.objectId = WARRANT_IGNORE_ID;
                } else if (to.params[warrant.objectId]) {
                    /** @ts-ignore */
                    warrant.objectId = to.params[warrant.objectId];
                }

                if (!warrant.objectId) {
                    throw new Error("Invalid or no objectId provided for ProtectedRoute");
                }
            })  

            const hasWarrant = await vm.$warrant.hasWarrant({ op, warrants });
            if (!hasWarrant) {
                next({ path: redirectTo });
            } else {
                next();
            }
        });
    };
};
