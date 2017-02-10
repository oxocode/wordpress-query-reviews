/*global SiteSettings */
/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import keyBy from 'lodash/keyBy';
import reduce from 'lodash/reduce';
import qs from 'qs';
import API from 'wordpress-rest-api-oauth-1';
const api = new API( {
	url: SiteSettings.endpoint
} );

import {
	getSerializedReviewsQuery
} from './utils';

/**
 * Review actions
 */
export const REVIEW_REQUEST = 'wordpress-redux/review/REQUEST';
export const REVIEW_REQUEST_SUCCESS = 'wordpress-redux/review/REQUEST_SUCCESS';
export const REVIEW_REQUEST_FAILURE = 'wordpress-redux/review/REQUEST_FAILURE';
export const REVIEWS_RECEIVE = 'wordpress-redux/reviews/RECEIVE';
export const REVIEWS_REQUEST = 'wordpress-redux/reviews/REQUEST';
export const REVIEWS_REQUEST_SUCCESS = 'wordpress-redux/reviews/REQUEST_SUCCESS';
export const REVIEWS_REQUEST_FAILURE = 'wordpress-redux/reviews/REQUEST_FAILURE';

/**
 * Tracks all known reviews, indexed by review global ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function items( state = {}, action ) {
	switch ( action.type ) {
		case REVIEWS_RECEIVE:
			const reviews = keyBy( action.reviews, 'id' );
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
export function requests( state = {}, action ) {
	switch ( action.type ) {
		case REVIEW_REQUEST:
		case REVIEW_REQUEST_SUCCESS:
		case REVIEW_REQUEST_FAILURE:
			return Object.assign( {}, state, { [action.reviewSlug]: REVIEW_REQUEST === action.type } );
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
export function queryRequests( state = {}, action ) {
	switch ( action.type ) {
		case REVIEWS_REQUEST:
		case REVIEWS_REQUEST_SUCCESS:
		case REVIEWS_REQUEST_FAILURE:
			const serializedQuery = getSerializedReviewsQuery( action.query );
			return Object.assign( {}, state, {
				[serializedQuery]: REVIEWS_REQUEST === action.type
			} );
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
export function totalPages( state = {}, action ) {
	switch ( action.type ) {
		case REVIEWS_REQUEST_SUCCESS:
			const serializedQuery = getSerializedReviewsQuery( action.query );
			return Object.assign( {}, state, {
				[serializedQuery]: action.totalPages
			} );
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
export function queries( state = {}, action ) {
	switch ( action.type ) {
		case REVIEWS_REQUEST_SUCCESS:
			const serializedQuery = getSerializedReviewsQuery( action.query );
			return Object.assign( {}, state, {
				[serializedQuery]: action.reviews.map( ( review ) => review.id )
			} );
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
export function slugs( state = {}, action ) {
	switch ( action.type ) {
		case REVIEW_REQUEST_SUCCESS:
			return Object.assign( {}, state, {
				[action.reviewSlug]: action.reviewId
			} );
		case REVIEWS_RECEIVE:
			const reviews = reduce( action.reviews, ( memo, u ) => {
				memo[u.slug] = u.id;
				return memo;
			}, {} );
			return Object.assign( {}, state, reviews );
		default:
			return state;
	}
}

export default combineReducers( {
	items,
	requests,
	totalPages,
	queryRequests,
	queries,
	slugs
} );

/**
 * Triggers a network request to fetch reviews for the specified site and query.
 *
 * @param  {String}   query  Review query
 * @return {Function}        Action thunk
 */
export function requestReviews( query = {} ) {
	return ( dispatch ) => {
		dispatch( {
			type: REVIEWS_REQUEST,
			query
		} );

		query._embed = true;

		api.get( '/wp/v2/reviews', query ).then( reviews => {
			dispatch( {
				type: REVIEWS_RECEIVE,
				reviews
			} );
			requestPageCount( '/wp/v2/reviews', query ).then( count => {
				dispatch( {
					type: REVIEWS_REQUEST_SUCCESS,
					query,
					totalPages: count,
					reviews
				} );
			} );
			return null;
		} ).catch( ( error ) => {
			dispatch( {
				type: REVIEWS_REQUEST_FAILURE,
				query,
				error
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
export function requestReview( reviewSlug ) {
	return ( dispatch ) => {
		dispatch( {
			type: REVIEW_REQUEST,
			reviewSlug
		} );

		const query = {
			slug: reviewSlug,
			_embed: true,
		};

		api.get( '/wp/v2/reviews', query ).then( data => {
			const review = data[0];
			dispatch( {
				type: REVIEWS_RECEIVE,
				reviews: [review]
			} );
			dispatch( {
				type: REVIEW_REQUEST_SUCCESS,
				reviewId: review.id,
				reviewSlug
			} );
			return null;
		} ).catch( ( error ) => {
			dispatch( {
				type: REVIEW_REQUEST_FAILURE,
				reviewSlug,
				error
			} );
		} );
	};
}

function requestPageCount( url, data = null ) {
	if ( url.indexOf( 'http' ) !== 0 ) {
		url = `${api.config.url}wp-json${url}`
	}

	if ( data ) {
		// must be decoded before being passed to ouath
		url += `?${decodeURIComponent( qs.stringify( data ) )}`;
		data = null
	}

	const headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	};

	return fetch( url, {
		method: 'HEAD',
		headers: headers,
		mode: 'cors',
		body: null
	} )
		.then( response => {
			return parseInt( response.headers.get( 'X-WP-TotalPages' ), 10 ) || 1;
		} );
}
