import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
    default: async (event) => {
        const body = await event.request.formData();
        console.log(body)
        // TODO log the user in
        console.log('test');
    }
};

export const load: PageServerLoad = ({ url }) => {
    return {
        url: url.toString(),
    }
}