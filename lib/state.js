
Object.defineProperty( exports, '__esModule', {
	value: true
} );
exports.REVIEWS_REQUEST_FAILURE = exports.REVIEWS_REQUEST_SUCCESS = exports.REVIEWS_REQUEST = exports.REVIEWS_RECEIVE = exports.REVIEW_REQUEST_FAILURE = exports.REVIEW_REQUEST_SUCCESS = exports.REVIEW_REQUEST = undefined;
exports.items = items;
exports.requests = requests;
exports.queryRequests = queryRequests;
exports.totalPages = totalPages;
exports.queries = queries;
exports.slugs = slugs;
exports.requestReviews = requestReviews;
exports.requestReview = requestReview;

var _redux = require( 'redux' );

var _keyBy = require( 'lodash/keyBy' );

var _keyBy2 = _interopRequireDefault( _keyBy );

var _reduce = require( 'lodash/reduce' );

var _reduce2 = _interopRequireDefault( _reduce );

var _qs = require( 'qs' );

var _qs2 = _interopRequireDefault( _qs );

var _wordpressRestApiOauth = require( 'wordpress-rest-api-oauth-1' );

var _wordpressRestApiOauth2 = _interopRequireDefault( _wordpressRestApiOauth );

var _utils = require( './utils' );

function _interopRequireDefault( obj ) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _defineProperty( obj, key, value ) {
	if ( key in obj ) {
		Object.defineProperty( obj, key, { value: value, enumerable: true, configurable: true, writable: true } );
	} else {
		obj[key] = value;
	} return obj;
} /*global SiteSettings */
/**
 * External dependencies
 */

var api = new _wordpressRestApiOauth2.default( {
	url: SiteSettings.endpoint
} );

/**
 * Review actions
 */
var REVIEW_REQUEST = exports.REVIEW_REQUEST = 'wordpress-redux/review/REQUEST';
var REVIEW_REQUEST_SUCCESS = exports.REVIEW_REQUEST_SUCCESS = 'wordpress-redux/review/REQUEST_SUCCESS';
var REVIEW_REQUEST_FAILURE = exports.REVIEW_REQUEST_FAILURE = 'wordpress-redux/review/REQUEST_FAILURE';
var REVIEWS_RECEIVE = exports.REVIEWS_RECEIVE = 'wordpress-redux/reviews/RECEIVE';
var REVIEWS_REQUEST = exports.REVIEWS_REQUEST = 'wordpress-redux/reviews/REQUEST';
var REVIEWS_REQUEST_SUCCESS = exports.REVIEWS_REQUEST_SUCCESS = 'wordpress-redux/reviews/REQUEST_SUCCESS';
var REVIEWS_REQUEST_FAILURE = exports.REVIEWS_REQUEST_FAILURE = 'wordpress-redux/reviews/REQUEST_FAILURE';

