<script lang="ts">
	import { languages } from '$lib';

	let language: string | undefined;
	let _name: string;
	$: name = _name || 'anonymous';
	let content: string;

	async function submit() {
		let res = await fetch('/api/paste', {
			method: 'POST',
			body: JSON.stringify({
				author: name,
				language: language,
				content: content
			})
		});
		setTimeout(async () => {
			window.location.replace(`/paste/${(await res.json()).id}`);
		}, 1000);
	}
</script>

<div class="mt-3 mb-1 text-xs font-exo2">
	<label class="text-white mr-2" for="languages"
		><i class="bi bi-braces text-branding_orange"></i>&nbsp; Lang:
	</label>
	<select
		class="rounded-sm mx-2 bg-branding_dark text-branding_orange border-x"
		placeholder="select language"
		id="languages"
		bind:value={language}
	>
		{#each languages as lang}
			<option>{lang}</option>
		{/each}
	</select>
	<br />
	<label for="name" class="text-white">Enter name: </label>
	<input bind:value={name} class="outline-none rounded-sm px-2 mt-3" id="name" />
</div>
<textarea
	spellcheck="false"
	class="mt-5 w-[100%] rounded text-orange-100 bg-gray-700 text-xs md:text-sm font-mono p-1 outline-none"
	rows="22"
	bind:value={content}
></textarea>
<div>
	<button
		on:click={submit}
		class="bg-branding_orange text-branding_dark py-1 px-2 rounded-sm font-exo2 text-xl"
		>Paste</button
	>
</div>

<style>
	:global(code) {
		counter-reset: step;
		counter-increment: step 0;
	}

	:global(code .line::before) {
		content: counter(step);
		counter-increment: step;
		width: 1rem;
		margin-right: 1.5rem;
		display: inline-block;
		text-align: right;
		color: rgba(115, 138, 148, 0.4);
	}
</style>
