<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { IconUpload } from '@tabler/icons-svelte';
	import { importDataJson } from '../../store/store';
	import Loader from '../Loader/Loader.svelte';
	import { toastConfig, validateImportedJson } from '../../utils/validation';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let isLoading = $state(false);
	let errorMessage = $state('');

	function onChangeHandler(event: Event) {
		isLoading = true;
		errorMessage = '';

		const target = event.target as HTMLInputElement;
		const uploadedFile = target.files ? target.files[0] : null;

		if (!uploadedFile) {
			isLoading = false;
			errorMessage = 'No file selected.';
			return;
		}

		const reader = new FileReader();
		reader.onload = function (event: ProgressEvent<FileReader>) {
			try {
				const fileContent = event.target?.result;
				if (fileContent) {
					if (typeof fileContent === 'string') {
						const jsonData = JSON.parse(fileContent);
						const isValid = validateImportedJson(jsonData);

						if (isValid) {
							importDataJson(jsonData);

							toastStore.trigger(toastConfig('Your file was successfully imported.', 'success'));
						} else throw new Error();
					}
				}
				isLoading = false;
			} catch (error) {
				isLoading = false;
				errorMessage = 'Error loading file or invalid JSON format.';

				toastStore.trigger(toastConfig('Error loading file or invalid JSON format.', 'error'));
			}
		};
		reader.readAsText(uploadedFile);
	}
</script>

<div>
	<FileDropzone name="files" on:change={onChangeHandler}>
		{#snippet lead()}
			<div class="flex justify-center">
				{#if !isLoading}
					<IconUpload size={30} />
				{/if}
			</div>
		{/snippet}

		{#snippet message()}
			{#if isLoading}
				<Loader />
				<p class="mt-10 text-xl font-bold">Loading . . .</p>
			{:else}
				<strong>Upload JSON file</strong> or drag and drop
			{/if}
		{/snippet}
		{#snippet meta()}
			{#if !isLoading}
				<p>Do you have your work already started? Don't do it twice, upload your saved files</p>
				<p>(This will replace your current work, so make sure you export it before)</p>
			{/if}

			{#if errorMessage}
				<p>{errorMessage}</p>
			{/if}
		{/snippet}
	</FileDropzone>
</div>
