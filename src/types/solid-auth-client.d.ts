declare module 'solid-auth-client' {
    function fetch(input: RequestInfo, options?: RequestInit): Promise<Response>;
    function login(idp: string, options: loginOptions): Promise<Session | null>;
    function popupLogin(options: loginOptions): Promise<Session | null>;
    function currentSession(storage?: AsyncStorage): Promise<Session | null>;
    function trackSession(callback: Function): Promise<void>;
    function logout(storage?: AsyncStorage): Promise<void>;
}

interface AsyncStorage {
    getItem(key: string): Promise<?string>;
    setItem(key: string, val: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}
type loginOptions = {
    callbackUri?: string,
    popupUri: string,
    storage?: AsyncStorage
}

type webIdOidcSession = {
    idp: string,
    webId: string,
    accessToken: string,
    idToken: string,
    clientId: string,
    sessionKey: string
}
type Session = webIdOidcSession;