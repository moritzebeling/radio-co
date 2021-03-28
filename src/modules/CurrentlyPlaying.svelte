<script>

    import { load } from '../utilities/load.js';
    import InspectData from './InspectData.svelte';

    export let host;

    let loaded = false;
    let data;

    async function triggerFetch(){
        console.log('fetch');
        data = await load(`${host}/api/live-info-v2`);
        loaded = true;
    }
    triggerFetch();

    let updateInterval = setInterval(()=>{
        triggerFetch();
    }, 20*1000);

</script>

<section>

    <p>[Placeholder for currently playing track (artist, title, time)]</p>

    {#if loaded}

        Current:
        <InspectData data={data.tracks.current} />
        Next:
        <InspectData data={data.tracks.next} />

    {/if}

</section>

<style lang="scss">
</style>
