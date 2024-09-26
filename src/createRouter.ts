import { createRouterOutlet } from "./RouterOutlet";
import { RouterLink } from "./RouterLink";
import { createPageComponent } from "./utils/createPageComponent";

import type { Component, Router, Script } from "./types";

export const appTree = new Map<string, HTMLElement>();

export const createRouter = async (router: Router) => {
	//Since router-outlet and router-link are needed we define them here
	createRouterOutlet({ context: router.routerContext });
	customElements.define("router-link", RouterLink);

	const { routes, routerContext } = router;

	for (const route of routes) {
		const { name, component, path } = route;

		if (!component) {
			console.error(`Component for ${name} not found`);
			continue;
		}

		const createdPageComponent = await createPageComponent({
			component,
			name,
			context: routerContext,
		});

		if (!createdPageComponent) return;

		appTree.set(path, createdPageComponent);
	}
};

const removeViteScriptTag = (text: string) => {
	const scriptTag = text.match(/<script[\s\S]*<\/script>/);

	if (scriptTag) {
		text = text.replace(scriptTag[0], "");
	}

	return text;
};

export const importComponent = async (
	pathToFiles: string
): Promise<Component | undefined> => {
	let script: Script | undefined;
	let template: DocumentFragment;

	try {
		const scriptRes: Promise<Script> = import(`.${pathToFiles}/script`);
		script = await Promise.resolve(scriptRes);
	} catch (e) {
		script = undefined;
	}

	try {
		const templateRes = await fetch(`./src/${pathToFiles}/template.html`);
		const templateText = await templateRes.text();
		const templateWithoutScript = removeViteScriptTag(templateText);
		template = document
			.createRange()
			.createContextualFragment(templateWithoutScript);
	} catch (_e) {
		console.error(`Template for ${pathToFiles} not found`);
		return;
	}

	return {
		script,
		template,
	};
};
