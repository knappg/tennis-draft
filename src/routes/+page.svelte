<script lang="ts">
  import { redirect } from '@sveltejs/kit';
</script>

<script context="module" lang="ts">
  export function load() {
    throw redirect(307, '/setup');
  }
</script>
