<script lang="ts">
	import FileUpload from '../FileUpload/FileUpload.svelte';
	import SearchForm from '../SearchForm/SearchForm.svelte';
	import TabTitle from '../TabTilte/TabTitle.svelte';
	import Templates from '../Templates/Templates.svelte';
</script>

<div class="container mx-auto mb-8 space-y-8 sm:p-4">
	<TabTitle
		title="Home Settings"
		description="Use this tools to import your form or search for an existing form"
	/>

	<div class="card variant-ghost-surface p-4">
		<p class="mt-3 text-center text-xl">
			<strong>Disclaimer:</strong> The form data you create and share is your responsibility. Ensure
			that you handle all data in accordance with applicable privacy laws and regulations.
		</p>
	</div>

	<SearchForm />
	<FileUpload />
	<Templates />
</div>
