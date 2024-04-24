<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div style="padding: 20px 24px;">
	<div
		style="display: flex; flex-direction: column; align-items: center; max-width: 700px; margin: 0 auto;"
	>
		<main style="width: 100%;">
			{#each data.posts as post}
				<article class="px-4 py-1 my-1 border-b border-gray-200 rounded hover:bg-gray-100">
					<a href={`/post/${post.id}`}>
						<header class="flex h-6 items-center">
							<div
								class="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-white font-black"
							>
								j/
							</div>
							<a class="flex text-xs items-center" href={`/j/${post.community}`}
								><span class="px-1 text-gray-700 font-semibold">{`/j/${post.community}`}</span></a
							>
							<span class="text-xs text-gray-500">{`${post.createdAt}`}</span>
						</header>
						<h3
							class="m-0 font-bold my-2"
							style="color: rgb(34, 34, 34); font-size: 18px; line-height: 22px;"
						>
							{post.title}
						</h3>
						{#if post.content}
							<p style="color: rgb(28, 28, 28); font-size: 14px; line-height: 22px;">
								{post.content}
							</p>
						{/if}
					</a>
				</article>
			{/each}
		</main>
	</div>
</div>
