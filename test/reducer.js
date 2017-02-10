/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import keyBy from 'lodash/keyBy';

/**
 * Internal dependencies
 */
import {
	// action-types
	REVIEW_REQUEST,
	REVIEW_REQUEST_FAILURE,
	REVIEW_REQUEST_SUCCESS,
	REVIEWS_RECEIVE,
	REVIEWS_REQUEST,
	REVIEWS_REQUEST_FAILURE,
	REVIEWS_REQUEST_SUCCESS,
	// reducers
	items,
	requests,
	totalPages,
	queryRequests,
	queries,
	slugs
} from '../src/state';

import reviews from './fixtures/reviews';
import review from './fixtures/single';

describe( 'Review reducer', () => {
	describe( 'items', () => {
		it( 'should have no change by default', () => {
			const newState = items( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should store the new reviews in state', () => {
			const newState = items( undefined, { type: REVIEWS_RECEIVE, reviews } );
			const reviewsById = keyBy( reviews, 'id' );
			expect( newState ).to.eql( reviewsById );
		} );

		it( 'should add new reviews onto the existing review array', () => {
			const originalState = deepFreeze( keyBy( reviews, 'id' ) );
			const newState = items( originalState, { type: REVIEWS_RECEIVE, reviews: [review] } );
			expect( newState ).to.eql( { ...originalState, 9: review } );
		} );
	} );

	describe( 'queryRequests', () => {
		it( 'should have no change by default', () => {
			const newState = queryRequests( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should track the requesting state of new queries', () => {
			const newState = queryRequests( undefined, { type: REVIEWS_REQUEST, query: { paged: 1 } } );
			expect( newState ).to.eql( { '{"paged":1}': true } );
		} );

		it( 'should track the requesting state of successful queries', () => {
			const originalState = deepFreeze( { '{"paged":1}': true } );
			const newState = queryRequests( originalState, { type: REVIEWS_REQUEST_SUCCESS, query: { paged: 1 } } );
			expect( newState ).to.eql( { '{"paged":1}': false } );
		} );

		it( 'should track the requesting state of failed queries', () => {
			const originalState = deepFreeze( { '{"paged":1}': true } );
			const newState = queryRequests( originalState, { type: REVIEWS_REQUEST_FAILURE, query: { paged: 1 } } );
			expect( newState ).to.eql( { '{"paged":1}': false } );
		} );

		it( 'should track the requesting state of additional queries', () => {
			const originalState = deepFreeze( { '{"paged":1}': false } );
			const newState = queryRequests( originalState, { type: REVIEWS_REQUEST, query: { paged: 2 } } );
			expect( newState ).to.eql( { ...originalState, '{"paged":2}': true } );
		} );
	} );

	describe( 'requests', () => {
		it( 'should have no change by default', () => {
			const newState = requests( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should track the requesting state of a new review', () => {
			const newState = requests( undefined, { type: REVIEW_REQUEST, reviewSlug: 'some-pending-slug' } );
			expect( newState ).to.eql( { 'some-pending-slug': true } );
		} );

		it( 'should track the requesting state of successful review requests', () => {
			const originalState = deepFreeze( { 'some-pending-slug': true } );
			const newState = requests( originalState, {
				type: REVIEW_REQUEST_SUCCESS,
				reviewSlug: 'some-pending-slug'
			} );
			expect( newState ).to.eql( { 'some-pending-slug': false } );
		} );

		it( 'should track the requesting state of failed review requests', () => {
			const originalState = deepFreeze( { 'some-pending-slug': true } );
			const newState = requests( originalState, {
				type: REVIEW_REQUEST_FAILURE,
				reviewSlug: 'some-pending-slug'
			} );
			expect( newState ).to.eql( { 'some-pending-slug': false } );
		} );

		it( 'should track the requesting state of additional review requests', () => {
			const originalState = deepFreeze( { 'some-pending-slug': true } );
			const newState = requests( originalState, { type: REVIEW_REQUEST, reviewSlug: 'a-new-review' } );
			expect( newState ).to.eql( { ...originalState, 'a-new-review': true } );
		} );
	} );

	describe( 'queries', () => {
		it( 'should have no change by default', () => {
			const newState = queries( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should track the review IDs for requested queries', () => {
			const action = {
				type: REVIEWS_REQUEST_SUCCESS,
				query: { paged: 1 },
				reviews
			};
			const newState = queries( undefined, action );
			expect( newState ).to.eql( { '{"paged":1}': [2, 5, 6, 8] } );
		} );

		it( 'should track the review IDs for additional requested queries', () => {
			const originalState = deepFreeze( { '{"paged":1}': [2, 5, 6, 8] } );
			const action = {
				type: REVIEWS_REQUEST_SUCCESS,
				query: { paged: 2 },
				reviews: [review]
			};
			const newState = queries( originalState, action );
			expect( newState ).to.eql( {
				'{"paged":1}': [2, 5, 6, 8],
				'{"paged":2}': [9]
			} );
		} );
	} );

	describe( 'slugs', () => {
		it( 'should have no change by default', () => {
			const newState = slugs( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should track the review IDs for requested review slugs', () => {
			const action = {
				type: REVIEW_REQUEST_SUCCESS,
				reviewId: 2,
				reviewSlug: 'test-review',
			};
			const newState = slugs( undefined, action );
			expect( newState ).to.eql( { 'test-review': 2 } );
		} );

		it( 'should track the review IDs for additional requested review slugs', () => {
			const originalState = deepFreeze( { 'test-review': 2 } );
			const action = {
				type: REVIEW_REQUEST_SUCCESS,
				reviewId: 9,
				reviewSlug: 'test-oooo-review',
			};
			const newState = slugs( originalState, action );
			expect( newState ).to.eql( {
				'test-review': 2,
				'test-oooo-review': 9
			} );
		} );
	} );

	describe( 'totalPages', () => {
		it( 'should have no change by default', () => {
			const newState = totalPages( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should track the pagination count for requested queries', () => {
			const action = {
				type: REVIEWS_REQUEST_SUCCESS,
				query: { paged: 1 },
				totalPages: 3
			};
			const newState = totalPages( undefined, action );
			expect( newState ).to.eql( { '{"paged":1}': 3 } );
		} );
	} );
} );
