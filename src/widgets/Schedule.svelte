<script>

    export let host;
    const src = `${host}/embed/weekly-program`;

</script>

<div>
    <iframe {src} title="Schedule" height="400px" width="550px" scrolling="yes" frameborder="0"></iframe>
</div>

<style>

    div {
        margin: 1rem;
    }

    iframe {
        border: 1px solid #000;
    }

</style>
