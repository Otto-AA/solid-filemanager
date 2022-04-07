let host: string | null = null;

const config = {
    getHost() {
        return host;
    },
    setHost(newHost: string) {
        host = newHost;
        while (host.endsWith('/'))
            host = host.slice(0, -1);
    }
}

export default config;

