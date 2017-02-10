
Object.defineProperty( exports, '__esModule', {
	value: true
} );

var _createClass = function() {
	function defineProperties( target, props ) {
		for ( var i = 0; i < props.length; i++ ) {
			var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ( 'value' in descriptor ) descriptor.writable = true; Object.defineProperty( target, descriptor.key, descriptor );
		}
	} return function( Constructor, protoProps, staticProps ) {
		if ( protoProps ) defineProperties( Constructor.prototype, protoProps ); if ( staticProps ) defineProperties( Constructor, staticProps ); return Constructor;
	};
}();

var _react = require( 'react' );

var _shallowequal = require( 'shallowequal' );

var _shallowequal2 = _interopRequireDefault( _shallowequal );

var _reactRedux = require( 'react-redux' );

var _redux = require( 'redux' );

var _debug = require( 'debug' );

var _debug2 = _interopRequireDefault( _debug );

var _selectors = require( './selectors' );

var _state = require( './state' );

function _interopRequireDefault( obj ) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck( instance, Constructor ) {
	if ( !( instance instanceof Constructor ) ) {
		throw new TypeError( 'Cannot call a class as a function' );
	}
}

function _possibleConstructorReturn( self, call ) {
	if ( !self ) {
		throw new ReferenceError( "this hasn't been initialised - super() hasn't been called" );
	} return call && ( typeof call === 'object' || typeof call === 'function' ) ? call : self;
}

function _inherits( subClass, superClass ) {
	if ( typeof superClass !== 'function' && superClass !== null ) {
		throw new TypeError( 'Super expression must either be null or a function, not ' + typeof superClass );
	} subClass.prototype = Object.create( superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } } ); if ( superClass ) Object.setPrototypeOf ? Object.setPrototypeOf( subClass, superClass ) : subClass.__proto__ = superClass;
} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * External dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * Internal dependencies
 */

var debug = ( 0, _debug2.default )( 'query:review' );

var QueryReviews = function( _Component ) {
	_inherits( QueryReviews, _Component );

	function QueryReviews() {
		_classCallCheck( this, QueryReviews );

		return _possibleConstructorReturn( this, ( QueryReviews.__proto__ || Object.getPrototypeOf( QueryReviews ) ).apply( this, arguments ) );
	}

	_createClass( QueryReviews, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.request( this.props );
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps( nextProps ) {
			if ( this.props.reviewSlug === nextProps.reviewSlug && ( 0, _shallowequal2.default )( this.props.query, nextProps.query ) ) {
				return;
			}

			this.request( nextProps );
		}
	}, {
		key: 'request',
		value: function request( props ) {
			var single = !!props.reviewSlug;

			if ( !single && !props.requestingReviews ) {
				debug( 'Request review list using query ' + props.query );
				props.requestReviews( props.query );
			}

			if ( single && !props.requestingReview ) {
				debug( 'Request single review ' + props.reviewSlug );
				props.requestReview( props.reviewSlug );
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}] );

	return QueryReviews;
}( _react.Component );

QueryReviews.propTypes = {
	reviewSlug: _react.PropTypes.string,
	query: _react.PropTypes.object,
	requestingReviews: _react.PropTypes.bool,
	requestReviews: _react.PropTypes.func
};

QueryReviews.defaultProps = {
	requestReviews: function requestReviews() {}
};

exports.default = ( 0, _reactRedux.connect )( function( state, ownProps ) {
	var reviewSlug = ownProps.reviewSlug,
	    query = ownProps.query;

	return {
		requestingReview: ( 0, _selectors.isRequestingReview )( state, reviewSlug ),
		requestingReviews: ( 0, _selectors.isRequestingReviewsForQuery )( state, query )
	};
}, function( dispatch ) {
	return ( 0, _redux.bindActionCreators )( {
		requestReviews: _state.requestReviews,
		requestReview: _state.requestReview
	}, dispatch );
} )( QueryReviews );
module.exports = exports.default;
