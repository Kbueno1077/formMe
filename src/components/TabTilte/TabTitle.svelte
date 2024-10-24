<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	interface Props {
		title?: string;
		description?: string;
	}

	let { title = 'Components', description = 'Explore our collection of meticulously crafted UI elements' }: Props = $props();
</script>

<div
	class="w-full rounded-lg bg-gradient-to-br from-blue-50 to-purple-300 py-16 dark:from-blue-800 dark:to-purple-900 md:py-24"
>
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-center">
			<div
				in:fly={{ x: -20, duration: 500 }}
				class="border-l-4 border-blue-500 pl-4 dark:border-blue-400 md:pl-6"
			>
				<h2
					class="text-4xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100 md:text-5xl lg:text-6xl"
				>
					{title}
				</h2>
			</div>
		</div>
		<div in:fly={{ y: 20, duration: 500, delay: 400 }} class="mt-4 text-center">
			<p class="text-md text-gray-600 dark:text-gray-300 md:text-lg">
				{description}
			</p>
		</div>
	</div>
</div>
