import { authURI, apiURI, clientID, clientSCT } from './constants.js';

// Before successfully extracting data from the API, we need to fetch the token
async function getToken() {
    const response = await fetch(`${authURI}/api/token`,
        {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + (btoa(clientID + ':' + clientSCT)),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        }
    );
    const data = await response.json();
    return data && data.access_token ? data.access_token : 'error';
};

function makeURL(params) {

    const { querysearch, endpoint, id, limit } = params;

    let url = `${apiURI}`;

    if (endpoint === 'search') {

        // Searches for artists according to query
        const query = querysearch.replace(' ', '+');
        url += `/search?q=${query}&type=artist`;

    } else if (endpoint === 'albums') {

        url += `/artists/${id}/albums`;

    } else if (endpoint === 'tracks') {

        url += `/albums/${id}/tracks`;

    }

    // Change limit if any
    if ('limit' in params) {
        url += `${url.includes('?') ? '&' : '?'}limit=${limit}`;
    }

    return url;
}


async function Fetcher(params) {

    // Makes url from params
    const url = makeURL(params);

    // Gets token if not expired
    const token = await getToken();
    const response = await fetch(url,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    var data = await response.json();

    if ('artists' in data) {
        return data.artists;
    }

    return data;
}

export default Fetcher;