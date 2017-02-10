/**
 * External dependencies
 */
import { Component, PropTypes } from 'react';
import shallowEqual from 'shallowequal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import { isRequestingReviewsForQuery, isRequestingReview } from './selectors';
import { requestReviews, requestReview } from './state';

const debug = debugFactory( 'query:review' );

class QueryReviews extends Component {
	componentWillMount() {
		this.request(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.reviewSlug === nextProps.reviewSlug &&
				shallowEqual( this.props.query, nextProps.query)) {
			return;
		}

		this.request(nextProps);
	}

	request(props) {
		const single = !!props.reviewSlug;

		if (!single && !props.requestingReviews) {
			debug(`Request review list using query ${props.query}`);
			props.requestReviews(props.query);
		}

		if (single && !props.requestingReview) {
			debug(`Request single review ${props.reviewSlug}`);
			props.requestReview(props.reviewSlug);
		}
	}

	render() {
		return null;
	}
}

QueryReviews.propTypes = {
	reviewSlug: PropTypes.string,
	query: PropTypes.object,
	requestingReviews: PropTypes.bool,
	requestReviews: PropTypes.func
};

QueryReviews.defaultProps = {
	requestReviews: () => {}
};

export default connect(
	(state, ownProps) => {
		const {reviewSlug, query} = ownProps;
		return {
			requestingReview: isRequestingReview(state, reviewSlug),
			requestingReviews: isRequestingReviewsForQuery(state, query)
		};
	},
	(dispatch) => {
		return bindActionCreators({
			requestReviews,
			requestReview
		}, dispatch);
	}
)(QueryReviews);
