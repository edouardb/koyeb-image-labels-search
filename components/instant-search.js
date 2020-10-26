/** @format */

import PropTypes from "prop-types";
import React, { useState } from "react";
import Uppy from "components/uploader";
import {
  // RefinementList,
  connectRefinementList,
  connectSearchBox,
  connectInfiniteHits,
  Configure,
  InstantSearch,
} from "react-instantsearch-dom";

export const HitComponent = ({ hit, size }) => {
  console.log(hit);
  return (
    <div className="flex flex-col bg-white rounded p-4 items-center shadow-lg">
      <img
        className="h-64 w-full object-cover"
        src={hit?.imageUrl}
        alt={hit.display_name}
      />
      <div class="flex justify-between mt-2">
        {hit?.detectedLabels?.map((label, idx) => {
          if (idx < 2) {
            return (
              <div class="pill bg-gray-400 rounded-full text-xs px-4 py-1 mr-2">
                {label.Name}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

HitComponent.propTypes = {
  hit: PropTypes.object,
};

const Hits = ({ hits, hasMore, refineNext, ...props }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {hits.map((hit) => (
        <HitComponent key={`${hit.imageUrl}`} hit={hit} />
      ))}

      <div className="col-span-3">
        <button
          disabled={!hasMore}
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-full"
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
    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full px-3">
        <h2 className="font-black text-3xl">Search images</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={currentRefinement}
              type="text"
              onChange={(e) => refine(e.currentTarget.value)}
            />
          </div>
          <div className="col-span-1">
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-full"
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

const RefinementList = ({
  items,
  currentRefinement,
  refine,
  createURL,
  ...props
}) => {
  return items?.map((item) => (
    <label key={item.label} className="inline-flex items-center mt-3">
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
        <div className="container mx-auto m-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <CustomSearchBox />
            </div>
            <div className="col-span-auto">
              <div className="flex flex-col h-screen">
                <div className="flex flex-col">
                  <h2 className="font-black text-2xl">Labels</h2>
                  <CustomRefinementList
                    searchable
                    attribute="detectedLabels.Name"
                  />
                </div>
              </div>
            </div>
            <div className="row-span-1 col-span-3">
              <CustomHits minHitsPerPage={100} />
            </div>
          </div>
        </div>
      </InstantSearch>
    );
  }
}
