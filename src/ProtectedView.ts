import Vue, { CreateElement } from "vue";

const ProtectedView = Vue.extend({
    name: "ProtectedView",
    props: {
        objectType: {
            type: String,
            required: true,
        },
        objectId: {
            type: String,
            required: true,
        },
        relation: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            isAuthorized: false,
        };
    },
    async created() {
        if (!this.objectId) {
            throw new Error("Invalid or no objectId provided to ProtectedComponent");
        }

        this.isAuthorized = await this.$warrant.hasWarrant(this.objectType, this.objectId, this.relation);
    },
    render(createElement: CreateElement): any {
        if (this.isAuthorized) {
            return createElement("div", this.$slots.default);
        }
    }
});

export default ProtectedView;
