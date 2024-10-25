
function generateRedirectURL (requestURL, redirectURL)
{
    let baseURL = new URL(requestURL);
    let params = new URLSearchParams();
    params.set("redirect", redirectURL);
    baseURL.search = params.toString();
    return baseURL.toString();
}

export {generateRedirectURL};