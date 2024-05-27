<script lang="ts">
	import { enhance } from '$app/forms';
	import Markdown from '$lib/components/markdown.svelte';
	import LeftArrow from '$lib/components/left-arrow.svelte';
	import HorizontalElipsis from '$lib/components/horizontal-elipsis.svelte';
	import ThumbsDown from '$lib/components/thumbs-down.svelte';
	import ThumbsUp from '$lib/components/thumbs-up.svelte';

	//** @type {import('./$types').PageLoad */
	export let data;

	const isLoggedIn = data.user && data.user.id == data.post.id;

	const updateContent = (content: string) => {
		data.post.content = content;
	};

	const saveChanges = async () => {
		const res = await fetch(`/post/${data.post.id}`, {
			method: 'PATCH',
			body: JSON.stringify(data.post)
		});
		editable = false;
	};

	let editable = false;
	const upUnselected =
		'w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-gray-200 rounded-full';
	const upSelected =
		'w-8 h-8 flex items-center justify-center text-green-600 hover:bg-gray-200 rounded-full';
	const downUnselected =
		'w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-gray-200 rounded-full';
	const downSelected =
		'w-8 h-8 flex items-center justify-center text-red-600 hover:bg-gray-200 rounded-full';
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
		{#if isLoggedIn}
			<button on:click={() => (editable = !editable)} class="ml-auto">
				<HorizontalElipsis />
			</button>
		{/if}
	</div>
	<div class="w-full my-4">
		<Markdown bind:editable bind:content={data.post.content} {updateContent} />
	</div>
	{#if isLoggedIn && editable}
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
	{:else}
		<form method="POST" action="?/comment" class="mt-4 flex items-center">
			<input
				id="content"
				class="rounded-full"
				type="text"
				name="content"
				placeholder="Add a comment"
			/>
			<button
				class="p-2 ml-2 text-white text-sm font-semibold bg-blue-500 rounded-full"
				type="submit">Comment</button
			>
		</form>
	{/if}

	{#each data.comments as comment}
		<div class="flex items-center mt-8">
			<img
				class="h-8 w-8 rounded-full bg-gray-50"
				style="height: 32px; width: 32px; border-radius: 100%; background-color: gray;"
				src={`data:image/jpeg;base64, ${comment.picture}`}
				alt=""
			/>
			<span class="ml-2 text-xs font-bold text-gray-800">{comment.username}</span>
			<span class="ml-2 text-xs font-extrabold text-gray-400">•</span>
			<span class="ml-1 text-xs font-thin text-gray-400">{comment.created_at}</span>
		</div>
		<p class="ml-10 text-sm text-gray-800">{comment.content}</p>
		<form method="POST" class="mt-4 flex items-center" use:enhance>
			<button
				formaction={`/comment/${comment.id}?/like`}
				class={comment.isLiked ? upSelected : upUnselected}
			>
				<ThumbsUp />
			</button>
			<span class="text-xs font-bold">{comment.like_count}</span>
			<button
				formaction={`/comment/${comment.id}?/dislike`}
				class={comment.isDisliked ? downSelected : downUnselected}
			>
				<ThumbsDown />
			</button>
		</form>
	{/each}
</div>
