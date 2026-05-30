<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="mt-32 grid place-content-center px-4 text-center font-exo2">
	<div class="text-6xl mb-4">📭</div>
	<h1 class="text-branding_orange text-4xl font-bold tracking-widest mb-2">
		{$page.status}
	</h1>
	<p class="text-white text-lg mb-1">Paste Not Found</p>
	<p class="text-gray-400 text-sm mb-6">
		{$page.error?.message ?? 'The paste you are looking for does not exist or has been deleted.'}
	</p>
	<a
		href="/"
		class="bg-branding_orange text-branding_dark py-2 px-4 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
	>
		← Go Home
	</a>
</div>
