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

    const { querysearch, endpoint, type, limit } = params;

    const search = querysearch.replace(' ', '+');

    let url = `${apiURI}`;

    if (endpoint === 'search') {
        url = `/search?q=${search}`;
    } else {
        url = `/artist/${params}/albums`
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

    let data = await response.json();

    if ('artists' in data) {
        return data.artists;
    }

    return null;
}

export default Fetcher;