<script lang="ts">
	import { onMount, onDestroy, beforeUpdate } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

	export let editable: boolean = false;
	export let content = '';
	let element: any;
	let editor: any;
	
  beforeUpdate(() => {
    if (!editor)
      return;
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
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div bind:this={element} />
