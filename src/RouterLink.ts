/**
 * RouterLink is a custom element that is used to navigate between pages
 */
export class RouterLink extends HTMLElement {
	to: string = "";
	constructor() {
		super();
		this.to = this.getAttribute("to") || "";
		this.addEventListener("click", this.handleClick);
	}

	handleClick = () => {
		if (this.to === window.location.pathname) {
			return;
		}

		history.pushState({}, "", this.to);

		const navEvent = new PopStateEvent("popstate", {
			state: {
				to: this.to,
			},
		});

		dispatchEvent(navEvent);
	};
}
