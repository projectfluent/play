export function build_link_url({ messages, variables, locale, dir, visible_panels }) {
    const str = JSON.stringify({
        messages,
        variables,
        setup: {
            visible: Array.from(visible_panels),
            locale,
            dir,
        }
    });
    const bytes = new TextEncoder().encode(str);
    const base64 = btoa(String.fromCodePoint(...bytes));
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
    const bytes = Uint8Array.from(atob(base64), (m) => m.codePointAt(0));
    const str = new TextDecoder().decode(bytes)
    return JSON.parse(str);
}
