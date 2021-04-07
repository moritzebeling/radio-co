<script>

    export let host;

    import LiveInfo from './LiveInfo.svelte';

</script>

<section>

    {#if true}
        Station status:
        <div class="info">
          <LiveInfo {host} info={"station_status"} />
        </div>
        Current:
        <div class="info">
          <LiveInfo {host} info={"current_track"} />
        </div>
        Next:
        <div class="info">
          <LiveInfo {host} info={"next_track"} />
        </div>

    {/if}

</section>

<style lang="scss">
  .info{
    margin-left:1em;
  }
</style>
