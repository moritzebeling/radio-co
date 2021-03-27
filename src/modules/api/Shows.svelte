<script>

    import Load from '../Load.svelte';
    import InspectData from '../InspectData.svelte';

    export let host;
    const url = `${host}/api/shows`;

</script>

<Load {url} let:prop={data}>
    <section>

        <header>
            <h1>Shows API</h1>
            <p>list of all <i>shows</i></p>
        </header>

        <InspectData {data} />

    </section>
</Load>
