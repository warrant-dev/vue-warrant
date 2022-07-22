import { WarrantCheck } from "@warrantdev/warrant-js";

export interface MiddlewareOptions extends WarrantCheck {
    redirectTo: string;
}

export const authorize = (options: MiddlewareOptions) => {
    return async (to: any, from: any, next: any) => {
        await next(async (vm: any) => {
            const { op, warrants, redirectTo } = options;

            let warrantsToCheck = [...warrants].map(warrant => ({...warrant}));
            warrantsToCheck.forEach((warrant) => {
                if (to.params[warrant.objectId]) {
                    /** @ts-ignore */
                    warrant.objectId = to.params[warrant.objectId];
                }

                if (!warrant.objectId) {
                    throw new Error("Invalid or no objectId provided for ProtectedRoute");
                }
            })  

            const hasWarrant = await vm.$warrant.hasWarrant({ op, warrants: warrantsToCheck });
            if (!hasWarrant) {
                next({ path: redirectTo });
            } else {
                next();
            }
        });
    };
};
