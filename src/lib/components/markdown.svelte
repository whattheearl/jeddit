<script lang="ts">
	import { onMount, onDestroy, beforeUpdate } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

	export let editable: boolean = false;
	export let content = '';
	export let updateContent: Function;
	let element: any;
	let editor: Editor;

	beforeUpdate(() => {
		if (!editor) return;
		editor.setEditable(editable);
		editor.commands.focus('end');
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

<div class="min-h-[5em]" bind:this={element} />
