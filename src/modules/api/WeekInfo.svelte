<script>

    import Load from '../Load.svelte';
    import InspectData from '../InspectData.svelte';

    export let host;
    const url = `${host}/api/week-info`;

</script>

<section>

    <header>
        <h1>Week Info API</h1>
        <p>A list of all <i>shows</i> happening this and the next week</p>
    </header>

    <Load {url} let:prop={data}>

        <InspectData {data} />

    </Load>

</section>
