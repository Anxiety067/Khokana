import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Filters from './components/Filters';
import Map from './components/Map';
import Statistics from './components/Statistics';
import About from './components/About'

function App() {
  const [activeSection, setActiveSection] = useState('MAP');
  const [vectorLayers, setVectorLayers] = useState({
    wardBoundary: false,
    roadNetwork: false,
    waterResources: false,
    parcelLayer: true,
    parcelLayer2019: false,
    buildingFootprint: false,
    historicalPlaces: false
  });

  const [selectedFilters, setSelectedFilters] = useState({
    cadastralMap: '',
    landCategory: ''
  });

  const [appliedFilters, setAppliedFilters] = useState({
    cadastralMap: '',
    landCategory: ''
  });

  const handleVectorLayerChange = (layerName) => {
    setVectorLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleFilterApply = () => {
    setAppliedFilters(selectedFilters);
  };

  const handleFilterClear = () => {
    setSelectedFilters({
      cadastralMap: '',
      landCategory: ''
    });
    setAppliedFilters({
      cadastralMap: '',
      landCategory: ''
    });
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="App">
      <div className="flex flex-col h-screen">
        <Navbar activeSection={activeSection} onSectionChange={handleSectionChange} />
        {activeSection === 'MAP' && (
          <>
            <Filters 
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onApply={handleFilterApply}
              onClear={handleFilterClear}
            />
            <div className="flex flex-1 overflow-hidden">
              <Map 
                wardBoundaryVisible={vectorLayers.wardBoundary}
                roadNetworkVisible={vectorLayers.roadNetwork}
                waterResourcesVisible={vectorLayers.waterResources}
                parcelLayerVisible={vectorLayers.parcelLayer}
                parcelLayer2019Visible={vectorLayers.parcelLayer2019}
                buildingFootprintVisible={vectorLayers.buildingFootprint}
                historicalPlacesVisible={vectorLayers.historicalPlaces}
                activeFilters={appliedFilters} 
              />
              <Statistics 
                vectorLayers={vectorLayers}
                onVectorLayerChange={handleVectorLayerChange}
              />
            </div>
          </>
        )}
        {activeSection === 'ABOUT' && <About />}
      </div>
    </div>
  );
}

export default App;