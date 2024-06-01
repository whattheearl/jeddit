<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Image from '@tiptap/extension-image';
	import * as EditorStore from '$lib/components/editor/editor';

	export let content = '';
	export let updateContent: Function;

	let element: HTMLElement;
	let editor: Editor;

	EditorStore.editable.subscribe((isEditable: boolean) => {
		if (!editor) return;
		const wasEditable = editor.isEditable;
		editor.setEditable(isEditable);
		if (!isEditable) editor.commands.blur();
		if (!wasEditable && isEditable) editor.commands.focus('end');
	});

	onMount(() => {
		editor = new Editor({
			element: element,
			editable: false,
			extensions: [StarterKit, Image.configure({ allowBase64: true })],
			content,
			onTransaction: () => {
				editor = editor;
			},
			onUpdate: ({ editor }) => {
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

{#if !editor}
	<div class="tiptap ProseMirror">{@html content}</div>
{/if}
<div bind:this={element} />
