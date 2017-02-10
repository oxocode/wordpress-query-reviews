
Object.defineProperty( exports, '__esModule', {
	value: true
} );
exports.getNormalizedReviewsQuery = getNormalizedReviewsQuery;
exports.getSerializedReviewsQuery = getSerializedReviewsQuery;

var _omitBy = require( 'lodash/omitBy' );

var _omitBy2 = _interopRequireDefault( _omitBy );

function _interopRequireDefault( obj ) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var DEFAULT_REVIEWS_QUERY = {
	_embed: true,
	number: 10,
	offset: 0,
	order_by: 'meta_value',
	type: 'bc_review',
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
/**
 * External dependencies
 */
function getNormalizedReviewsQuery( query ) {
	return ( 0, _omitBy2.default )( query, function( value, key ) {
		return DEFAULT_REVIEWS_QUERY[key] === value;
	} );
}

/**
 * Returns a serialized reviews query, used as the key in the
 * `state.reviews.queries` state object.
 *
 * @param  {Object} query  Reviews query
 * @return {String}        Serialized reviews query
 */
function getSerializedReviewsQuery() {
	var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var normalizedQuery = getNormalizedReviewsQuery( query );
	return JSON.stringify( normalizedQuery ).toLocaleLowerCase();
}
