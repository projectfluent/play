export function build_link_url({ messages, variables, locale, dir, visible_panels }) {
    const body = {
        messages,
        variables,
        setup: {
            visible: Array.from(visible_panels),
            locale,
            dir,
        }
    };
    const base64 = btoa(JSON.stringify(body));
    const link = base64
        .replace(/[+]/g, '-')
        .replace(/[/]/g, '_')
        .replace(/=+$/, '');
    const url = new URL(window.location)
    url.searchParams.set('s', link)
    return url
}

export function parse_link(link) {
    const base64 = link.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}
