<script lang="ts">
    import Excalidraw from '$lib/components/excalidraw.svelte';
    import { toggleVisibility, exportToBlob } from '$lib/exalidraw';
    import ImageIcon from '$lib/components/icons/image.svelte';
    import PenIcon from '$lib/components/icons/pen.svelte';
    import { goto } from '$app/navigation';
    import { Editor } from '@tiptap/core';
    import Image from '@tiptap/extension-image';
    import StarterKit from '@tiptap/starter-kit';
    import { onDestroy, onMount } from 'svelte';
    let element: HTMLElement;
    let editor: Editor;

    const onDiagramSave = async () => {
        if (!editor) return;
        const img = await exportToBlob();
        const res = await fetch('/diagram', { method: 'POST', body: img });
        const data = await res.json();
        editor.commands.setImage({ src: data.imageurl });
        toggleVisibility();
    };

    onMount(() => {
        editor = new Editor({
            element: element,
            editable: true,
            content: '',
            extensions: [StarterKit, Image.configure({ allowBase64: true })],
            onTransaction: () => {
                editor = editor;
            }
        });
        editor.commands.focus('end');
    });

    onDestroy(() => {
        if (editor) editor.destroy();
    });

    const openImageFilePicker = () => {
        const input = document.querySelector('#image') as HTMLInputElement;
        if (!input) return;
        input.click();
    };

    const onImageSelect = async () => {
        const input = document.querySelector('#image') as HTMLInputElement;
        if (!input) return;
        if (!input.files || input.files.length == 0) return;
        const res = await fetch(`/images`, { method: 'POST', body: input.files[0] });
        const data = await res.json();
        editor.commands.setImage({ src: data.imageurl });
    };

    const addPost = async () => {
        if (!editor) return;
        const res = await fetch('/post', {
            method: 'POST',
            body: JSON.stringify({ content: editor.getHTML() })
        });
        if (res.status == 204) goto('/');
    };
</script>

<Excalidraw onSave={onDiagramSave} />

<div class="px-6 py-5 md:mt-6 w-full max-w-2xl mx-auto">
    <div class="flex flex-col max-w-[700px] my-8 mx-auto gap-y-2">
        <header class="w-full border-b-1 border-gray-800">
            <h1 class="font-semibold text-xl text-gray-800">Create a post</h1>
        </header>
        <div class="w-full my-4 editmode">
            <div bind:this={element} />
        </div>
        <div class="flex justify-between items-center">
            <form>
                <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    hidden
                    on:change={onImageSelect}
                />
                <button on:click={openImageFilePicker}>
                    <ImageIcon />
                </button>
                <button on:click={toggleVisibility}>
                    <PenIcon />
                </button>
            </form>
            <button
                on:click={addPost}
                class="ml-auto py-2 px-4 bg-blue-600 font-extrabold text-white rounded-full hover:curser hover:bg-blue-500"
                type="submit">Post</button
            >
        </div>
    </div>
</div>
