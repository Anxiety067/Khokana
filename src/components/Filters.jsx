import React from 'react';
import { Filter, X } from 'lucide-react';
import './Filters.css';

const Filters = ({ selectedFilters, onFilterChange, onApply, onClear }) => {
  return (
    <div className="filters-container">
      <div className="filters-wrapper">
        <select 
          className="filter-select"
          value={selectedFilters.communalPlace}
          onChange={(e) => onFilterChange('communalPlace', e.target.value)}
        >
          <option value="">SELECT COMMUNAL PLACES</option>
          <option value="art">Art</option>
          <option value="community_center">Community Center</option>
          <option value="museum">Museum</option>
          <option value="place_of_worship">Place of Worship</option>
        </select>
        
        <select 
          className="filter-select"
          value={selectedFilters.landCategory}
          onChange={(e) => onFilterChange('landCategory', e.target.value)}
        >
          <option value="">SELECT LAND CATEGORIES</option>
          <option value="government">Government</option>
          <option value="guthi">Guthi</option>
          <option value="non_newar">Non-Newar</option>
          <option value="mixed_non_newar">Mixed Non-Newar</option>
          <option value="newar">Newar</option>
          <option value="mixed_newar">Mixed Newar</option>
          <option value="institutional">Institutional</option>
          <option value="community">Community</option>
        </select>
        
        <button className="apply-button" onClick={onApply}>
          <Filter size={16} />
          <span>Apply</span>
        </button>
        <button className="clear-button" onClick={onClear}>
          <X size={16} />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};

export default Filters;