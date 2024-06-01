<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import HorizontalElipsis from '$lib/components/horizontal-elipsis.svelte';
	import { enhance } from '$app/forms';
	import LeftArrow from '$lib/components/left-arrow.svelte';
	import ThumbsDown from '$lib/components/thumbs-down.svelte';
	import ThumbsUp from '$lib/components/thumbs-up.svelte';
	import { goto } from '$app/navigation';

	//** @type {import('./$types').PageLoad */
	export let data;
	const showEditButton = data.user && data.user.username == data.post.username;
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
		{#if showEditButton}
			<div class="ml-auto">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger><HorizontalElipsis /></DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Item on:click={() => goto(`/editpost/${data.post.id}`)}>
								Edit
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		{/if}
	</div>
	<div class="w-full my-4">
		<div class="tiptap ProseMirror">{@html data.post.content}</div>
	</div>
	<form method="POST" action="?/comment" class="mt-4 flex items-center">
		<input
			id="content"
			class="rounded-full"
			type="text"
			name="content"
			placeholder="Add a comment"
		/>
		<button class="p-2 ml-2 text-white text-sm font-semibold bg-blue-500 rounded-full" type="submit"
			>Comment</button
		>
	</form>
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
