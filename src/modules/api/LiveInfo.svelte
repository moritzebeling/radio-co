<script>

    import Load from '../Load.svelte';
    import InspectData from '../InspectData.svelte';

    export let host;
    const url = `${host}/api/live-info-v2`;

</script>

<Load {url} let:prop={data}>
    <section>

        <header>
            <h1>Live Info API</h1>
            <ol>
                <li><i>station</i> status</li>
                <li>list of current, past and next <i>track</i></li>
                <li><i>show</i> info</li>
            </ol>
        </header>

        <InspectData {data} />

    </section>
</Load>

<style lang="scss">


</style>
