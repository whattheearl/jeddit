<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const settingRowClass = 'flex px-4 max-w-[700px] mb-8';
	const settingNameClass = 'font-semibold text-gray-800';
	const settingValueClass = 'text-sm text-gray-400';
</script>

<main class="w-full max-w-[900px] mx-auto">
	<div class="display: flex; flex-direction: column;">
		<h2 class="mx-4 py-4 font-semibold text-xl text-gray-800">Account settings</h2>

		<form method="POST" class={settingRowClass}>
			<div>
				<h3 class={settingNameClass}>Display name</h3>
				<p class={settingValueClass}>
					{#if !data.user.username_finalized}
						<span>Set a display name.</span>
					{:else}
						<span>This is your forever name.</span>
					{/if}
				</p>
			</div>
			<div style="display: flex; align-items: center; margin-left: auto;">
				<input
					class="mr-2 w-[35ch] h-[38px]"
					type="text"
					name="name"
					placeholder={data.user.username ?? 'Display name'}
					readonly={data.user.username_finalized}
					bind:value={data.user.username}
				/>
				{#if !data.user.username_finalized}
					<button
						class="py-2 px-4 font-extrabold text-blue-600 rounded-full border border-blue-600 hover:curser hover:bg-blue-100"
						type="submit"
					>
						Update
					</button>
				{/if}
			</div>
		</form>

		<div class={settingRowClass}>
			<div>
				<h3 class={settingNameClass}>Email address</h3>
				<p class={settingValueClass}>{data.user.email}</p>
			</div>
		</div>
	</div>
</main>
