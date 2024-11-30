<script lang="ts">
    import { onMount } from 'svelte';
    import * as Excalidraw from '$lib/excalidraw';

    export let onSave: () => void;

    onMount(async () => {
        await Excalidraw.render({ onSave: onSave });
    });
</script>

<div
    id="excalidraw"
    style="display: none;"
    class="z-1000 absolute left-0 top-0 w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,.3)]"
>
    <div id="root" class="w-[90vw] h-[90vh]"></div>
</div>
