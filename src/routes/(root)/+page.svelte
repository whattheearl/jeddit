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
				<article class="border-b border-gray-200" style="width: 100%;  background-color: #fff;">
					<a href={`/post/${post.id}`} class="px-4 py-1 my-1">
						<h3 class="m-0" style="color: rgb(34, 34, 34); font-size: 18px; line-height: 22px;">
							{post.title}
						</h3>
						{#if post.content}
							<p
								style="color: rgb(28, 28, 28); font-size: 14px; line-height: 22px; margin-top: 8px;"
							>
								{post.content}
							</p>
						{/if}
					</a>
				</article>
			{/each}
		</main>
	</div>
</div>

<style>
</style>
