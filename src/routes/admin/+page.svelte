<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<ul class="mx-auto mt-2 flex w-full max-w-4xl flex-col md:mt-8">
    {#each data.users as user}
        <a
            href={`/admin/user/${user.id.toString()}`}
            class="mb-2 flex w-full items-center bg-gray-100 px-[10px] py-[6px]"
        >
            <span class="text-sm text-gray-900">{user.id}</span>
            <img
                class="ml-2 h-4 w-4"
                src={`data:image/jpeg;base64, ${data.user.picture}`}
                alt="portrait"
            />
            <span class="ml-2 text-sm text-gray-900">{user.email}</span>
            <span class="ml-2 text-sm text-gray-900">{user.name}</span>
        </a>
    {/each}
</ul>
