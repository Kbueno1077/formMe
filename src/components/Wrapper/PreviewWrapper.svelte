<script lang="ts">
	import { run } from 'svelte/legacy';

	import { IconArrowDown, IconArrowUp, IconSquareX } from '@tabler/icons-svelte';
	import { moveInput, removeInput } from '../../store/store';
	import type { Attribute } from '../../utils/types';
	import CheckboxPopup from '../PopUps/CheckboxPopup.svelte';
	import InputPopup from '../PopUps/InputPopup.svelte';
	import ListvaluesPopup from '../PopUps/ListvaluesPopup.svelte';
	import RadioPopup from '../PopUps/RadioPopup.svelte';
	import SelectPopup from '../PopUps/SelectPopup.svelte';
	import TextAreaPopup from '../PopUps/TextAreaPopup.svelte';
	import WebsitePopup from '../PopUps/WebsitePopup.svelte';

	interface Props {
		id: string;
		type: string;
		attributes: Attribute;
		children?: import('svelte').Snippet;
	}

	let { id, type, attributes, children }: Props = $props();

	let PopUpComponent:
		| typeof CheckboxPopup
		| typeof InputPopup
		| typeof RadioPopup
		| typeof SelectPopup
		| typeof TextAreaPopup
		| null = $state();

	run(() => {
		switch (type) {
			case 'input':
				PopUpComponent = InputPopup;
				break;
			case 'textarea':
				PopUpComponent = TextAreaPopup;
				break;
			case 'select':
				PopUpComponent = SelectPopup;
				break;
			case 'radio':
				PopUpComponent = RadioPopup;
				break;
			case 'checkbox':
				PopUpComponent = CheckboxPopup;
				break;
			case 'website':
				PopUpComponent = WebsitePopup;
				break;
			case 'list':
				PopUpComponent = ListvaluesPopup;
				break;
			default:
				PopUpComponent = null;
		}
	});
</script>

<div class="flex gap-2">
	<div class="card block w-full p-4">
		<div class="mb-4 flex items-center justify-between">
			<div class="flex items-center justify-self-start">
				<button class="btn-icon" onclick={() => removeInput(id)}> <IconSquareX /> </button>
				<h3 class="uppercase">{type}</h3>
			</div>

			{#if PopUpComponent}
				<PopUpComponent target={id} {attributes} />
			{/if}
		</div>
		{@render children?.()}
	</div>

	<div class="flex flex-col items-center justify-center gap-2">
		<button class=" btn-icon" onclick={() => moveInput(id, 'up')}><IconArrowUp /></button>
		<button class="btn-icon" onclick={() => moveInput(id, 'down')}> <IconArrowDown /></button>
	</div>
</div>
