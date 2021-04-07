<script>

	import Radio from "./radio/Radio.svelte";
	const id = 's21c5fbf27';

</script>

<header>
	<h1>Radio.co</h1>
	<pre>Station {id}</pre>
</header>

<main>
	<Radio {id} />
</main>

<style lang="scss">

	header, main {
		margin: 1rem;
	}
	header {
		display: flex;
		align-items: center;
		pre {
			margin-left: 0.5em;
		}
	}

</style>
