import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const referer = url.searchParams.get('referer');
	return {
		referer
	};
};
