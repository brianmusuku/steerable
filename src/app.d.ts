// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Platform {
			env: {
				MY_KV_STORE: KVNamespace;
			};
			context: ExecutionContext;
			caches: CacheStorage;
		}
	}
}

export { };
