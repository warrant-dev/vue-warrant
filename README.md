# @warrantdev/vue-warrant

[![npm](https://img.shields.io/npm/v/@warrantdev/vue-warrant)](https://www.npmjs.com/package/@warrantdev/vue-warrant)
[![Slack](https://img.shields.io/badge/slack-join-brightgreen)](https://join.slack.com/t/warrantcommunity/shared_invite/zt-12g84updv-5l1pktJf2bI5WIKN4_~f4w)

## Overview
The Warrant Vuejs library provides a plugin, `vue-router` middleware, and components for controlling access to pages and components in Vuejs using [Warrant](https://warrant.dev/). The library interacts directly with the Warrant API using short-lived session tokens that must be created server-side using your API key. Refer to [this guide](https://docs.warrant.dev/guides/creating-session-tokens) to see how to generate session tokens for your users.

## Installation

Use `npm` to install the module:

```sh
npm install @warrantdev/vue-warrant
```

## Usage

### Plugin
Add the Warrant plugin to your Vuejs app, passing it your Client Key using the `clientKey` config option. The plugin allows you to access utility methods for performing access checks anywhere in your app.
```js
// main.js
import Vue from "vue";
import router from "./router";
import App from "./App.vue";
import { Warrant } from "@warrantdev/vue-warrant";

Vue.config.productionTip = false;

Vue.use(Warrant, {
    clientKey: "client_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=",
});

new Vue({
    router,
    // store,
    render: h => h(App)
}).$mount("#app");
```

#### **Setting the Session Token**
In order to finish initializing the plugin and begin performing access checks in your app, you must provide a server-generated session token and set it using the `setSessionToken` plugin method. Otherwise requests from your Vuejs application will be denied by the Warrant API.

Set the session token using the `setSessionToken` plugin method:
```vue
// Login.vue
<template>
    <form @submit.prevent="onSubmit(email, password)" class="login-form">
        <!-- email & password inputs, etc. -->
    </form>
</template>

<script>
export default {
    name: "login",
    data() {
        return {
            email: null,
            password: null,
        };
    },
    methods: {
        async onSubmit(email, password) {
            const response = await login(email, password);

            // NOTE: This session token must be generated
            // server-side when logging users into your
            // application and then passed to the client.
            // Access check calls in this library will fail
            // if the session token is invalid or not set.
            this.$warrant.setSessionToken(response.data.warrantSessionToken);

            //
            // Redirect user to logged in page
            //
        }
    }
};
</script>
```

### `hasWarrant(objectType, objectId, relation)`
`hasWarrant` is a plugin method that returns a `Promise` which resolves with `true` if the user for the current session token has the warrant with the specified `objectType`, `objectId`, and `relation` and returns `false` otherwise. Use it for fine-grained conditional rendering or for specific logic within components.

Using `hasWarrant` plugin method:
```vue
<template>
    <div v-if="protectedInfo">
        <protected-info>{{ protectedInfo }}</protected-info>
    </div>
</template>
<script>
export default {
    data() {
        protectedInfo: null,
    },
    async created() {
        if (await this.$warrant.hasWarrant("info", "protected_info", "viewer")) {
            // request protected info from server
        }
    }
};
</script>
```

### `authorize` Middleware
`authorize` is a `vue-router` middleware function you can use in components rendered by `vue-router` to easily protect your routes behind a warrant.
```vue
<template>
    <div>My Super Secret Component</div>
</template>

<script>
import { ProtectedView, authorize } from "@warrantdev/vue-warrant";

export default {
    beforeRouteEnter: authorize({
        objectType: "secret",
        objectIdParam: "secretId",
        relation: "viewer",
        redirectTo: "/",
    })
}
</script>
```

### `ProtectedView`
`ProtectedView` is a utility component you can wrap around markup or components that should only be accessible to users with certain privileges. It only renders the components it wraps if the user has the given warrant.
```vue
<template>
    <div>
        <my-public-component/>
        <protected-view
            :objectType="'myObject'"
            :objectId="object.id"
            :relation="'view'"
        >
            <my-protected-component/>
        </protected-view>
    </div>
</template>
<script>
import { ProtectedView } from "@warrantdev/vue-warrant";

export default {
    components: {
        ProtectedView,
    }
};
</script>
```

## Notes
We’ve used a random Client Key in these code examples. Be sure to replace it with your
[actual Client Key](https://app.warrant.dev) to
test this code through your own Warrant account.

For more information on how to use the Warrant API, please refer to the
[Warrant API reference](https://docs.warrant.dev).

## TypeScript support

This package includes TypeScript declarations for Warrant.

Note that we may release new [minor and patch](https://semver.org/) versions of
`@warrantdev/vue-warrant` with small but backwards-incompatible fixes to the type
declarations. These changes will not affect Warrant itself.

## Warrant Documentation

- [Warrant Docs](https://docs.warrant.dev/)
