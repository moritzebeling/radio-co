<script>

    import { load } from '../utilities/load.js';
    let data = load('http://stern.rocks/api/nowplaying');

</script>

{#await data}
    <p>Loading</p>
{:then data}

    <pre>{JSON.stringify( data, null, 2 )}</pre>

{:catch error}
    <p class="error">Error</p>
{/await}

<style>

    pre {
        background-color: #eee;
        margin: 0.5rem;
        padding: 0.5rem;
        font-family: monospace;
        border-radius: 1rem;
    }

</style>
