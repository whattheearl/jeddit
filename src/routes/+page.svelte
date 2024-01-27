<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
</script>

<div style="display: flex; flex-direction: column; align-items: center; max-width: 700px; margin: 0 auto;">
	<div style="display: flex; width: 100%; padding: 0 16px;">
		<div style="margin: 16px 0;">jeddit</div>
		<a
			href={`${base}/account/login?referer=${$page.data.url}`}
			style="display: flex; align-items: center; margin: 16px 0 16px auto">signin</a
		>
		<!-- <div id="username" style="display: flex; align-items: center; margin: 16px 0 16px auto">{$page.data.user.name}</div> -->
	</div>
	<form method="POST" style="padding: 16px; border: 1px solid black; width: 100%;">
		<div style="display: flex; align-items: center;">
			<label for="post" style="padding-right: 4px;">Create&nbsp;Post</label>
			<input id="post" name="post" type="text" style="font-size: 24px; width: 100%;" />
			<button type="submit" style="height: 33.5px">submit</button>
		</div>
	</form>

	<main style="width: 100%;">
		<article style="border: 1px solid black; margin: 16px 0; padding: 8px; width: 100%;">
			<h2 style="margin-bottom: 16px;">Hello world!</h2>
			<p>Just some palce holder text. Don't worry about it...</p>
		</article>
	</main>
</div>
