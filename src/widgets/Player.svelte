<script>

    export let host;
    const src = `${host}/embed/player?stream=auto&skin=2`;

</script>

<div>
    <iframe {src} title="Player" frameborder="0" width="350" height="396"></iframe>
</div>

<style>

    div {
        margin: 1rem;
    }

    iframe {
        border: 1px solid #000;
    }

</style>
