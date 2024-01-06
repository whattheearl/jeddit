import type { Action, Actions } from "./$types";

export const load = () => {
    return {
        user: {
            name: 'wte'
        }
    }
}

export const actions: Actions = {
	default: async (event) => {
        const body = await event.request.formData();
        console.log(body)
		// TODO log the user in
        console.log('test');
	}
};