<script>

    import Player from './Player.svelte';

    export let tracklist = [];

</script>

<Player />

<ol>
    {#each tracklist as track}
        <li>
            <h2>Show title, time</h2>
            <p>and maybe some infos about that track?</p>
        </li>
    {:else}
        <p>No tracks found</p>
    {/each}
</ol>
