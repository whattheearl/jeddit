import { base } from "$app/paths";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

export interface IProvider {
    name: string;
    authority: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
}

export const providers: Partial<IProvider>[] = [
    {
        name: 'google',
        authority: 'https://accounts.google.com',
    }
]

export function getProviderByName(name: string) {
    const filtered = providers.filter(p => p.name === name);
    if (filtered.length != 1)
        return null;

    const client_id = env[`${name}_client_id`];
    if (!client_id)
        error(500, `${name}_client_id missing`);

    const client_secret = env[`${name}_client_secret`];
    if (!client_secret)
        error(500, `${name}_client_secret missing`);

    return {
        ...filtered[0],
        client_id,
        client_secret,
        redirect_uri: `${env.host}${base}/auth/${name}/callback`,
    } as IProvider;
}