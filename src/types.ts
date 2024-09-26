import Module from "module";

export interface Template extends HTMLElement {
	root: ShadowRoot;
	addCache: (key: string, data: any) => void;
	isCacheOutdated: (key: string) => boolean;
	getCache: (key: string) => Cache | undefined;
	context: RouterContext;
}

export interface CacheInput {
	data: any;
	staleTime?: number;
}

export interface Cache extends CacheInput {
	data: any;
	time: number;
	staleTime: number;
}

export interface Script extends Module {
	onLoad: (template: Template) => void;
	cleanup: (template: Template) => void;
}

export interface Component {
	template: DocumentFragment;
	script: Script | undefined;
	context?: RouterContext;
}

export interface Route {
	path: string;
	name: string;
	component: Component | undefined;
}

export interface Router {
	routes: Route[];
	routerContext?: RouterContext;
}

export type RouterContext = { [key: string]: any } | undefined;
