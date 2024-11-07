<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Editor } from '@tiptap/core';
    import StarterKit from '@tiptap/starter-kit';
    import Image from '@tiptap/extension-image';

    export let content: string;
    let element: HTMLElement;
    let editor: Editor;

    onMount(() => {
        editor = new Editor({
            element: element,
            editable: true,
            content,
            extensions: [StarterKit, Image.configure({ allowBase64: true })],
            onTransaction: () => {
                editor = editor;
            }
        });
        editor.commands.focus('end');
    });

    onDestroy(() => {
        if (editor) {
            editor.destroy();
        }
    });
</script>

<div bind:this={element} />
