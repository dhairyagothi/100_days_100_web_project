<script lang="ts">
	import { codeToHtml } from 'shiki';
	import { onMount } from 'svelte';
	import { themeSettings, languages } from '$lib';
	import type { PasteResponseData } from '$lib/types';

	export let data: PasteResponseData;

	async function updateTheme(_?: any, __?: any) {
		paste_data = await codeToHtml(data.paste_data, {
			lang: language,
			theme: theme
		});
	}

	let paste_data: string = 'loading ...';
	let theme = 'ayu-dark';
	let language = data.paste_language || 'loading ...';
	$: updateTheme(theme, language);
	$: bgColor = themeSettings[theme as keyof typeof themeSettings];

	onMount(updateTheme);
</script>

<div class="mt-3 mb-1 text-xs font-exo2">
	<label class="text-white" for="themes"
		><i class="bi bi-pencil-square text-branding_orange"></i> &nbsp;Theme:
	</label>
	<select
		class="rounded-sm my-1 mx-2 bg-branding_dark text-branding_orange border-x"
		id="themes"
		bind:value={theme}
	>
		{#each Object.entries(themeSettings) as [theme, _]}
			<option>{theme}</option>
		{/each}
	</select>
	<br />
	<label class="text-white mr-2" for="languages"
		><i class="bi bi-braces text-branding_orange"></i>&nbsp; Lang:
	</label>
	<select
		class="rounded-sm mx-2 bg-branding_dark text-branding_orange border-x"
		id="languages"
		bind:value={language}
	>
		{#each languages as lang}
			<option>{lang}</option>
		{/each}
	</select>
</div>
<info class="font-exo2 text-xs text-[#ac833d]">
	<span>Created by:</span>
	<span class="text-white"><i>{data.created_by}</i></span>
	&nbsp;on
	<span class="text-white"><i>{new Date(data.created_on).toLocaleString()}</i></span>
</info>
<div
	class="no-scrollbar mt-2 overflow-scroll rounded-sm p-4 border border-branding_orange font-kode w-full text-xs"
	style="background-color: {bgColor};"
>
	{@html paste_data}
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.no-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
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
