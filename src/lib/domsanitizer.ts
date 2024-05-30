import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

export const sanitizeHtml = (content: string) => {
	const window = new JSDOM('').window;
	const purify = DOMPurify(window);
	return purify.sanitize(content, { FORBID_TAGS: ['script', 'style'] });
};
