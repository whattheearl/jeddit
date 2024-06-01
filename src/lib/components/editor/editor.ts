import { writable } from 'svelte/store';

export const editable = writable(false);
export const toggleEditable = () => editable.update(prev => !prev);

export const content = writable('');
export const updateContent = (updatedContent: string) => content.update(_ => updatedContent)

