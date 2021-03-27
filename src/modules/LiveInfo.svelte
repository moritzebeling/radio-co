<script>

    import Load from './Load.svelte';
    import InspectData from './InspectData.svelte';

    export let host;
    const url = `${host}/api/live-info-v2`;

    let show = false;
    function toggle(){
        show = !show;
    }

</script>

<Load {url} let:prop={data}>
    <section>

        <h1>Live Info API</h1>

        <InspectData {data} />

    </section>
</Load>
