<script lang="ts">
    import { page } from '$app/stores';
    $: open = false;
    const toggleProfileMenu = () => (open = !open);
</script>

<div class="relative">
    <button
        on:click={toggleProfileMenu}
        type="button"
        class="-m-1.5 flex items-center p-1.5 hover:curser hover:bg-gray-200 rounded-full"
        style="margin: -6px; display: flex; align-items: center; padding: 6px;"
        id="user-menu-button"
        aria-expanded="false"
        aria-haspopup="true"
    >
        <span class="sr-only">Open user menu</span>
        <img
            class="h-8 w-8 rounded-full bg-gray-50"
            style="height: 32px; width: 32px; border-radius: 100%; background-color: gray;"
            src={`data:image/jpeg;base64, ${$page.data.user.picture}`}
            alt=""
        />
        <span class="hidden lg:flex lg:items-center" style="display: hidden;">
            <span class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true"
                >{$page.data.user.username}</span
            >
            <svg
                class="ml-2 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
            >
                <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                />
            </svg>
        </span>
    </button>

    <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  -->
    <div
        class={`${open ? '' : 'hidden'} absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu-button"
        tabindex="-1"
    >
        <!-- Active: "bg-gray-50", Not Active: "" -->
        <a
            on:click={toggleProfileMenu}
            href="/settings/account"
            class="block px-3 py-1 text-sm leading-6 text-gray-900"
            role="menuitem"
            tabindex="-1"
            id="user-menu-item-1">Settings</a
        >
        <a
            on:click={toggleProfileMenu}
            href="/signout"
            class="block px-3 py-1 text-sm leading-6 text-gray-900"
            role="menuitem"
            tabindex="-1"
            id="user-menu-item-1">Sign out</a
        >
    </div>
</div>
