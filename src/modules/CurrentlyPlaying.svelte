<script>

  import { onMount, onDestroy } from 'svelte';
  import {load} from '../utilities/load.js';

  export let endpoint;
  console.log( endpoint );
  let data = {};

  async function fetchInfo(){
    console.log('fetch');
    let result = await load( endpoint );
    console.log(result);
    data = result;
  }

  let update = setInterval(()=>{
    fetchInfo();
  }, 10 * 1000);
  fetchInfo();

  onDestroy(()=>{
    clearInterval(update);
  })

</script>

<section>
  <slot prop={data} />
</section>
