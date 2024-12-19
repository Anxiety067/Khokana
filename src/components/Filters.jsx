import React from 'react';
import { Filter, X } from 'lucide-react';
import './Filters.css';

const Filters = ({ selectedFilters, onFilterChange, onApply, onClear }) => {
  return (
    <div className="filters-container">
      <div className="filters-wrapper">
        <select 
          className="filter-select"
          value={selectedFilters.cadastralMap}
          onChange={(e) => onFilterChange('cadastralMap', e.target.value)}
        >
          <option value="">SELECT CADASTRAL MAP</option>
          <option value="khokana">Khokana</option>
          <option value="bungamati">Bungamati</option>
          <option value="sainbu">Sainbu</option>
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
          <option value="mixed_non_newar">Joint Non-Newar</option>
          <option value="newar">Newar</option>
          <option value="mixed_newar">Joint Newar</option>
          <option value="institutional">Institutional</option>
          <option value="community">Communal</option>
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