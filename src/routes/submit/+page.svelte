<script lang="ts">
	import { goto } from '$app/navigation';
	import Markdown from '$lib/components/markdown.svelte';

	$: post = { content: '' };
	const updateContent = (content: string) => {
		post = { content };
	};

	const addPost = async () => {
		const res = await fetch('/post', { method: 'POST', body: JSON.stringify(post) });
		if (res.status == 204) goto('/');
	};
</script>

<div class="px-6 py-5 md:mt-6 w-full max-w-2xl mx-auto">
	<div class="flex flex-col max-w-[700px] my-8 mx-auto gap-y-2">
		<header class="w-full border-b-1 border-gray-800">
			<h1 class="font-semibold text-xl text-gray-800">Create a post</h1>
		</header>
		<Markdown content={''} {updateContent} editable={true} />
		<button
			on:click={addPost}
			class="ml-auto py-2 px-4 bg-blue-600 font-extrabold text-white rounded-full hover:curser hover:bg-blue-500"
			type="submit">Post</button
		>
	</div>
</div>
