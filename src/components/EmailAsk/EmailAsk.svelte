<script lang="ts">
	import { emailStore, isCheckedEmailStore } from '../../store/store';
	import { get } from 'svelte/store';

	let isChecked = $state(get(isCheckedEmailStore));
	let email = $state(get(emailStore));

	function handleCheckboxChange(event: Event) {
		isChecked = (event.target as HTMLInputElement).checked;
		isCheckedEmailStore.set(isChecked);
		if (!isChecked) {
			email = '';
			emailStore.set(email);
		}
	}

	$effect(() => {
		isCheckedEmailStore.subscribe((value) => {
			isChecked = value;
		});
		emailStore.subscribe((value) => {
			email = value;
		});
	});
</script>

<div class="flex items-center gap-2">
	<div class="w-full">
		<div class="flex items-center gap-2">
			<input
				class="checkbox"
				type="checkbox"
				bind:checked={isChecked}
				onchange={handleCheckboxChange}
			/>
			<label for="emailInput">
				Get email Confirmation when submitted? When user submits your form you will get an email to
				let you know
			</label>
		</div>

		<input
			id="emailInput"
			class="input mt-2"
			type="text"
			placeholder="Your email"
			bind:value={email}
			disabled={!isChecked}
			oninput={() => emailStore.set(email)}
		/>
	</div>
</div>
