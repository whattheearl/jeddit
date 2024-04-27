<script>
	export let fill = false;
	const filled = 'p-2 rounded-full text-[#ff4500] hover:bg-gray-300 hover:cursor-pointer';
	const unfilled = 'p-2 rounded-full hover:text-[#ff4500] hover:bg-gray-300 hover:cursor-pointer';
</script>

<span class={fill ? filled : unfilled}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill={fill ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="feather feather-heart"
		><path
			d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
		></path></svg
	>
</span>
