<script lang="ts">
	import { onMount } from 'svelte';

	let header = '';
	function typewriter() {
		if (header.length != 'pastebin'.length) {
			header += 'pastebin'.at(header.length);
			setTimeout(typewriter, 200);
		}
	}
	onMount(() => {
		typewriter();
	});
</script>

<header class="grid grid-flow-col place-content-between">
	<a href="/">
		<div class="text-branding_orange font-exo2 text-2xl align-text-top">
			<i class="bi bi-code-slash text-white mr-1"></i>
			{header}
		</div>
	</a>
	<div class="font-exo2">
		<a href="/paste/new"
			><button
				class="text-branding_dark bg-branding_orange hover:text-white py-1 px-2 rounded-xl flex"
				><i class="bi bi-plus-square-fill"></i>

				<div class="hidden md:block">&nbsp; New Paste</div>
			</button></a
		>
	</div>
</header>
