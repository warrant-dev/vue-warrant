import Vue from "vue";
import { WarrantClient, Check, CheckMany, FeatureCheck, PermissionCheck } from "@warrantdev/warrant-js";

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
            async check(warrantCheck: Check): Promise<boolean> {
                if (!this.sessionToken) {
                    throw new Error("No session token provided to Warrant. You may have forgotten to call setSessionToken with a valid session token to finish initializing Warrant.");
                }

                this.isLoading = true;
                const isAuthorized = await new WarrantClient({ clientKey: options.clientKey, sessionToken: this.sessionToken }).check(warrantCheck);
                this.isLoading = false;

                return isAuthorized;
            },
            async checkMany(warrantCheck: CheckMany): Promise<boolean> {
                if (!this.sessionToken) {
                    throw new Error("No session token provided to Warrant. You may have forgotten to call setSessionToken with a valid session token to finish initializing Warrant.");
                }

                this.isLoading = true;
                const isAuthorized = await new WarrantClient({ clientKey: options.clientKey, sessionToken: this.sessionToken }).checkMany(warrantCheck);
                this.isLoading = false;

                return isAuthorized;
            },
            async hasPermission(warrantCheck: PermissionCheck): Promise<boolean> {
                if (!this.sessionToken) {
                    throw new Error("No session token provided to Warrant. You may have forgotten to call setSessionToken with a valid session token to finish initializing Warrant.");
                }

                this.isLoading = true;
                const isAuthorized = await new WarrantClient({ clientKey: options.clientKey, sessionToken: this.sessionToken }).hasPermission(warrantCheck);
                this.isLoading = false;

                return isAuthorized;
            },
            async hasFeature(warrantCheck: FeatureCheck): Promise<boolean> {
                if (!this.sessionToken) {
                    throw new Error("No session token provided to Warrant. You may have forgotten to call setSessionToken with a valid session token to finish initializing Warrant.");
                }

                this.isLoading = true;
                const isAuthorized = await new WarrantClient({ clientKey: options.clientKey, sessionToken: this.sessionToken }).hasFeature(warrantCheck);
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
