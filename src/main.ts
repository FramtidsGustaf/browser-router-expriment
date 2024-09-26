import { createRouter, importComponent } from "./createRouter";

import type { Router } from "./types";

const main = await importComponent("/pages");
const hejsan = await importComponent("/pages/hejsan");

const router: Router = {
	routes: [
		{
			path: "/",
			name: "Main-Page",
			component: main,
		},
		{
			path: "/hejsan",
			name: "Hejsan-Page",
			component: hejsan,
		},
	],
	routerContext: {
		hejsan: "Hejsan",
	},
};

createRouter(router);
