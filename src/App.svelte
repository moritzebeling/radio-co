<script>

  import { Router, Link, Route } from "svelte-routing";

  import RadioCo from "./routes/RadioCo.svelte";
  import AirtimePro from "./routes/AirtimePro.svelte";

  export let url = "";
</script>

<Router url="{url}">

  <nav>
    <Link to="radio-co">Radio.co</Link>
    <Link to="airtime-pro">Airtime Pro</Link>
  </nav>

  <div>
    <Route path="radio-co" component="{RadioCo}" />
    <Route path="airtime-pro" component="{AirtimePro}" />
  </div>

</Router>

<style lang="scss">

  nav {
    padding: 0.5rem;
    :global( a ){
      padding: 0.5rem;
      display: inline-block;
      margin: 0.5rem;
      border: 1px solid #000;
    }
  }

</style>
