<script lang="ts">
	import '../app.css';
	import Header from './Header.svelte';
</script>

<div class="m-4 max-w-5xl mx-auto">
	<Header />
	<slot />
</div>