/**
 * Tracks all known reviews, indexed by review global ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function items() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch ( action.type ) {
		case REVIEWS_RECEIVE:
			var reviews = ( 0, _keyBy2.default )( action.reviews, 'id' );
			return Object.assign( {}, state, reviews );
		default:
			return state;
	}
}

/**
 * Returns the updated review requests state after an action has been
 * dispatched. The state reflects a mapping of review ID to a
 * boolean reflecting whether a request for the review is in progress.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function requests() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch ( action.type ) {
		case REVIEW_REQUEST:
		case REVIEW_REQUEST_SUCCESS:
		case REVIEW_REQUEST_FAILURE:
			return Object.assign( {}, state, _defineProperty( {}, action.reviewSlug, REVIEW_REQUEST === action.type ) );
		default:
			return state;
	}
}

/**
 * Returns the updated review query requesting state after an action has been
 * dispatched. The state reflects a mapping of serialized query to whether a
 * network request is in-progress for that query.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function queryRequests() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch ( action.type ) {
		case REVIEWS_REQUEST:
		case REVIEWS_REQUEST_SUCCESS:
		case REVIEWS_REQUEST_FAILURE:
			var serializedQuery = ( 0, _utils.getSerializedReviewsQuery )( action.query );
			return Object.assign( {}, state, _defineProperty( {}, serializedQuery, REVIEWS_REQUEST === action.type ) );
		default:
			return state;
	}
}

/**
 * Tracks the page length for a given query.
 * @todo Bring in the "without paged" util, to reduce duplication
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function totalPages() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch ( action.type ) {
		case REVIEWS_REQUEST_SUCCESS:
			var serializedQuery = ( 0, _utils.getSerializedReviewsQuery )( action.query );
			return Object.assign( {}, state, _defineProperty( {}, serializedQuery, action.totalPages ) );
		default:
			return state;
	}
}

/**
 * Returns the updated review query state after an action has been dispatched.
 * The state reflects a mapping of serialized query key to an array of review
 * global IDs for the query, if a query response was successfully received.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function queries() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch ( action.type ) {
		case REVIEWS_REQUEST_SUCCESS:
			var serializedQuery = ( 0, _utils.getSerializedReviewsQuery )( action.query );
			return Object.assign( {}, state, _defineProperty( {}, serializedQuery, action.reviews.map( function( review ) {
				return review.id;
			} ) ) );
		default:
			return state;
	}
}

/**
 * Tracks the slug->ID mapping for reviews
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function slugs() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch ( action.type ) {
		case REVIEW_REQUEST_SUCCESS:
			return Object.assign( {}, state, _defineProperty( {}, action.reviewSlug, action.reviewId ) );
		case REVIEWS_RECEIVE:
			var reviews = ( 0, _reduce2.default )( action.reviews, function( memo, u ) {
				memo[u.slug] = u.id;
				return memo;
			}, {} );
			return Object.assign( {}, state, reviews );
		default:
			return state;
	}
}

exports.default = ( 0, _redux.combineReducers )( {
	items: items,
	requests: requests,
	totalPages: totalPages,
	queryRequests: queryRequests,
	queries: queries,
	slugs: slugs
} );

/**
 * Triggers a network request to fetch reviews for the specified site and query.
 *
 * @param  {String}   query  Review query
 * @return {Function}        Action thunk
 */

function requestReviews() {
	var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	return function( dispatch ) {
		dispatch( {
			type: REVIEWS_REQUEST,
			query: query
		} );

		query._embed = true;

		api.get( '/wp/v2/reviews', query ).then( function( reviews ) {
			dispatch( {
				type: REVIEWS_RECEIVE,
				reviews: reviews
			} );
			requestPageCount( '/wp/v2/reviews', query ).then( function( count ) {
				dispatch( {
					type: REVIEWS_REQUEST_SUCCESS,
					query: query,
					totalPages: count,
					reviews: reviews
				} );
			} );
			return null;
		} ).catch( function( error ) {
			dispatch( {
				type: REVIEWS_REQUEST_FAILURE,
				query: query,
				error: error
			} );
		} );
	};
}

/**
 * Triggers a network request to fetch a specific review from a site.
 *
 * @param  {string}   reviewSlug  Review slug
 * @return {Function}           Action thunk
 */
function requestReview( reviewSlug ) {
	return function( dispatch ) {
		dispatch( {
			type: REVIEW_REQUEST,
			reviewSlug: reviewSlug
		} );

		var query = {
			slug: reviewSlug,
			_embed: true
		};

		api.get( '/wp/v2/reviews', query ).then( function( data ) {
			var review = data[0];
			dispatch( {
				type: REVIEWS_RECEIVE,
				reviews: [review]
			} );
			dispatch( {
				type: REVIEW_REQUEST_SUCCESS,
				reviewId: review.id,
				reviewSlug: reviewSlug
			} );
			return null;
		} ).catch( function( error ) {
			dispatch( {
				type: REVIEW_REQUEST_FAILURE,
				reviewSlug: reviewSlug,
				error: error
			} );
		} );
	};
}

function requestPageCount( url ) {
	var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	if ( url.indexOf( 'http' ) !== 0 ) {
		url = api.config.url + 'wp-json' + url;
	}

	if ( data ) {
		// must be decoded before being passed to ouath
		url += '?' + decodeURIComponent( _qs2.default.stringify( data ) );
		data = null;
	}

	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	};

	return fetch( url, {
		method: 'HEAD',
		headers: headers,
		mode: 'cors',
		body: null
	} ).then( function( response ) {
		return parseInt( response.headers.get( 'X-WP-TotalPages' ), 10 ) || 1;
	} );
}
