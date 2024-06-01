<script lang="ts">
	import LeftArrow from '$lib/components/left-arrow.svelte';
	import EditorOptions from '$lib/components/editor/editor-options.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Image from '@tiptap/extension-image';
	import { goto } from '$app/navigation';

	//** @type {import('./$types').PageLoad */
	export let data;
	let element: HTMLElement;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			editable: true,
			content: data.post.content,
			extensions: [StarterKit, Image.configure({ allowBase64: true })],
			onTransaction: () => {
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				data.post.content = editor.getHTML();
			}
		});
		editor.commands.focus('end');
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	const savePost = async () => {
		const res = await fetch(`/post/${data.post.id}`, {
			method: 'PATCH',
			body: JSON.stringify(data.post)
		});
		goto(`/post/${data.post.id}`);
	};
</script>

<div class="px-6 py-5 md:mt-6 w-full max-w-2xl mx-auto">
	<div class="flex items-center gap-2">
		<a href="/"><LeftArrow /></a>
		<span
			class="p-2 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-black"
		>
			j/
		</span>
		<div>
			<div class="flex items-center text-xs pt-1 mb-[-4px]">
				<span class="font-bold">/j/{data.post.community}</span>
				<span class="mx-2 font-extrabold text-gray-400">•</span>
				<span class="font-thin text-gray-400">{data.post.created_at}</span>
			</div>
			<span class="text-xs mt-[-4px] text-gray-700">{data.post.username}</span>
		</div>
		<!-- <div class="ml-auto">
			<EditorOptions />
		</div> -->
	</div>
	<div class="w-full my-4">
		<div bind:this={element} />
	</div>
	<div class="w-full flex justify-end mb-[300px]">
		<button
			on:click={() => goto(`/post/${data.post.id}`)}
			class="py-2 px-4 text-sm bg-gray-200 font-extrabold text-gray-800 rounded-full hover:curser hover:bg-blue-500"
			type="submit">Cancel</button
		>
		<button
			on:click={savePost}
			formaction="?/edit"
			class="ml-2 py-2 px-4 text-sm bg-blue-600 font-extrabold text-white rounded-full hover:curser hover:bg-blue-500"
			type="submit">Save</button
		>
	</div>
</div>
