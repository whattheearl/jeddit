<script lang="ts">
	import { enhance } from '$app/forms';
	import Heart from '$lib/components/heart.svelte';
	import { marked } from 'marked';
	import type { PageData } from './$types';

	marked.use({
		gfm: true
	});

	export let data: PageData;
</script>

<div style="padding: 20px 24px; z-index: 1000">
	<div
		style="display: flex; flex-direction: column; align-items: center; max-width: 700px; margin: 0 auto;"
	>
		<main style="width: 100%;">
			{#each data.posts as p}
				<a href={`/post/${p.id}`}>
					<article
						class="w-full h-full px-4 py-1 my-1 rounded hover:cursor-pointer"
					>
						<header class="flex h-6 items-center">
							<div
								class="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-white font-black"
							>
								j/
							</div>
							<a class="flex text-xs items-center" href={`/post/${p.community}`}
								><span class="px-1 text-gray-700 font-semibold">{`/j/${p.community}`}</span></a
							>
							<span class="text-xs text-gray-500">{`${p.createdAt}`}</span>
						</header>
						<h3
							class="my-2 font-bold"
							style="color: rgb(34, 34, 34); font-size: 18px; line-height: 22px;"
						>
							{p.title}
						</h3>
						{#if p.content}
							<section class="text-sm line-clamp-6">
								{@html marked.parseInline(p.content)}
							</section>
						{/if}
						<button
							on:click={(e) => e.stopPropagation()}
							type="submit"
							form="likeForm"
							formaction={`/post/${p.id}?/like`}
							class="inline-flex my-2 items-center py-1 rounded-full bg-gray-100"
						>
							<Heart fill={p.liked} />
							<span class="pr-2 inline-block mx-1 text-sm font-semibold text-gray-700"
								>{p.likes}</span
							>
						</button>
					</article>
				</a>
			{/each}
		</main>
	</div>
</div>

<form id="likeForm" hidden method="POST" use:enhance></form>
