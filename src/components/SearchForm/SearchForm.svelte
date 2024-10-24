<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebase/firebase';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { doc, getDoc } from 'firebase/firestore';
	import { toastConfig } from '../../utils/validation';

	let searchText = '';
	let error = '';

	const toastStore = getToastStore();

	async function handleSearch(event: Event) {
		event.preventDefault();
		error = '';

		try {
			const formRef = doc(db, 'forms', searchText);
			const formSnap = await getDoc(formRef);

			const id = formSnap.id;

			if (id) {
				goto(`/${id}`);
			} else {
				toastStore.trigger(toastConfig('No matching document found', 'error'));

				error = 'No matching document found';
			}
		} catch (err) {
			console.error('Error searching documents:', err);
			toastStore.trigger(toastConfig('Error searching documents:', 'error'));
			error = 'Error searching documents';
		}
	}
</script>

<div class="search-form">
	<form on:submit={handleSearch}>
		<label for="searchInput">Use this Search function to look for a form using the form's id</label>
		<div class="mt-2 flex items-center gap-2">
			<input
				type="text"
				bind:value={searchText}
				placeholder="Search your form..."
				class="input"
				id="searchInput"
			/>
			<button class="variant-filled-primary btn btn-sm" type="submit">Search</button>
		</div>
	</form>
</div>
