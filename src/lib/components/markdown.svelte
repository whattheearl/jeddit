<script lang="ts">
	import { onMount, onDestroy, beforeUpdate } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

	export let editable: boolean = false;
	export let content = '';
	export let updateContent: Function;

	let element: HTMLElement;
	let editor: Editor;

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
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				console.log(editor.getHTML());
				updateContent(editor.getHTML());
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

{#if !editor}
	<div class="tiptap ProseMirror">{@html content}</div>
{/if}
<div bind:this={element} />
