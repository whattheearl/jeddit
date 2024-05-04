<script lang="ts">
	import type { ActionData, PageData } from "./$types";

  export let form: ActionData
	// const onPaste = (e: any) => {
	// 	console.log(e);
	// 	console.log(e.clipboardData.files);
	// 	const file = e.clipboardData.files[0];
	// 	if (!file || !file.type.startsWith('image/')) return;
	// 	console.log({ file });
	// };
</script>

<form method="POST" class="flex flex-col max-w-[700px] my-8 mx-auto gap-y-2">
	<header class="w-full border-b-1 border-gray-800">
		<h1>Create a post</h1>
	</header>

	<input
		class="my-4 w-full"
		type="text"
		name="title"
		placeholder="Title"
		contenteditable="true"
    value={form?.title ?? ''}
	/>
	<textarea
		contenteditable="true"
		class="py-2 w-full h-[10em]"
		name="content"
		placeholder="Text (optional)"
    value={form?.content ?? ''}
	/>
	<button
		class="ml-auto py-2 px-4 bg-blue-600 font-extrabold text-white rounded-full hover:curser hover:bg-blue-500"
		type="submit">Post</button
	>
</form>
