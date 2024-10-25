<script>
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import { initializeStores, Toast, Modal } from '@skeletonlabs/skeleton';

	import '../app.css';

	import { storePopup } from '@skeletonlabs/skeleton';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	initializeStores();
</script>

<Modal />
<Toast position="br" />

<AppBar>
	{#snippet lead()}
		<a href="/" class="flex items-center space-x-2">
			<div class="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-lg">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
					/>
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-gray-800 dark:text-white">
				Form<span class="text-blue-500">Me</span>
			</h1>
		</a>
	{/snippet}
	{#snippet trail()}
		<LightSwitch />
	{/snippet}
	<!-- <svelte:fragment slot="headline">(headline)</svelte:fragment> -->
</AppBar>

{@render children?.()}
