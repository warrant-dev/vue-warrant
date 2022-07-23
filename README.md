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

### `hasWarrant(warrantCheck)`
`hasWarrant` is a plugin method that returns a `Promise` which resolves with `true` if the user for the current session token has the specified `warrants` and returns `false` otherwise. Use it for fine-grained conditional rendering or for specific logic within components.

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
        const isAuthorized = await this.$warrant.hasWarrant({
            warrants: [{
                objectType: "info",
                objectId: "protected_info",
                relation: "viewer",
            }]
        });
        if (isAuthorized) {
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
        warrants: [{
            objectType: "secret",
            objectId: "secretId",
            relation: "viewer",
        }],
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
            :warrants="warrants"
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
    },
    data: function() {
        return {
            warrants: [{
                objectType: "myObject",
                objectId: this.$route.params.objectId,
                relation: "view",
            }]
        };
    },
};
</script>
```

## Support for Multiple Warrants

`warrants` contains the list of warrants evaluted to determine if the user has access. If `warrants` contains multiple warrants, the `op` parameter is required and specifies how the list of warrants should be evaluated.

**anyOf** specifies that the access check request will be authorized if *any of* the warrants are matched and will not be authorized otherwise.

**allOf** specifies that the access check request will be authorized if *all of* the warrants are matched and will not be authorized otherwise.

```javascript
// User is authorized if they are a 'viewer' of protected_info OR a 'viewer' of 'another_protected_info'
const isAuthorized = await this.$warrant.hasWarrant({
    op: "anyOf",
    warrants: [{
        objectType: "info",
        objectId: "protected_info",
        relation: "viewer",
    }, {
        objectType: "info",
        objectId: "another_protected_info",
        relation: "viewer",
    }]
});
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
