<script lang="ts">
	import { languages, newPaste } from '$lib';
	import { goto } from '$app/navigation';

	let language: string = languages[0];
	let name: string = '';
	let content: string = '';
	let loading = false;
	let errorMsg = '';

	// Success modal state
	let showSuccessModal = false;
	let createdId = '';
	let createdPassword = '';

	$: author = name.trim() || 'anonymous';

	async function submit() {
		if (!content.trim()) {
			errorMsg = 'Please enter some content before pasting.';
			return;
		}
		errorMsg = '';
		loading = true;

		try {
			const result = await newPaste({ author, language, content });
			createdId = result.id;
			createdPassword = result.password;
			showSuccessModal = true;
		} catch (e) {
			errorMsg = 'Failed to create paste. Please try again.';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') submit();
	}

	function goToPaste() {
		goto(`/paste/${createdId}`);
	}

	function copyLink() {
		navigator.clipboard.writeText(`${window.location.origin}/paste/${createdId}`);
		linkCopied = true;
		setTimeout(() => (linkCopied = false), 2000);
	}

	let linkCopied = false;
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Back to Home -->
<div class="mb-3">
	<a
		href="/"
		class="inline-flex items-center gap-1 text-gray-400 hover:text-branding_orange transition-colors text-xs font-exo2"
	>
		<i class="bi bi-arrow-left"></i> Back to Home
	</a>
</div>

<div class="font-exo2">
	<!-- Controls Row -->
	<div class="flex flex-wrap items-center gap-3 text-xs mb-3">
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

		<div class="flex items-center gap-2">
			<label for="name" class="text-white">
				<i class="bi bi-person text-branding_orange"></i> Name:
			</label>
			<input
				id="name"
				bind:value={name}
				placeholder="anonymous"
				class="rounded-sm px-2 py-0.5 bg-branding_dark text-white border border-branding_orange/30 outline-none focus:border-branding_orange text-xs w-32"
			/>
		</div>

		<span class="ml-auto text-gray-500 hidden md:block text-xs">
			<kbd class="border border-gray-600 rounded px-1">Ctrl</kbd> +
			<kbd class="border border-gray-600 rounded px-1">Enter</kbd> to paste
		</span>
	</div>

	<!-- Textarea -->
	<textarea
		spellcheck="false"
		class="w-full rounded-lg text-orange-100 bg-gray-800/60 border border-branding_orange/20 text-xs md:text-sm font-kode p-3 outline-none focus:border-branding_orange/60 transition-colors resize-none"
		rows="22"
		placeholder="Paste your code here..."
		bind:value={content}
	></textarea>

	{#if errorMsg}
		<p class="text-red-400 text-xs mt-1">{errorMsg}</p>
	{/if}

	<!-- Bottom Row -->
	<div class="flex items-center justify-between mt-3">
		<span class="text-gray-500 text-xs">
			{content.length} chars · {content.split('\n').length} lines
		</span>
		<button
			on:click={submit}
			disabled={loading}
			class="bg-branding_orange text-branding_dark py-1.5 px-5 rounded-xl font-exo2 text-base font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center gap-2"
		>
			{#if loading}
				<i class="bi bi-arrow-repeat animate-spin"></i> Creating...
			{:else}
				<i class="bi bi-plus-square-fill"></i> Paste
			{/if}
		</button>
	</div>
</div>

<!-- ── Success Modal ───────────────────────────────────── -->
{#if showSuccessModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<div class="bg-[#1a1a1b] border border-branding_orange/30 rounded-2xl p-6 w-[90%] max-w-md font-exo2 shadow-2xl">
			<!-- Header -->
			<div class="flex items-center gap-3 mb-4">
				<div class="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
					<i class="bi bi-check2 text-green-400 text-xl"></i>
				</div>
				<div>
					<h2 class="text-white text-lg font-bold">Paste Created!</h2>
					<p class="text-gray-400 text-xs">Your code has been saved successfully.</p>
				</div>
			</div>

			<!-- Paste ID -->
			<div class="bg-black/40 rounded-lg p-3 mb-3 border border-branding_orange/20">
				<p class="text-gray-400 text-xs mb-1">Paste ID</p>
				<p class="text-branding_orange font-mono text-lg font-bold">{createdId}</p>
			</div>

			<!-- Delete Password — important! -->
			<div class="bg-red-500/10 rounded-lg p-3 mb-4 border border-red-500/30">
				<div class="flex items-center gap-2 mb-1">
					<i class="bi bi-shield-lock text-red-400 text-sm"></i>
					<p class="text-red-400 text-xs font-semibold">Save your Delete Password</p>
				</div>
				<p class="text-white font-mono text-base font-bold tracking-widest">{createdPassword}</p>
				<p class="text-gray-500 text-xs mt-1">You'll need this to delete the paste later. It won't be shown again.</p>
			</div>

			<!-- Share Link -->
			<div class="bg-black/30 rounded-lg p-3 mb-4 border border-white/10">
				<p class="text-gray-400 text-xs mb-1">Share Link</p>
				<p class="text-white text-xs font-mono break-all">
					{typeof window !== 'undefined' ? window.location.origin : ''}/paste/{createdId}
				</p>
			</div>

			<!-- Buttons -->
			<div class="flex gap-2">
				<button
					on:click={copyLink}
					class="flex-1 py-2 rounded-lg border border-branding_orange/30 text-branding_orange hover:bg-branding_orange/10 transition-colors text-sm flex items-center justify-center gap-2"
				>
					<i class="bi {linkCopied ? 'bi-check2' : 'bi-clipboard'}"></i>
					{linkCopied ? 'Copied!' : 'Copy Link'}
				</button>
				<button
					on:click={goToPaste}
					class="flex-1 py-2 rounded-lg bg-branding_orange text-branding_dark font-semibold hover:opacity-80 transition-opacity text-sm flex items-center justify-center gap-2"
				>
					<i class="bi bi-eye"></i> View Paste
				</button>
			</div>

			<!-- Home link -->
			<a
				href="/"
				class="block text-center text-gray-500 hover:text-gray-300 text-xs mt-3 transition-colors"
			>
				← Back to Home
			</a>
		</div>
	</div>
{/if}

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
