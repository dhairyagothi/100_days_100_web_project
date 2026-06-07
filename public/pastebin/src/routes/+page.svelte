<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let visible = false;
	let searchValue = '';
	let notExists = false;
	let failedId = '';
	let checking = false;

	// Recent pastes
	interface RecentPaste {
		paste_id: string;
		paste_language: string;
		created_by: string;
		created_on: string;
	}
	let recentPastes: RecentPaste[] = [];
	let loadingRecent = true;

	onMount(async () => {
		visible = true;
		try {
			const res = await fetch('/api/paste');
			if (res.ok) recentPastes = await res.json();
		} catch {
			// silently fail — recent pastes are optional
		} finally {
			loadingRecent = false;
		}
	});

	async function checkExistence() {
		if (!searchValue.trim()) return;
		checking = true;
		notExists = false;

		const res = await fetch(`/api/paste/${searchValue.trim()}`);
		checking = false;

		if (res.status === 200) {
			goto(`/paste/${searchValue.trim()}`);
		} else {
			failedId = searchValue.trim();
			notExists = true;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') checkExistence();
	}

	function timeAgo(dateStr: string): string {
		const diff = Date.now() - new Date(dateStr).getTime();
		const mins = Math.floor(diff / 60000);
		const hrs = Math.floor(mins / 60);
		const days = Math.floor(hrs / 24);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m ago`;
		if (hrs < 24) return `${hrs}h ago`;
		return `${days}d ago`;
	}
</script>

{#if visible}
	<div transition:fade={{ duration: 600 }} class="font-exo2 px-2">

		<!-- Hero Search -->
		<div class="grid place-items-center mt-12 md:mt-20 mb-12">
			<h1 class="text-2xl md:text-4xl text-branding_orange mb-2 text-center">
				Look up a paste
			</h1>
			<p class="text-gray-500 text-sm mb-6 text-center">
				Enter a paste ID to view it, or create a new one.
			</p>

			<div class="flex gap-2 w-full max-w-sm">
				<input
					class="flex-1 px-4 py-2 text-center rounded-2xl bg-[#1a1a1b] border border-branding_orange/30 text-white outline-none focus:border-branding_orange transition-colors text-sm"
					bind:value={searchValue}
					on:keydown={handleKeydown}
					placeholder="Enter paste ID (e.g. aB3xZ1)"
					autocomplete="off"
					spellcheck="false"
				/>
				<button
					on:click={checkExistence}
					disabled={checking || !searchValue.trim()}
					class="bg-branding_orange text-branding_dark px-4 py-2 rounded-2xl hover:opacity-80 transition-opacity disabled:opacity-50"
				>
					{#if checking}
						<i class="bi bi-arrow-repeat animate-spin"></i>
					{:else}
						<i class="bi bi-search"></i>
					{/if}
				</button>
			</div>

			{#if notExists}
				<div
					transition:scale={{ duration: 200 }}
					class="flex items-start gap-3 mt-4 p-3 text-sm text-branding_dark rounded-xl bg-branding_orange max-w-sm w-full"
					role="alert"
				>
					<i class="bi bi-exclamation-circle-fill mt-0.5 flex-shrink-0"></i>
					<span>
						Paste <b class="font-mono">{failedId}</b> does not exist or has been deleted.
					</span>
				</div>
			{/if}

			<div class="mt-6">
				<a
					href="/paste/new"
					class="inline-flex items-center gap-2 text-branding_orange border border-branding_orange/30 hover:bg-branding_orange/10 transition-colors px-5 py-2 rounded-2xl text-sm"
				>
					<i class="bi bi-plus-square-fill"></i> Create a new paste
				</a>
			</div>
		</div>

		<!-- Recent Pastes -->
		<div class="max-w-2xl mx-auto">
			<div class="flex items-center justify-between mb-3">
				<h2 class="text-white text-sm font-semibold flex items-center gap-2">
					<i class="bi bi-clock-history text-branding_orange"></i>
					Recent Pastes
				</h2>
				<span class="text-gray-600 text-xs">Last 10 pastes</span>
			</div>

			{#if loadingRecent}
				<div class="text-center text-gray-600 text-xs py-8">
					<i class="bi bi-arrow-repeat animate-spin mr-1"></i> Loading...
				</div>
			{:else if recentPastes.length === 0}
				<div class="text-center text-gray-600 text-xs py-8 border border-dashed border-gray-700 rounded-xl">
					No pastes yet. <a href="/paste/new" class="text-branding_orange hover:underline">Create the first one!</a>
				</div>
			{:else}
				<div class="flex flex-col gap-2">
					{#each recentPastes as paste}
						<a
							href="/paste/{paste.paste_id}"
							class="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1b] border border-white/5 hover:border-branding_orange/30 hover:bg-[#1e1e1f] transition-all group"
						>
							<div class="flex items-center gap-3">
								<div class="w-8 h-8 rounded-lg bg-branding_orange/10 border border-branding_orange/20 flex items-center justify-center flex-shrink-0">
									<i class="bi bi-file-code text-branding_orange text-sm"></i>
								</div>
								<div>
									<p class="text-white text-xs font-mono group-hover:text-branding_orange transition-colors">
										{paste.paste_id}
									</p>
									<p class="text-gray-500 text-xs">
										by <span class="text-gray-400">{paste.created_by}</span>
									</p>
								</div>
							</div>
							<div class="flex items-center gap-3 text-right">
								<span class="text-xs px-2 py-0.5 rounded-full bg-branding_orange/10 text-branding_orange border border-branding_orange/20 font-mono">
									{paste.paste_language}
								</span>
								<span class="text-gray-600 text-xs hidden sm:block">
									{timeAgo(paste.created_on)}
								</span>
								<i class="bi bi-arrow-right text-gray-600 group-hover:text-branding_orange transition-colors text-xs"></i>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>

	</div>
{/if}
