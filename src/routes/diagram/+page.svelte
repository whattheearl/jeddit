<script lang="ts">
    import Excalidraw from '$lib/components/excalidraw.svelte';
    import { exportSVGElement, toggleVisibility } from '$lib/exalidraw.ts';

    const onSave = async () => {
        const svg = await exportSVGElement();
        toggleVisibility();
        document.querySelector('#mypost')?.append(svg);
    };
</script>

<button on:click={toggleVisibility}>open</button>

<div id="mypost"></div>
<Excalidraw {onSave} />
