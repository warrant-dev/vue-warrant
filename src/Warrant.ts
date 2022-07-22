import Vue from "vue";
import { Client as WarrantClient, WarrantCheck } from "@warrantdev/warrant-js";

export interface PluginOptions {
    clientKey: string;
}

const LOCAL_STORAGE_KEY_SESSION_TOKEN = "__warrantSessionToken";

let instance: Vue;

const getInstance = () => instance;
const useWarrant = (options: PluginOptions): Vue => {
    if (instance) return instance;

    instance = new Vue({
        data() {
            return {
                sessionToken: "",
                isLoading: false,
            }
        },
        created() {
            const storedSessionToken = localStorage.getItem(LOCAL_STORAGE_KEY_SESSION_TOKEN);
            if (storedSessionToken) {
                this.sessionToken = storedSessionToken;
            }
        },
        methods: {
            setSessionToken(newSessionToken: string) {
                this.sessionToken = newSessionToken;

                localStorage.setItem(LOCAL_STORAGE_KEY_SESSION_TOKEN, newSessionToken);
            },
            async hasWarrant(warrantCheck: WarrantCheck): Promise<boolean> {
                if (!this.sessionToken) {
                    throw new Error("No session token provided to Warrant. You may have forgotten to call setSessionToken with a valid session token to finish initializing Warrant.");
                }

                this.isLoading = true;
                const isAuthorized = await new WarrantClient(options.clientKey, this.sessionToken).isAuthorized(warrantCheck);
                this.isLoading = false;

                return isAuthorized;
            }
        }
    });

    return instance;
};

export const Warrant = {
    install(app: any, options: PluginOptions) {
        app.prototype.$warrant = useWarrant(options);
    }
};
