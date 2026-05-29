<script lang="ts">
	import { codeToHtml } from 'shiki';
	import { onMount } from 'svelte';
	import { themeSettings, languages, deletePaste } from '$lib';
	import type { PasteResponseData } from '$lib/types';

	export let data: PasteResponseData;

	let paste_html: string = '<span style="color:#94a3b8">Loading...</span>';
	let theme = 'ayu-dark';
	let language = data.paste_language || 'plaintext';

	// Delete modal state
	let showDeleteModal = false;
	let deletePassword = '';
	let deleteError = '';
	let deleteLoading = false;
	let copied = false;

	$: bgColor = themeSettings[theme as keyof typeof themeSettings] ?? '#0b0e14';

	async function updateHighlight() {
		try {
			paste_html = await codeToHtml(data.paste_data, {
				lang: language,
				theme: theme
			});
		} catch {
			paste_html = `<pre style="color:#e2e8f0">${escapeHtml(data.paste_data)}</pre>`;
		}
	}

	function escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	$: theme, language, updateHighlight();

	onMount(updateHighlight);

	async function copyToClipboard() {
		await navigator.clipboard.writeText(data.paste_data);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	async function handleDelete() {
		deleteError = '';
		deleteLoading = true;
		const success = await deletePaste(data.paste_id, deletePassword);
		deleteLoading = false;
		if (success) {
			window.location.replace('/');
		} else {
			deleteError = 'Incorrect password. Please try again.';
		}
	}
</script>

<!-- Back to Home -->
<div class="mt-3 mb-2">
	<a
		href="/"
		class="inline-flex items-center gap-1 text-gray-400 hover:text-branding_orange transition-colors text-xs font-exo2"
	>
		<i class="bi bi-arrow-left"></i> Back to Home
	</a>
</div>

<!-- Controls Row -->
<div class="mb-2 flex flex-wrap items-center gap-3 font-exo2 text-xs">
	<div class="flex items-center gap-2">
		<label class="text-white" for="themes">
			<i class="bi bi-pencil-square text-branding_orange"></i> Theme:
		</label>
		<select
			class="rounded-sm px-1 py-0.5 bg-branding_dark text-branding_orange border border-branding_orange/30 focus:outline-none"
			id="themes"
			bind:value={theme}
		>
			{#each Object.keys(themeSettings) as t}
				<option value={t}>{t}</option>
			{/each}
		</select>
	</div>

	<div class="flex items-center gap-2">
		<label class="text-white" for="languages">
			<i class="bi bi-braces text-branding_orange"></i> Lang:
		</label>
		<select
			class="rounded-sm px-1 py-0.5 bg-branding_dark text-branding_orange border border-branding_orange/30 focus:outline-none"
			id="languages"
			bind:value={language}
		>
			{#each languages as lang}
				<option value={lang}>{lang}</option>
			{/each}
		</select>
	</div>

	<div class="ml-auto flex items-center gap-2">
		<button
			on:click={copyToClipboard}
			class="flex items-center gap-1 px-3 py-1 rounded-lg bg-branding_orange/10 border border-branding_orange/30 text-branding_orange hover:bg-branding_orange/20 transition-colors"
		>
			<i class="bi {copied ? 'bi-check2' : 'bi-clipboard'}"></i>
			{copied ? 'Copied!' : 'Copy'}
		</button>
		<button
			on:click={() => (showDeleteModal = true)}
			class="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
		>
			<i class="bi bi-trash3"></i> Delete
		</button>
	</div>
</div>

<!-- Paste Meta Info -->
<div class="font-exo2 text-xs text-[#ac833d] mb-2 flex flex-wrap gap-3">
	<span>
		<i class="bi bi-person text-branding_orange"></i>
		Created by: <span class="text-white italic">{data.created_by}</span>
	</span>
	<span>
		<i class="bi bi-clock text-branding_orange"></i>
		<span class="text-white italic">{new Date(data.created_on).toLocaleString()}</span>
	</span>
	<span>
		<i class="bi bi-hash text-branding_orange"></i>
		ID: <span class="text-white font-mono">{data.paste_id}</span>
	</span>
</div>

<!-- Code Display -->
<div
	class="no-scrollbar mt-1 overflow-scroll rounded-lg p-4 border border-branding_orange/30 font-kode w-full text-xs"
	style="background-color: {bgColor};"
>
	{@html paste_html}
</div>

<!-- Delete Modal -->
{#if showDeleteModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<div class="bg-branding_dark border border-branding_orange/30 rounded-2xl p-6 w-[90%] max-w-sm font-exo2">
			<h2 class="text-branding_orange text-lg font-bold mb-1">Delete Paste</h2>
			<p class="text-gray-400 text-sm mb-4">
				Enter the delete password you received when creating this paste.
			</p>

			<input
				type="password"
				bind:value={deletePassword}
				placeholder="Delete password"
				class="w-full rounded-lg px-3 py-2 bg-black/40 border border-branding_orange/30 text-white text-sm outline-none focus:border-branding_orange mb-2"
			/>

			{#if deleteError}
				<p class="text-red-400 text-xs mb-3">{deleteError}</p>
			{/if}

			<div class="flex gap-2 mt-2">
				<button
					on:click={() => { showDeleteModal = false; deletePassword = ''; deleteError = ''; }}
					class="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors text-sm"
				>
					Cancel
				</button>
				<button
					on:click={handleDelete}
					disabled={deleteLoading || !deletePassword}
					class="flex-1 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors text-sm disabled:opacity-50"
				>
					{deleteLoading ? 'Deleting...' : 'Delete'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.no-scrollbar::-webkit-scrollbar { display: none; }
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
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
