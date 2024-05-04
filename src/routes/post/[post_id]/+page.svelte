<script>
	import { marked } from 'marked';
	import './markdown-light.css';
	import { enhance } from '$app/forms';
	export let data;
	marked.use({
		gfm: true
	});

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
		<a href="/"
			><svg
				viewBox="0 0 24 24"
				width="40"
				height="40"
				stroke="currentColor"
				stroke-width="1.4"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="css-i6dzq1 p-2 bg-gray-200 rounded-full"
				><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"
				></polyline></svg
			></a
		>
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
	</div>
	<h1 class="text-2xl font-semibold">{data.post.title}</h1>
	<section class="markdown-body mt text-sm">
		{@html marked.parse(data.post.content)}
	</section>
	<form method="POST" action="?/comment" class="mt-4 flex items-center">
		<input class="rounded-full" type="text" name="content" placeholder="Add a comment" />
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-thumbs-up"
					><path
						d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
					/>
				</svg>
			</button>
			<span class="text-xs font-bold">{comment.like_count}</span>
			<button
				formaction={`/comment/${comment.id}?/dislike`}
				class={comment.isDisliked ? downSelected : downUnselected}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-thumbs-down"
					><path
						d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"
					/></svg
				>
			</button>
		</form>
	{/each}
</div>
