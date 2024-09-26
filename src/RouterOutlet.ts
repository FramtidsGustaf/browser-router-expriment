import { appTree } from "./createRouter";
import type { RouterContext } from "./types";

interface CreateRouterOutletProps {
	context: RouterContext;
}

/**
 * RouterOutlet is a custom element that will render the components based on the path
 */
export const createRouterOutlet = ({ context }: CreateRouterOutletProps) => {
	class RouterOutlet extends HTMLElement {
		isInitial: boolean = true;
		context: RouterContext = context;

		constructor() {
			super();
			this.addListener();
		}

		/**
		 * Render the first page
		 */
		private firstRender = async () => {
			const navEvent = new PopStateEvent("popstate", {
				state: {
					to: window.location.pathname,
				},
			});

			this.dispatchEvent(navEvent);
			history.pushState({}, "", window.location.pathname);
		};

		private addListener = () => {
			window.addEventListener("popstate", async ({ state }) => {
				while (this.firstChild) {
					this.removeChild(this.firstChild);
				}

				const component = appTree.get(state.to);

				if (component) {
					this.appendChild(component);
				}
			});

			// TODO Make this work with the initial page load
			if (this.isInitial) {
				this.firstRender();
				this.isInitial = false;
			}
		};
	}
	customElements.define("router-outlet", RouterOutlet);
};
