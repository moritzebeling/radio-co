<script>

    import Load from '../Load.svelte';
    import InspectData from '../InspectData.svelte';

    export let host;
    export let show;

    /*
    is `show.id` always equal to `show.instance_id`?
    a show instance seems to be one occurence of a defined show...?
    */

    const url = `${host}/api/show-tracks?instance_id=${show}`;

</script>

<section>

    <header>
        <h1>Show tracks API</h1>
        <p>list of previously played <i>tracks</i></p>
    </header>

    <Load {url} let:prop={data}>

        <InspectData {data} />

    </Load>

</section>
