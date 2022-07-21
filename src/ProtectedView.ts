import Vue, { CreateElement } from "vue";

const ProtectedView = Vue.extend({
    name: "ProtectedView",
    props: {
        op: {
            type: String,
            required: false,
        },
        warrants: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            isAuthorized: false,
        };
    },
    async created() {
        if (!this.warrants || this.warrants.length === 0) {
            throw new Error("Invalid or no warrants provided to ProtectedView");
        }

        this.isAuthorized = await this.$warrant.hasWarrant({ op: this.op, warrants: this.warrants });
    },
    render(createElement: CreateElement): any {
        if (this.isAuthorized) {
            return createElement("div", this.$slots.default);
        }
    }
});

export default ProtectedView;
