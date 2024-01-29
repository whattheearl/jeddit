<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import '../../app.css';
</script>

<header
	style="display: flex; width: 100%; padding: 0 20px; background-color: #fff; border-bottom: 1px solid #ddd; align-items: center;"
>
	<div
		style="display: flex; height: 48px; align-items: center; color: rgb(255, 69, 0); font-weight: 800; font-size: 24px; letter-spacing: -2px;"
	>
		jeddit
	</div>
	<a
		href={`${base}	/login?referer=${$page.data.url}`}
		style="background-color: rgb(217, 58, 0); margin-left: auto; border: none; height: 40px; text-decoration: none; display: flex; align-items: center;"
	>
		<span style=" padding: 0 12px; color: white; font-weight: 600; font-size: 14px;">Log In</span>
	</a>
</header>

<slot />
