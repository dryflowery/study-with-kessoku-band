<script>
  import Router from 'svelte-spa-router';
  import Index from "./routes/Index.svelte";
  import Solve from './routes/Solve.svelte';

  const routes = {
    '/': Index,
    '/solve': Solve,
  };
</script>

<Router {routes}/>

