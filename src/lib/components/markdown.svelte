<script lang="ts">
	import { onMount, onDestroy, beforeUpdate } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

	export let editable: boolean = false;
	export let content = '';
	export let updateContent: Function;
	let element: any;
	let editor: any;
	beforeUpdate(() => {
		if (!editor) return;
		editor.setEditable(editable);
	});

	onMount(() => {
		editor = new Editor({
			element: element,
			editable,
			extensions: [StarterKit],
			content,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				console.log(editor.getHTML());
				updateContent(editor.getHTML());
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class="markdown-editor" bind:this={element} />

<style>
	.markdown-editor {
		min-height: 5em;
		outline-color: #bbb;
		outline-style: auto;
		outline-width: 1px;
	}
</style>
