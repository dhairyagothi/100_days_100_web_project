<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	const TITLE = 'pastebin';
	let header = '';

	function typewriter() {
		if (header.length < TITLE.length) {
			header += TITLE[header.length];
			setTimeout(typewriter, 200);
		}
	}

	onMount(typewriter);

	// Show "New Paste" only when NOT already on /paste/new
	$: isNewPage = $page.url.pathname === '/paste/new';
</script>

<header class="flex items-center justify-between py-1">
	<a href="/" class="flex items-center gap-2 group">
		<i class="bi bi-code-slash text-white text-xl"></i>
		<span class="text-branding_orange font-exo2 text-2xl tracking-wide">
			{header}<span class="animate-pulse text-branding_orange/50">|</span>
		</span>
	</a>

	<nav class="flex items-center gap-2 font-exo2 text-sm">
		{#if !isNewPage}
			<a href="/paste/new">
				<button
					class="flex items-center gap-1.5 text-branding_dark bg-branding_orange hover:opacity-80 transition-opacity py-1.5 px-3 rounded-xl"
				>
					<i class="bi bi-plus-square-fill"></i>
					<span class="hidden md:inline">New Paste</span>
				</button>
			</a>
		{/if}
	</nav>
</header>

<div class="border-b border-branding_orange/20 mb-4"></div>
