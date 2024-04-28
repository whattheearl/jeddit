<script>
	export let data;
	console.log({ data });
</script>

<div class="w-full max-w-2xl mx-auto">
	<div class="mt-12 flex items-center gap-2">
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
			<div class="flex items-center text-xs my-[-2px]">
				<span class="font-bold">/j/{data.post.community}</span>
        <span class="mx-2 font-extrabold text-gray-400">•</span>
				<span class="font-thin text-gray-400">{data.post.createdAt}</span>
			</div>
			<span class="text-xs my-[-2px] text-gray-700">{data.post.username}</span>
		</div>
	</div>
	<h1 class="text-2xl font-semibold">{data.post.title}</h1>
	<p class="mt-4 text-sm">{data.post.content}</p>
</div>
