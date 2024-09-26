import { Template } from "../../types";

export const onLoad = async ({
	root,
	addCache,
	isCacheOutdated,
	getCache,
	context,
}: Template) => {
	const cacheName = "data";

	console.log(context);
	if (isCacheOutdated(cacheName)) {
		const response = await fetch("https://jsonplaceholder.typicode.com/todos");
		const data = await response.json();

		const cache = {
			data,
			staleTime: 10000,
		};

		addCache(cacheName, cache);
	}

	const todos = root.querySelector("#todos");

	if (todos) {
		const cache = getCache(cacheName);

		if (!cache) return;

		for (const todo of cache.data) {
			const li = document.createElement("li");
			li.textContent = todo.title;
			todos.appendChild(li);
		}
	}
};

export const cleanup = ({ root }: Template) => {
	const todos = root.querySelector("#todos");

	if (todos) {
		todos.innerHTML = "";
	}
};
