import type { Cache, CacheInput, Component, RouterContext } from "../types";

interface CreatePageComponentProps {
	component: Component;
	name: string;
	context: RouterContext;
}

/**
 * Create a component based on the path
 */
export const createPageComponent = async ({component, name, context}: CreatePageComponentProps) => {
	if (customElements.get(name)) {
		const comp = document.createElement(name);

		if (!comp.shadowRoot) return;

		comp.shadowRoot.appendChild(component.template);

		return comp;
	}

	//If the component hasn't been registered before, create a new custom element
	// and append the range to the shadowRoot
	class CustomElement extends HTMLElement {
		private cache: Map<string, Cache> = new Map();
		root: ShadowRoot;
		context = context;

		constructor() {
			console.log(component.context);
			super();
			this.root = this.attachShadow({ mode: "open" });
			this.root.appendChild(component.template);
		}

		connectedCallback() {
			if (!this.root || !component.script || !component.script.onLoad) return;
			component.script.onLoad(this);
		}

		disconnectedCallback() {
			if (!this.root || !component.script || !component.script.cleanup) return;
			component.script.cleanup(this);
		}

		isCacheOutdated = (key: string) => {
			if (!this.cache.has(key)) return true;

			return (
				Date.now() - this.cache.get(key)!.time > this.cache.get(key)!.staleTime
			);
		};

		addCache = (key: string, cacheInput: CacheInput) => {
			if (!cacheInput.staleTime) cacheInput.staleTime = 0;

			this.cache.set(key, {
				data: cacheInput.data,
				staleTime: cacheInput.staleTime,
				time: Date.now(),
			});
		};

		getCache = (key: string) => {
			if (!this.cache.has(key)) return;
			return this.cache.get(key);
		};
	}

	//Register the component
	customElements.define(name.toLowerCase(), CustomElement);

	const comp = document.createElement(name);
	return comp;
};
