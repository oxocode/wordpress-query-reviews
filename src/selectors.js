/**
 * Internal dependencies
 */
import {
	getSerializedReviewsQuery
} from './utils';

/**
 * Returns a review object by its global ID.
 *
 * @param  {Object} state    Global state tree
 * @param  {String} globalId Review global ID
 * @return {Object}          Review object
 */
export function getReview( state, globalId ) {
	return state.reviews.items[globalId];
}

/**
 * Returns an array of reviews for the reviews query, or null if no reviews have been
 * received.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Object}  query  Review query object
 * @return {?Array}         Reviews for the review query
 */
export function getReviewsForQuery( state, query ) {
	const serializedQuery = getSerializedReviewsQuery( query );
	if ( !state.reviews.queries[serializedQuery] ) {
		return null;
	}

	return state.reviews.queries[serializedQuery].map( ( globalId ) => {
		return getReview( state, globalId );
	} ).filter( Boolean );
}

/**
 * Returns true if currently requesting reviews for the reviews query, or false
 * otherwise.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Object}  query  Review query object
 * @return {Boolean}        Whether reviews are being requested
 */
export function isRequestingReviewsForQuery( state, query ) {
	const serializedQuery = getSerializedReviewsQuery( query );
	return !!state.reviews.queryRequests[serializedQuery];
}

/**
 * Returns the number of total pages available for a given query.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Object}  query  Review query object
 * @return {int}            Number of pages
 */
export function getTotalPagesForQuery( state, query ) {
	const serializedQuery = getSerializedReviewsQuery( query );
	if ( !state.reviews.totalPages[serializedQuery] ) {
		return 1;
	}

	return parseInt( state.reviews.totalPages[serializedQuery], 10 );
}

/**
 * Returns true if a request is in progress for the specified review, or
 * false otherwise.
 *
 * @param  {Object}  state     Global state tree
 * @param  {String}  reviewSlug  Review Slug
 * @return {Boolean}           Whether request is in progress
 */
export function isRequestingReview( state, reviewSlug ) {
	if ( !state.reviews.requests ) {
		return false;
	}

	return !!state.reviews.requests[reviewSlug];
}

/**
 * Returns the Review ID for a given page slug
 *
 * @param  {Object}  state  Global state tree
 * @param  {string}  slug   Review slug
 * @return {int}            Review ID
 */
export function getReviewIdFromSlug( state, slug ) {
	if ( !state.reviews.slugs[slug] ) {
		return false;
	}

	return state.reviews.slugs[slug];
}
