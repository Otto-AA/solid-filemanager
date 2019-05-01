let host: string | null = null;

export default {
    getHost() {
        return host;
    },
    setHost(newHost: string) {
        host = newHost;
        while (host.endsWith('/'))
            host = host.slice(0, -1);
    }
};
