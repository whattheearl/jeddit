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
		const wasEditable = editor.isEditable;
		editor.setEditable(editable);
		if (!wasEditable && editable) editor.commands.focus('end');
		if (!editable) editor.commands.blur();
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
