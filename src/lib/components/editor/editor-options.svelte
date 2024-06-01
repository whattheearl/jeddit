<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import HorizontalElipsis from '$lib/components/horizontal-elipsis.svelte';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger><HorizontalElipsis /></DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item>Edit</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
