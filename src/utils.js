/**
 * External dependencies
 */
import omitBy from 'lodash/omitBy';

const DEFAULT_REVIEWS_QUERY = {
	_embed: true,
	number: 10,
	offset: 0,
	order_by: 'meta_value',
	type: 'reviews',
	order: 'ASC',
	fields: 'all_with_meta'
};

/**
 * Returns a normalized reviews query, excluding any values which match the
 * default review query.
 *
 * @param  {Object} query Reviews query
 * @return {Object}       Normalized reviews query
 */
export function getNormalizedReviewsQuery( query ) {
	return omitBy( query, ( value, key ) => DEFAULT_REVIEWS_QUERY[key] === value );
}

/**
 * Returns a serialized reviews query, used as the key in the
 * `state.reviews.queries` state object.
 *
 * @param  {Object} query  Reviews query
 * @return {String}        Serialized reviews query
 */
export function getSerializedReviewsQuery( query = {} ) {
	const normalizedQuery = getNormalizedReviewsQuery( query );
	return JSON.stringify( normalizedQuery ).toLocaleLowerCase();
}
