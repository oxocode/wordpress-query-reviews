/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import keyBy from 'lodash/keyBy';

/**
 * Internal dependencies
 */
import * as selectors from '../src/selectors';
import reviews from './fixtures/reviews';

const reviewsById = keyBy( reviews, 'id' );

const state = deepFreeze( {
	reviews: {
		items: reviewsById,
		requests: {
			'test-review': false,
			'pending-review': true,
		},
		totalPages: {
			'{"paged":1}': '3',
			'{"paged":2}': '3',
		},
		queryRequests: {
			'{"paged":1}': false,
			'{"paged":2}': false,
			'{"paged":3}': true,
		},
		queries: {
			'{"paged":1}': [
				2,
				5,
			],
			'{"paged":2}': [
				6,
				8,
			]
		},
		slugs: {
			'test-review': 2,
			'another-review': 5,
			'another-review-another-review': 6,
			'review-another-review': 8,
		}
	}
} );

describe( 'Review selectors', function() {
	it( 'should contain isRequestingReview method', function() {
		expect( selectors.isRequestingReview ).to.be.a( 'function' );
	} );

	it( 'should contain getReviewIdFromSlug method', function() {
		expect( selectors.getReviewIdFromSlug ).to.be.a( 'function' );
	} );

	it( 'should contain getReview method', function() {
		expect( selectors.getReview ).to.be.a( 'function' );
	} );

	it( 'should contain isRequestingReviewsForQuery method', function() {
		expect( selectors.isRequestingReviewsForQuery ).to.be.a( 'function' );
	} );

	it( 'should contain getReviewsForQuery method', function() {
		expect( selectors.getReviewsForQuery ).to.be.a( 'function' );
	} );

	it( 'should contain getTotalPagesForQuery method', function() {
		expect( selectors.getTotalPagesForQuery ).to.be.a( 'function' );
	} );

	describe( 'isRequestingReview', function() {
		it( 'Should get `false` if the review has not been requested yet', function() {
			expect( selectors.isRequestingReview( state, 'unrequested-review' ) ).to.be.false;
		} );

		it( 'Should get `false` if this review has already been fetched', function() {
			expect( selectors.isRequestingReview( state, 'test-review' ) ).to.be.false;
		} );

		it( 'Should get `true` if this review is being fetched', function() {
			expect( selectors.isRequestingReview( state, 'pending-review' ) ).to.be.true;
		} );
	} );

	describe( 'getReviewIdFromSlug', function() {
		it( 'Should get `false` if the review has not been requested yet', function() {
			expect( selectors.getReviewIdFromSlug( state, 'unrequested-review' ) ).to.be.false;
		} );

		it( 'Should get the review ID if this review is in our state', function() {
			expect( selectors.getReviewIdFromSlug( state, 'test-review' ) ).to.eql( 2 );
		} );
	} );

	describe( 'getReview', function() {
		it( 'Should get `undefined` if the review has not been requested yet', function() {
			expect( selectors.getReview( state, 10 ) ).to.be.undefined;
		} );

		it( 'Should get the review object if this review is in our state', function() {
			expect( selectors.getReview( state, 2 ) ).to.eql( reviewsById[2] );
		} );
	} );

	describe( 'isRequestingReviewsForQuery', function() {
		it( 'Should get `false` if the review query has not been requested yet', function() {
			expect( selectors.isRequestingReviewsForQuery( state, { paged: 4 } ) ).to.be.false;
		} );

		it( 'Should get `false` if this review query has already been fetched', function() {
			expect( selectors.isRequestingReviewsForQuery( state, { paged: 1 } ) ).to.be.false;
		} );

		it( 'Should get `true` if this review query is being fetched', function() {
			expect( selectors.isRequestingReviewsForQuery( state, { paged: 3 } ) ).to.be.true;
		} );
	} );

	describe( 'getReviewsForQuery', function() {
		it( 'Should get null if the review query has not been requested yet', function() {
			expect( selectors.getReviewsForQuery( state, { paged: 4 } ) ).to.be.null;
		} );

		it( 'Should get a list of review objects if the response is in our state', function() {
			const reviewList = [
				reviewsById[2],
				reviewsById[5]
			];
			expect( selectors.getReviewsForQuery( state, { paged: 1 } ) ).to.eql( reviewList );
		} );
	} );

	describe( 'getTotalPagesForQuery', function() {
		it( 'Should get a default number (1) of pages available if the query has not been requested yet', function() {
			expect( selectors.getTotalPagesForQuery( state, { paged: 4 } ) ).to.eql( 1 );
		} );

		it( 'Should get the number of pages (pagination) available for a query', function() {
			expect( selectors.getTotalPagesForQuery( state, { paged: 1 } ) ).to.eql( 3 );
		} );
	} );
} );
