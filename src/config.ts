let host: string | null = null;
let withAcl: boolean = localStorage.getItem('config_with_acl') === 'true';
let withMeta: boolean = localStorage.getItem('config_with_meta') === 'true';

const config = {
    getHost() {
        return host;
    },
    setHost(newHost: string) {
        host = newHost;
        while (host.endsWith('/'))
            host = host.slice(0, -1);
    },
    withAcl() {
        return withAcl;
    },
    toggleWithAcl() {
        withAcl = !withAcl
        localStorage.setItem('config_with_acl', withAcl ? 'true' : 'false')
    },
    withMeta() {
        return withMeta;
    },
    toggleWithMeta() {
        withMeta = !withMeta
        localStorage.setItem('config_with_meta', withMeta ? 'true' : 'false')
    },
}

export default config;

