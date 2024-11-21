export interface IHttpRequestHeader {
    [k:string]:string;
}

export const httpRequestHeader = (
    getStaffRights:boolean,
    source:'client'|'SSR',
    renewSession:boolean,
    csrfToken?:string,
    sessionID?:string,
) => {
    const result:IHttpRequestHeader = {
        "X-GET-STAFF-RIGHTS":getStaffRights ? 'true' : 'false',
        "X-Request-Source":source,
        "X-Renew-Session":renewSession ? 'true' : 'false',
    }
    if (!!csrfToken) result["X-CSRF-Token"] = csrfToken
    if (!!sessionID) result["X-Session-ID"] = sessionID
    return result
}