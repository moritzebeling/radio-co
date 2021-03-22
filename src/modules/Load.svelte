<script>

    import { load } from '../utilities/load.js';
    export let url;

    let data = load(url);

</script>

{#await data}
    <p>Loading</p>
{:then data}

    <slot prop={data}></slot>

{:catch error}
    <p class="error">Error</p>
{/await}
