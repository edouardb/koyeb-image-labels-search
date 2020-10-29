/** @format */

import PropTypes from "prop-types";
import React, { useState } from "react";
import Uppy from "components/uploader";
import {
  connectRefinementList,
  connectSearchBox,
  connectInfiniteHits,
  Configure,
  InstantSearch,
} from "react-instantsearch-dom";

export const HitComponent = ({ hit }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        className="h-64 w-full object-cover"
        src={`/images/${hit?.key}`}
        alt={hit.display_name}
      />
      <div className="px-6 pt-4 pb-2">
        <h2 className="font-bold text-md mb-4">Detected labels</h2>
        {hit?.detectedLabels?.map((label) => (
          <span
            key={label.Name}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            {label.Name}
          </span>
        ))}
      </div>
    </div>
  );
};

HitComponent.propTypes = {
  hit: PropTypes.object,
};

const Hits = ({ hits, hasMore, refineNext }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {hits.map((hit) => (
        <HitComponent key={`${hit.imageUrl}`} hit={hit} />
      ))}

      <div className="col-span-2 md:col-span-3">
        <button
          disabled={!hasMore}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={refineNext}
        >
          Load more
        </button>
      </div>
    </div>
  );
};

const CustomHits = connectInfiniteHits(Hits);

const SearchBox = ({ currentRefinement, refine }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        <h2 className="font-black text-3xl mb-2">Search images</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={currentRefinement}
              type="text"
              onChange={(e) => refine(e.currentTarget.value)}
            />
          </div>
          <div className="col-span-auto">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
      <Uppy
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

const CustomSearchBox = connectSearchBox(SearchBox);

const RefinementList = ({ items, currentRefinement, refine }) => {
  return items?.map((item) => (
    <label key={item.label} className="inline-flex items-center my-2">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-gray-600"
        checked={currentRefinement?.includes(item.label)}
        onChange={(event) => {
          event.preventDefault();
          refine(item.value);
        }}
      />
      <span className="ml-2 text-gray-700">{item.label}</span>
    </label>
  ));
};

const CustomRefinementList = connectRefinementList(RefinementList);

export default class extends React.Component {
  static propTypes = {
    searchState: PropTypes.object,
    resultsState: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSearchStateChange: PropTypes.func,
    createURL: PropTypes.func,
    indexName: PropTypes.string,
    searchClient: PropTypes.object,
  };

  render() {
    return (
      <InstantSearch
        searchClient={this.props.searchClient}
        resultsState={this.props.resultsState}
        searchState={this.props.searchState}
        createURL={this.props.createURL}
        indexName={this.props.indexName}
        onSearchStateChange={this.props.onSearchStateChange}
        {...this.props}
      >
        <Configure hitsPerPage={100} />
        <div className="container mx-auto my-8 p-2">
          <div className="grid grid-cols-4">
            <div className="col-span-4">
              <CustomSearchBox />
            </div>
            <div className="col-span-auto">
              <div className="flex flex-col">
                <h2 className="font-black text-2xl">Labels</h2>
                <CustomRefinementList
                  searchable
                  attribute="detectedLabels.Name"
                />
              </div>
            </div>
            <div className="col-span-4 md:col-span-3">
              <CustomHits minHitsPerPage={100} />
            </div>
          </div>
        </div>
      </InstantSearch>
    );
  }
}
