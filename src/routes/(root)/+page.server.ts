import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const body = await event.request.formData();
	}
};

export const load: PageServerLoad = ({ url, locals }) => {
	return {
		url: url.toString()
	};
};
