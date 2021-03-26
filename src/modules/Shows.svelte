<script>

    /* this module is bonus */
    export let shows = [];

</script>

<ol>
    {#each shows as show}
        <li>
            <h2>Show title, date</h2>
            <p>and maybe list of played/sheduled tracks?</p>
        </li>
    {:else}
        <!-- <p>No shows found</p> -->
    {/each}
</ol>
