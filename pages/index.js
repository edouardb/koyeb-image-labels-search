/** @format */

import { findResultsState } from "react-instantsearch-dom/server";
import { isEqual } from "lodash";
import { withRouter } from "next/router";
import algoliasearch from "algoliasearch/lite";
import InstantSearch from "components/instant-search";
import PropTypes from "prop-types";
import qs from "qs";
import React from "react";

const searchClient = algoliasearch(
  __ALGOLIA_APP_ID__,
  __ALGOLIA_SEARCH_APP_KEY__
);

const updateAfter = 700;

const createURL = (state) => `?${qs.stringify(state)}`;

const pathToSearchState = (path) =>
  path.includes("?") ? qs.parse(path.slice(path.indexOf("?") + 1)) : {};

const searchStateToURL = (searchState) =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : "";

const DEFAULT_PROPS = {
  searchClient,
  indexName: __ALGOLIA_INDICE__,
};

class Home extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    resultsState: PropTypes.object,
    searchState: PropTypes.object,
  };

  state = {
    searchState: this.props.searchState,
    lastRouter: this.props.router,
  };

  static async getInitialProps({ asPath }) {
    const searchState = pathToSearchState(asPath);
    const resultsState = await findResultsState(InstantSearch, {
      ...DEFAULT_PROPS,
      searchState,
    });

    return {
      resultsState,
      searchState,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(state.lastRouter, props.router)) {
      return {
        searchState: pathToSearchState(props.router.asPath),
        lastRouter: props.router,
      };
    }

    return null;
  }

  onSearchStateChange = (searchState) => {
    clearTimeout(this.debouncedSetState);

    this.debouncedSetState = setTimeout(() => {
      const href = searchStateToURL(searchState);

      this.props.router.push(href, href, {
        shallow: true,
      });
    }, updateAfter);

    this.setState({ searchState });
  };

  render() {
    return (
      <InstantSearch
        {...DEFAULT_PROPS}
        searchState={this.state.searchState}
        resultsState={this.props.resultsState}
        createURL={createURL}
        onSearchStateChange={this.onSearchStateChange}
      />
    );
  }
}

export default withRouter(Home);
