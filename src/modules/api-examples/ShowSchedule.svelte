<script>

    import Load from '../Load.svelte';
    import InspectData from '../InspectData.svelte';

    export let host;
    export let show;

    const url = `${host}/api/show-schedules?show_id=${show}`;

</script>

<section>

    <header>
        <h1>Show schedule API</h1>
        <p>Gives some information about one <i>show</i></p>
    </header>

    <Load {url} let:prop={data}>

        <InspectData {data} />

    </Load>

</section>
