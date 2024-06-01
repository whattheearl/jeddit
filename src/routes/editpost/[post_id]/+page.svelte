<script lang="ts">
	import Editor from '$lib/components/editor/editor.svelte';
	import LeftArrow from '$lib/components/left-arrow.svelte';
	import EditorOptions from '$lib/components/editor/editor-options.svelte';

	//** @type {import('./$types').PageLoad */
	export let data;
	let editable = false;

	const saveChanges = async () => {
		const res = await fetch(`/post/${data.post.id}`, {
			method: 'PATCH',
			body: JSON.stringify(data.post)
		});
		editable = false;
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
		<div class="ml-auto">
			<EditorOptions />
		</div>
	</div>
	<div class="w-full my-4">
		<Editor content={data.post.content} />
	</div>
	<div class="w-full flex justify-end">
		<button
			on:click={() => (editable = !editable)}
			class="py-2 px-4 text-sm bg-gray-200 font-extrabold text-gray-800 rounded-full hover:curser hover:bg-blue-500"
			type="submit">Cancel</button
		>
		<button
			on:click={saveChanges}
			formaction="?/edit"
			class="ml-2 py-2 px-4 text-sm bg-blue-600 font-extrabold text-white rounded-full hover:curser hover:bg-blue-500"
			type="submit">Save</button
		>
	</div>
</div>
