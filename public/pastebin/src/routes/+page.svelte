<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	let notexists = false;
	let visible = false;
	let search_value: string = '';
	let search_error_value: string;
	async function checkExistence() {
		let res = await fetch(`/api/paste/${search_value}`);
		if (res.status == 200) {
			goto(`/paste/${search_value}`);
		} else {
			search_error_value = search_value;
			notexists = true;
		}
	}

	onMount(() => {
		visible = true;
	});
</script>

{#if visible}
	<div class="grid m-2 mt-10 md:m-10 place-items-center font-exo2">
		<div transition:fade={{ duration: 1000 }} class="text-xl md:text-4xl text-branding_orange">
			Lookup for a paste
		</div>
		<div class="mt-2">
			<input
				class="md:p-1 text-center rounded-2xl w-[80%] md:w-auto"
				bind:value={search_value}
				placeholder="Enter paste ID"
			/>
			<button
				class="bg-branding_orange text-branding_dark mt-1 px-2 py-1 rounded-2xl text-center"
				on:click={checkExistence}
			>
				<i class="bi bi-search hover:text-white"></i>
			</button>
		</div>
		{#if notexists}
			<div
				transition:scale={{ duration: 200 }}
				class="flex items-center mt-5 p-2 mb-4 text-sm text-branding_dark rounded-lg bg-branding_orange"
				role="alert"
			>
				<svg
					class="flex-shrink-0 inline w-4 h-4 me-3"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
					/>
				</svg>
				<span class="sr-only">Info</span>
				<div class="font-exo2">
					Paste with ID <b>{search_error_value}</b> does not exist.
				</div>
			</div>
		{/if}
	</div>
{/if}
