<script lang="ts">
	import { InputChip } from '@skeletonlabs/skeleton';
	import { addInput } from '../../store/store';
	import AddButton from '../AddButton/AddButton.svelte';
	import TabTitle from '../TabTilte/TabTitle.svelte';

	let list: string[] = $state(['foo', 'bar', 'fizz', 'buzz']);

	const inputTypes = [
		{ type: 'text', icon: '🔤' },
		{ type: 'email', icon: '✉️' },
		{ type: 'password', icon: '🔒' },
		{ type: 'number', icon: '🔢' },
		{ type: 'date', icon: '📅' }
	];
</script>

<div class="container mx-auto mb-8 space-y-8 sm:p-4">
	<TabTitle
		title="Components"
		description="Explore our collection of meticulously crafted Input elements"
	/>

	<div class="card card-hover block p-4">
		<div class="space-y-2">
			<h3 class="h3">Input</h3>
			<input class="input" type="text" placeholder="Input" disabled />
		</div>

		<div class="justify-betwee mt-4 flex items-center">
			<div class="flex flex-wrap gap-2">
				{#each inputTypes as { type, icon }}
					<button
						class="'bg-gray-100 dark:hover:bg-gray-600'} flex items-center space-x-1 rounded-full px-3 py-2 text-sm font-medium
							text-gray-700 transition-all duration-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
					>
						<span>{icon}</span>
						<span>{type}</span>
					</button>
				{/each}
			</div>
			<AddButton onAddClick={() => addInput('input', { type: 'text' })} />
		</div>
	</div>

	<div class="card card-hover block p-4">
		<div class="space-y-2">
			<h3 class="h3">Select</h3>
			<select class="select" disabled>
				<option value="1">Option 1</option>
				<option value="2">Option 2</option>
				<option value="3">Option 3</option>
				<option value="4">Option 4</option>
				<option value="5">Option 5</option>
			</select>
		</div>
		<div class="pt-4">
			<AddButton onAddClick={() => addInput('select', { options: [] })} />
		</div>
	</div>

	<div class="card card-hover block p-4">
		<div class="space-y-2">
			<h3 class="h3">Textarea</h3>

			<textarea
				class="textarea"
				rows="4"
				disabled
				placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit."
			></textarea>
		</div>
		<div class="pt-4">
			<AddButton onAddClick={() => addInput('textarea', {})} />
		</div>
	</div>

	<div class="card card-hover block p-4">
		<div class="space-y-2">
			<h3 class="h3">Check Boxes</h3>

			<h3 class="flex items-center space-x-2">
				<input class="checkbox" type="checkbox" checked disabled />
				<p>Option 1</p>
			</h3>
			<h3 class="flex items-center space-x-2">
				<input class="checkbox" type="checkbox" disabled />
				<p>Option 2</p>
			</h3>
			<h3 class="flex items-center space-x-2">
				<input class="checkbox" type="checkbox" disabled />
				<p>Option 3</p>
			</h3>
		</div>

		<div class="pt-4">
			<AddButton onAddClick={() => addInput('checkbox', {})} />
		</div>
	</div>

	<div class="card card-hover block p-4">
		<div class="space-y-2">
			<h3 class="h3">Radio Buttons</h3>
			<h3 class="flex items-center space-x-2">
				<input class="radio" type="radio" checked name="radio-direct" value="1" disabled />
				<p>Option 1</p>
			</h3>
			<h3 class="flex items-center space-x-2">
				<input class="radio" type="radio" name="radio-direct" value="2" disabled />
				<p>Option 2</p>
			</h3>
			<h3 class="flex items-center space-x-2">
				<input class="radio" type="radio" name="radio-direct" value="3" disabled />
				<p>Option 3</p>
			</h3>
		</div>

		<div class="pt-4">
			<AddButton onAddClick={() => addInput('radio', {})} />
		</div>
	</div>

	<div class="card card-hover block p-4">
		<div class="space-y-2">
			<h3 class="h3">Website Input</h3>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">https://</div>
				<input type="text" placeholder="www.example.com" disabled />
			</div>
		</div>
		<div class="pt-4">
			<AddButton onAddClick={() => addInput('website', {})} />
		</div>
	</div>
	<div class="card card-hover block p-4">
		<div class="space-y-2">
			<h3 class="h3">List of values</h3>
			<InputChip bind:value={list} name="chips" placeholder="Enter any value..." disabled />
		</div>
		<div class="pt-4">
			<AddButton onAddClick={() => addInput('list', { options: [] })} />
		</div>
	</div>
</div>
