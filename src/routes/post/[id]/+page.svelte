<script>
	import { marked } from 'marked';
	import './markdown-light.css';
	export let data;
	marked.use({
		gfm: true
	});
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
				<span class="font-thin text-gray-400">{data.post.createdAt}</span>
			</div>
			<span class="text-xs mt-[-4px] text-gray-700">{data.post.username}</span>
		</div>
	</div>
	<h1 class="text-2xl font-semibold">{data.post.title}</h1>
	<section class="markdown-body mt text-sm">
		<!-- {@html marked.parse(data.post.content)} -->
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
			<span class="ml-1 text-xs font-thin text-gray-400">{comment.createdAt}</span>
		</div>
		<p class="ml-10 text-sm text-gray-800">{comment.content}</p>
	{/each}
</div>
