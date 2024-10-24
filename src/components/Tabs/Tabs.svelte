<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import ComponentsTab from './ComponentsTab.svelte';
	import HomeTab from './HomeTab.svelte';
	import PreviewTab from './PreviewTab.svelte';
	import ResultTab from './ResultTab.svelte';

	let tabSet = $state(0);
</script>

<TabGroup class="mt-2 px-2">
	<Tab bind:group={tabSet} name="tab1" value={0}>
		{#snippet lead()}
			<h2 class="text-lg">Home</h2>
		{/snippet}
	</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>
		{#snippet lead()}
			<h2 class="text-lg">Components</h2>
		{/snippet}
	</Tab>
	<Tab bind:group={tabSet} name="tab3" value={2}>
		{#snippet lead()}
			<h2 class="text-lg">Previews</h2>
		{/snippet}
	</Tab>
	<Tab bind:group={tabSet} name="tab4" value={3}><h2 class="text-lg">Form</h2></Tab>

	<!-- Tab Panels --->
	{#snippet panel()}
		{#if tabSet === 0}
			<HomeTab />
		{:else if tabSet === 1}
			<ComponentsTab />
		{:else if tabSet === 2}
			<PreviewTab />
		{:else if tabSet === 3}
			<ResultTab />
		{/if}
	{/snippet}
</TabGroup>
