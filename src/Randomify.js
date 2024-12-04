import { useState } from 'react';
import './Randomify.css';
import Fetcher from './fetcher.js';

function Randomify() {

	// Page
	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState('');
	const [querysearch, setQuery] = useState('');
	const [recents, setRecents] = useState([]);

	const [id, setID] = useState('');
	const [res, setRes] = useState({});
	const [icon, setIcon] = useState(false);

	// Assets
	const [songs, setSongs] = useState([]);
	const [albums, setAlbums] = useState([]);
	const [artists, setArtists] = useState([]);

	// Selects the artist after the querysearch
	function pickArtist(id) {
		setID(id);
	}

	// API call (searches for artist matching query)
	async function searchArtist(querysearch) {
		setLoading(true);

		// Fetch a list of the top 10 likely artists in search
		const data = await Fetcher({
			querysearch,
			endpoint: 'search',
			type: 'artist',
			limit: 10
		});
		// After result
		if (!('items' in data)) {
			setFeedback('Sorry, no artists with this name were found.');
			return setLoading(false);
		}

		setArtists(data.items);
		setLoading(false);
	}

	async function getResults(artistID = id) {
		setLoading(true);
		console.log('getting results ' + artists + '!');

		const data = await Fetcher(artistID, 'search', '&type=artist&limit=5');

		// first, get albums and randomize one id
		// from this id search for the tracks and then return a random track
		setLoading(false);

		return data;
	}

	function cancel() {
		setQuery('');
		setLoading(false);
	}

	console.log(id)

	return (
		<div className='random-spa-container'>
			<div className='random-spa-header'>
				{icon && id ?
					<>
						<div className='random-spa-minititle'><b>Random</b>ify.</div>
						<img className='random-spa-icon' src={icon} alt='' />
					</>
					:
					<div className='random-spa-title'><b>Random</b>ify.</div>
				}


				<div className='input-container'>
					<div className='input-control'>
						<input
							className='random-spa-input'
							type='text'
							value={querysearch}
							placeholder='Search by artist . . .'
							onKeyDown={({ key }) => { if (key === 'Enter') { searchArtist(querysearch) } }}
							onChange={({ target }) => setQuery(target.value)}
						/>
						{querysearch !== '' &&
							<span className='input-control-clear icon' onClick={cancel}>close</span>
						}
					</div>
					<span
						className='input-control-search icon'
						style={!querysearch ? { 'opacity': 0.6, 'cursor': 'auto' } : {}}
						onClick={querysearch ? () => searchArtist(querysearch) : null}
					>
						search
					</span>
				</div>
			</div>
			{recents.length > 0 &&
				<div className='random-spa-result-recents'>
					Recent searches:
					<div className='random-spa-result-container'>
						{recents.map((nm) => (
							<div className='random-spa-result-name' onClick={() => searchArtist(nm)}>
								{nm}
								<span
									className='random-spa-result-icon icon'
									onClick={() => setRecents(recents.filter(n => n !== nm))}
								>close</span>
							</div>
						))}
					</div>
				</div>
			}
			<div className='random-spa-body'>
				{loading ? // Loading must take whole body of page
					<div className='random-spa-loading'>
						<span className='random-spa-loading-icon icon'>progress_activity</span>
						<div className='random-spa-loading-text'>loading . . . </div>
					</div>
					: (
						/* {!loading && artists.length > 0 &&
							<div className='random-spa-results'>
								<img src={icon} alt='' className='random-spa-album' style={{ width: 300, height: 300, borderRadius: 5 }} />
								<div className='random-spa-results-info'>
									<div className='random-spa-results-track'>TRACK NAME</div>
									<div className='random-spa-results-album'>ALBUM NAME</div>
									<div className='random-spa-results-artist'>{artists[0]}</div>
									<div className='random-spa-button'>
										<span className='icon'>shuffle</span> Random Track
									</div>
									<div className='random-spa-button'>
										<span className='icon'>shuffle</span> Random Album
									</div>
								</div>
							</div>
						} */
						artists.length > 0 && !id &&
						(
							<div className='random-spa-artists-container'>
								{artists.map((art, index) => {
									return (
										<div
											className={`random-spa-artist-container` + (index === 0 ? ' random-spa-artist-best-result' : '')}
											onClick={() => setID(art.id)}
										>
											<img src={art.images[0].url} alt={art.name} />
											<div className='random-spa-artist-name'>{art.name}</div>
										</div>
									);
								})}
							</div>

						)
					)}
			</div>
		</div>
	);
}

export default Randomify;
