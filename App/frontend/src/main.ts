import AppLayout from "./layouts/AppLayout.vue";
import { createApp } from "vue/dist/vue.esm-bundler.js";
import App from "./App.vue";
import { createRouter, createWebHistory, useRouter } from "vue-router";
import routes from "./router/routes";
import { createMetaManager } from "vue-meta";

// You can disable this if you dont want TailwindCss
import "./assets/app.css";

import { store, key } from "./store";
import { Logic } from "./composables";

const router = Promise.all(routes).then((routes) => {
	const router = createRouter({
		history: createWebHistory(),
		routes,
	});

	router.beforeEach((to, from, next) => {
		const toRouter: any = to;
		return Logic.Common.preFetchRouteData(toRouter, next);
	});

	return router;
});

const init = async () => {
	createApp({
		components: {
			App,
		},
		setup() {
			const router = useRouter()
			Logic.Common.SetRouter(router)
			Logic.Common.SetApiUrl('/graphql');
		}
	})
		.component("AppLayout", AppLayout)
		.use(await router)
		.use(store, key)
		.use(createMetaManager())
		.mount("#app");
};

init();
