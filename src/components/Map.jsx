import React, { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibre from "maplibre-gl";
import "./Map.css";

const SATELLITE_STYLE_URL =
  "https://api.maptiler.com/maps/hybrid/style.json?key=FX2ydQEN4qqjoeYQBh6L";
const GALLI_MAPS_STYLE_URL =
  "https://map-init.gallimap.com/styles/light/style.json?accessToken=4ce1a22b-3b8b-4eeb-ba2f-51cb7448f559";
const WARD_BOUNDARY_GEOJSON = "/merge_ward.json";
const ROAD_NETWORK_GEOJSON = "/Road.json";
const PARCEL_GEOJSON = "/Finally_connected-last.geojson";
const BUILDING_FOOTPRINT_GEOJSON = "/building_khokana.json";
const WATER_RESOURCES_GEOJSON = "/water.json";
const HISTORICAL_PLACES_GEOJSON = "/historical.geojson";
const KHOKANA_CONFIG = {
  tileUrl: "https://tiles.gallimap.com/public.khokana/{z}/{x}/{y}.pbf",
  sourceLayer: "public.khokana",
  center: [85.29322814941406, 27.641535758972168],
  bounds: [
    85.2823257446289,
    27.62953758239746,
    85.30413055419922,
    27.653533935546875,
  ],
  minZoom: 0,
  maxZoom: 22,
};
const SAINBU_CONFIG = {
  tileUrl: "https://tiles.gallimap.com/public.sainbu/{z}/{x}/{y}.pbf",
  sourceLayer: "public.sainbu",
  center: [85.30310440063477, 27.648791313171387],
  bounds: [
    85.29135131835938,
    27.631587982177734,
    85.31485748291016,
    27.66599464416504
  ],
  minZoom: 0,
  maxZoom: 22
};

const BUNGAMATI_CONFIG = {
  tileUrl: "https://tiles.gallimap.com/public.bungamati/{z}/{x}/{y}.pbf",
  sourceLayer: "public.bungamati",
  center: [85.30072021484375, 27.61996555328369],
  bounds: [
    85.2900161743164,
    27.60451889038086,
    85.3114242553711,
    27.635412216186523,
  ],
  minZoom: 0,
  maxZoom: 22,
};

// Custom Satellite Control Class
class SatelliteControl {
  constructor(isSatellite, onClick) {
    this._isSatellite = isSatellite;
    this._onClick = onClick;
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "satellite-toggle";
    button.style.width = "30px";
    button.style.height = "30px";
    button.style.padding = "5px";
    button.style.border = "none";
    button.style.background = "white";
    button.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = "/satellite.png";
    img.alt = "Satellite";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";

    button.appendChild(img);

    button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevents page reload
      this._onClick();
      this._isSatellite = !this._isSatellite;
      button.style.background = this._isSatellite ? "#ddd" : "white";
    });

    this._container.appendChild(button);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

const Map = ({
  wardBoundaryVisible,
  roadNetworkVisible,
  parcelLayerVisible,
  buildingFootprintVisible,
  waterResourcesVisible,
  historicalPlacesVisible,
  activeFilters,
}) => {
  const mapContainer = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isSatellite, setIsSatellite] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibre.Map({
      container: mapContainer.current,
      style: GALLI_MAPS_STYLE_URL,
      center: [85.302713, 27.633172],
      zoom: 12.2,
      attributionControl: false,
    });

    map.on("sourcedata", () => {
      const layersToHide = [
        "poi_z14",
        "poi_z15",
        "poi_z16",
        "poi_z17",
        "poi_z18",
        "poi_transit"
      ];

      layersToHide.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, "visibility", "none");
        }
      });

      // Add temple POI layer
      if (map.getStyle() && !map.getLayer('poi_temple')) {
        map.addLayer({
          "filter": [
            "all",
            ["==", "class", "place_of_worship"]
          ],
          "id": "poi_temple",
          "layout": {
            "icon-image": "{icon_type}",
            "icon-size": 0.7,
            "text-anchor": "top",
            "text-field": "{name}",
            "text-font": [
              "Roboto Condensed Italic"
            ],
            "text-offset": [0, 0.9],
            "text-size": 10,
            "text-transform": "uppercase",
            "visibility": "visible"
          },
          "minzoom": 14,
          "paint": {
            "text-halo-blur": 0.5,
            "text-halo-color": "#ffffff",
            "text-halo-width": 1
          },
          "source": "gallitiles",
          "source-layer": "poi",
          "type": "symbol"
        });
      }
    });

    const navControl = new maplibre.NavigationControl();
    map.addControl(navControl, "top-right");

    // Add custom satellite control
    const satelliteControl = new SatelliteControl(isSatellite, () => {
      setIsSatellite((prev) => !prev);
      map.setStyle(isSatellite ? SATELLITE_STYLE_URL : GALLI_MAPS_STYLE_URL);
    });
    map.addControl(satelliteControl, "top-right");

    // Add custom attribution control
    const customAttribution = document.createElement("div");
    customAttribution.className = "maplibre-custom-attribution";
    customAttribution.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.8);
      padding: 5px 10px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e0e0e0;
    `;

    customAttribution.innerHTML = `
  <div style="display: flex; align-items: center;">
    <span>Powered by</span>
    <img src="/galli_maps.jpg" alt="Galli Maps Logo" style="height: 22px; margin: 0 5px;" />
  </div>
  <div style="display: flex; align-items: center; justify-content: center; font-size: 0.9em; color: #555; margin: 5px 0;">
    Satellite Map tiles by MapTiler servers, under the usage policy
  </div>
  <div style="display: flex; align-items: center;">
    <span>Developed by</span>
    <img src="/cemsoj.jpg" alt="Cemsoj Logo" style="height: 22px; margin: 0 5px;" />
  </div>
`;

    mapContainer.current.appendChild(customAttribution);

    map.on("load", () => {
      setMapInstance(map);
    });

    return () => {
      if (map) {
        try {
          map.remove();
        } catch (error) {
          console.log("Error removing map:", error);
        }
      }
    };
  }, [isSatellite]);

  useEffect(() => {
    if (mapInstance) {
      mapInstance.setStyle(
        isSatellite ? SATELLITE_STYLE_URL : GALLI_MAPS_STYLE_URL
      );
    }
  }, [isSatellite, mapInstance]);
  
  // Watch for cadastral map filter changes
  useEffect(() => {
    // Guard clause - only proceed if mapInstance exists
    if (!mapInstance) return;
  
    const cadastralSourceId = "cadastralMapSource";
    const cadastralLayerId = "cadastralMapLayer";
  
    // Safe remove function with additional checks
    const safeRemoveCadastralLayers = () => {
      try {
        // Check if map instance still exists
        if (mapInstance && !mapInstance._removed) {
          // Check if layer exists before trying to remove it
          if (mapInstance.getStyle() && mapInstance.getLayer(cadastralLayerId)) {
            mapInstance.removeLayer(cadastralLayerId);
          }
          // Check if source exists before trying to remove it
          if (mapInstance.getStyle() && mapInstance.getSource(cadastralSourceId)) {
            mapInstance.removeSource(cadastralSourceId);
          }
        }
      } catch (error) {
        console.log("Safe removal of cadastral layers failed:", error);
      }
    };
  
    // Cleanup function to handle component unmounting
    const cleanup = () => {
      safeRemoveCadastralLayers();
    };
  
    // Add new layers based on selected cadastral map
    const addCadastralLayers = async () => {
      try {
        if (activeFilters.cadastralMap === "khokana") {
          // Check if map still exists before adding source and layer
          if (mapInstance && !mapInstance._removed) {
            if (!mapInstance.getSource(cadastralSourceId)) {
              mapInstance.addSource(cadastralSourceId, {
                type: "vector",
                tiles: [KHOKANA_CONFIG.tileUrl],
                bounds: KHOKANA_CONFIG.bounds,
                minzoom: KHOKANA_CONFIG.minZoom,
                maxzoom: KHOKANA_CONFIG.maxZoom,
              });
            }
  
            if (!mapInstance.getLayer(cadastralLayerId)) {
              mapInstance.addLayer({
                id: cadastralLayerId,
                type: "line",
                source: cadastralSourceId,
                'source-layer': KHOKANA_CONFIG.sourceLayer,
                paint: {
                  "line-color": "#000000",
                  "line-width": 1,
                },
              });
            }
  
            mapInstance.fitBounds(KHOKANA_CONFIG.bounds, {
              padding: 50,
              maxZoom: 16,
            });
          }
        } else if (activeFilters.cadastralMap === "sainbu") {
          // Check if map still exists before adding source and layer
          if (mapInstance && !mapInstance._removed) {
            if (!mapInstance.getSource(cadastralSourceId)) {
              mapInstance.addSource(cadastralSourceId, {
                type: "vector",
                tiles: [SAINBU_CONFIG.tileUrl],
                bounds: SAINBU_CONFIG.bounds,
                minzoom: SAINBU_CONFIG.minZoom,
                maxzoom: SAINBU_CONFIG.maxZoom
              });
            }
  
            if (!mapInstance.getLayer(cadastralLayerId)) {
              mapInstance.addLayer({
                id: cadastralLayerId,
                type: "line",
                source: cadastralSourceId,
                'source-layer': SAINBU_CONFIG.sourceLayer,
                paint: {
                  "line-color": "#000000",
                  "line-width": 1
                }
              });
            }
  
            mapInstance.fitBounds(SAINBU_CONFIG.bounds, {
              padding: 50,
              maxZoom: 16
            });
          }
        } else if (activeFilters.cadastralMap === "bungamati") {
          // Check if map still exists before adding source and layer
          if (mapInstance && !mapInstance._removed) {
            if (!mapInstance.getSource(cadastralSourceId)) {
              mapInstance.addSource(cadastralSourceId, {
                type: "vector",
                tiles: [BUNGAMATI_CONFIG.tileUrl],
                bounds: BUNGAMATI_CONFIG.bounds,
                minzoom: BUNGAMATI_CONFIG.minZoom,
                maxzoom: BUNGAMATI_CONFIG.maxZoom,
              });
            }
  
            if (!mapInstance.getLayer(cadastralLayerId)) {
              mapInstance.addLayer({
                id: cadastralLayerId,
                type: "line",
                source: cadastralSourceId,
                'source-layer': BUNGAMATI_CONFIG.sourceLayer,
                paint: {
                  "line-color": "#000000",
                  "line-width": 1,
                },
              });
            }
  
            mapInstance.fitBounds(BUNGAMATI_CONFIG.bounds, {
              padding: 50,
              maxZoom: 16,
            });
          }
        }
      } catch (error) {
        console.error("Error adding cadastral layers:", error);
      }
    };
  
    // Main execution
    cleanup();
    if (activeFilters.cadastralMap) {
      addCadastralLayers();
    }
  
    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [activeFilters.cadastralMap, mapInstance]);  

  // Watch for changes in ward boundary visibility
  useEffect(() => {
    if (!mapInstance) return;

    const safeRemoveLayers = () => {
      try {
        if (mapInstance.getLayer("wardBoundaryLayer")) {
          mapInstance.removeLayer("wardBoundaryLayer");
        }
        if (mapInstance.getSource("wardBoundary")) {
          mapInstance.removeSource("wardBoundary");
        }
      } catch (error) {
        console.log("Error removing ward boundary layers:", error);
      }
    };

    if (wardBoundaryVisible) {
      const fetchAndAddWardBoundary = async () => {
        try {
          const response = await fetch(WARD_BOUNDARY_GEOJSON);
          const data = await response.json();

          // Always remove existing layers before adding new ones
          safeRemoveLayers();

          mapInstance.addSource("wardBoundary", {
            type: "geojson",
            data: data,
          });

          mapInstance.addLayer({
            id: "wardBoundaryLayer",
            type: "line",
            source: "wardBoundary",
            layout: {},
            paint: {
              "line-color": "#ff0000",
              "line-width": 3,
            },
          });
        } catch (error) {
          console.log("Error fetching or adding ward boundary:", error);
        }
      };

      fetchAndAddWardBoundary();
    } else {
      safeRemoveLayers();
    }

    return () => {
      safeRemoveLayers();
    };
  }, [wardBoundaryVisible, mapInstance, isSatellite]);

  // Watch for changes in road network visibility
  useEffect(() => {
    if (!mapInstance) return;

    const safeRemoveRoadLayers = () => {
      try {
        if (mapInstance.getLayer("roadNetworkLayer")) {
          mapInstance.removeLayer("roadNetworkLayer");
        }
        if (mapInstance.getSource("roadNetwork")) {
          mapInstance.removeSource("roadNetwork");
        }
      } catch (error) {
        console.log("Error removing road network layers:", error);
      }
    };

    if (roadNetworkVisible) {
      const fetchAndAddRoadNetwork = async () => {
        try {
          const response = await fetch(ROAD_NETWORK_GEOJSON);
          const data = await response.json();

          // Always remove existing layers before adding new ones
          safeRemoveRoadLayers();

          mapInstance.addSource("roadNetwork", {
            type: "geojson",
            data: data,
          });

          mapInstance.addLayer({
            id: "roadNetworkLayer",
            type: "line",
            source: "roadNetwork",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#ff4f00",
              "line-width": [
                "match",
                ["get", "road_type"],
                "highway",
                4,
                "main_road",
                3,
                "secondary_road",
                2,
                1.5,
              ],
            },
          });
        } catch (error) {
          console.log("Error fetching or adding road network:", error);
        }
      };

      fetchAndAddRoadNetwork();
    } else {
      safeRemoveRoadLayers();
    }

    return () => {
      safeRemoveRoadLayers();
    };
  }, [roadNetworkVisible, mapInstance, isSatellite]);

  // New useEffect for parcel layer
  useEffect(() => {
    if (!mapInstance) return;

    const safeRemoveParcelLayers = () => {
      try {
        if (mapInstance.getLayer("parcelFillLayer")) {
          mapInstance.removeLayer("parcelFillLayer");
        }
        if (mapInstance.getLayer("parcelBorderLayer")) {
          mapInstance.removeLayer("parcelBorderLayer");
        }
        if (mapInstance.getSource("parcels")) {
          mapInstance.removeSource("parcels");
        }
      } catch (error) {
        console.log("Error removing parcel layers:", error);
      }
    };

    if (parcelLayerVisible) {
      try {
        if (!mapInstance.getSource("parcels")) {
          // Fetch GeoJSON data
          fetch(PARCEL_GEOJSON)
            .then(response => response.json())
            .then(data => {
              // If a land category is selected, filter the features
              let filteredData = { ...data };
              if (activeFilters.landCategory) {
                filteredData.features = data.features.filter(feature => {
                  // Map between filter values and GeoJSON property values
                  const landCategoryMap = {
                    'government': 'सरकारी',
                    'guthi': 'गुठी',
                    'non_newar': 'गैर–नेवाः',
                    'mixed_non_newar': 'गैर–नेवाः÷संयुक्त',
                    'newar': 'नेवाः',
                    'mixed_newar': 'नेवाः÷संयुक्त',
                    'institutional': 'संस्थागत',
                    'community': 'सामुदायिक'
                  };

                  const mappedCategory = landCategoryMap[activeFilters.landCategory];
                  return feature.properties['fasttract_connected_Final with connect — Sheet1_जग्गाधनी'] === mappedCategory;
                });
              }

              // Add source with potentially filtered data
              mapInstance.addSource("parcels", {
                type: "geojson",
                data: filteredData,
              });

              // Add fill layer for parcels
              mapInstance.addLayer({
                id: "parcelFillLayer",
                type: "fill",
                source: "parcels",
                paint: {
                  "fill-color": [
                    "match",
                    ["get", "fasttract_connected_Final with connect — Sheet1_जग्गाधनी"],
                    "गुठी",
                    "#ff0000", // Bright red for Guthi
                    "गैर–नेवाः",
                    "#0000ff", // Green for Non-Newar
                    "गैर–नेवाः÷संयुक्त",
                    "#87cefa", // Light green for Mixed Non-Newar
                    "नेवाः",
                    "#ffd700", // Blue for Newar
                    "नेवाः÷संयुक्त",
                    "#f0e68c", // Light blue for Mixed Newar
                    "संस्थागत",
                    "#9C27B0", // Purple for Institutional
                    "सरकारी",
                    "#32cd32", // Orange for Government
                    "सामुदायिक",
                    "#795548", // Brown for Community
                    "#9E9E9E", // Grey for any unmatched types
                  ],
                  "fill-opacity": 0.5,
                },
              });

              // Add border layer for parcels
              mapInstance.addLayer({
                id: "parcelBorderLayer",
                type: "line",
                source: "parcels",
                paint: {
                  "line-color": "#100c08",
                  "line-width": 0.5,
                },
              });

              // Re-add click interaction for filtered parcels
              mapInstance.on("click", "parcelFillLayer", (e) => {
                if (!e.features.length) return;

                const feature = e.features[0];
                const coordinates = e.lngLat;

                // Create popup content based on parcel properties
                const properties = feature.properties;
                const popupContent = `
                  <div>
                    <h3>Parcel Information</h3>
                    <p>जग्गाधनीको नाम: ${properties['fasttract_connected_Final with connect — Sheet1_जग्गाधनीको नाम'] || 'N/A'}</p>
                    <p>जग्गाधनीको बाबुको नाम: ${properties['fasttract_connected_Final with connect — Sheet1_जग्गाधनीको बाबुको नाम'] || 'N/A'}</p>
                    <p>जग्गाधनीको बाजेको नाम: ${properties['fasttract_connected_Final with connect — Sheet1_जग्गाधनीको बाजेको नाम'] || 'N/A'}</p>
                    <p>साविक ठेगाना / गा.वि.स.: ${properties['fasttract_connected_Final with connect — Sheet1_साविक ठेगाना÷ गा.वि.स.'] || 'N/A'}</p>
                    <p>वार्ड नं.: ${properties['fasttract_connected_Final with connect — Sheet1_वार्ड नं.'] || 'N/A'}</p>
                    <p>सिट नं.: ${properties['fasttract_connected_Final with connect — Sheet1_सिट नं.'] || 'N/A'}</p>
                    <p>कित्ता नं.: ${properties['fasttract_connected_Final with connect — Sheet1_कित्ता नं.'] || 'N/A'}</p>
                    <p>श्रेस्ता अनुसारको क्षेत्रफल ब.मि.: ${properties['fasttract_connected_Final with connect — Sheet1_ब.मि.'] || 'N/A'}</p>
                    <p>श्रेस्ता अनुसारको क्षेत्रफल रो: ${properties['fasttract_connected_Final with connect — Sheet1_श्रेस्ता अनुसारको क्षेत्रफल११रो'] || 'N/A'}</p>
                    <p>श्रेस्ता अनुसारको क्षेत्रफल आ: ${properties['fasttract_connected_Final with connect — Sheet1_श्रेस्ता अनुसारको क्षेत्रफले१२आ'] || 'N/A'}</p>
                    <p>श्रेस्ता अनुसारको क्षेत्रफल पै: ${properties['fasttract_connected_Final with connect — Sheet1_श्रेस्ता अनुसारको क्षेत्रफलेपै'] || 'N/A'}</p>
                    <p>श्रेस्ता अनुसारको क्षेत्रफल दा: ${properties['fasttract_connected_Final with connect — Sheet1_श्रेस्ता अनुसारको क्षेत्रफले१३दा'] || 'N/A'}</p>
                    <p>अधिग्रहण गरिने क्षेत्रफल ब.मि.: ${properties['fasttract_connected_Final with connect — Sheet1_ब.मि._1'] || 'N/A'}</p>
                    <p>अधिग्रहण गरिने क्षेत्रफल रो: ${properties['fasttract_connected_Final with connect — Sheet1_अधिग्रहम गरिने क्षेत्रफल१६रो'] || 'N/A'}</p>
                    <p>अधिग्रहणअधिग्रहम गरिने क्षेत्रफल आ: ${properties['fasttract_connected_Final with connect — Sheet1_अधिग्रहम गरिने क्षेत्रफल१७आ'] || 'N/A'}</p>
                    <p>अधिग्रहण गरिने क्षेत्रफल पै: ${properties['fasttract_connected_Final with connect — Sheet1_अधिग्रहम गरिने क्षेत्रफलपै'] || 'N/A'}</p>
                    <p>अधिग्रहण गरिने क्षेत्रफल दा: ${properties['fasttract_connected_Final with connect — Sheet1_अधिग्रहम गरिने क्षेत्रफल१८।००दा'] || 'N/A'}</p>
                    <p>कैफियत: ${properties['fasttract_connected_Final with connect — Sheet1_कैफियत'] || 'N/A'}</p>
                    <p>जग्गाधनी: ${properties['fasttract_connected_Final with connect — Sheet1_जग्गाधनी'] || 'N/A'}</p>
                    <p>Land Acquisition Notice: ${properties['Copy of Final_with_connect — Sheet1_Land acquisition notice'] || 'N/A'}</p>
                  </div>
                `;

                new maplibre.Popup()
                  .setLngLat(coordinates)
                  .setHTML(popupContent)
                  .addTo(mapInstance);
              });

              // Change cursor on hover
              mapInstance.on("mouseenter", "parcelFillLayer", () => {
                mapInstance.getCanvas().style.cursor = "pointer";
              });

              mapInstance.on("mouseleave", "parcelFillLayer", () => {
                mapInstance.getCanvas().style.cursor = "";
              });
            })
            .catch(error => {
              console.log("Error fetching or processing parcel data:", error);
            });
        }
      } catch (error) {
        console.log("Error adding parcel layers:", error);
      }
    } else {
      safeRemoveParcelLayers();
    }

    return () => {
      safeRemoveParcelLayers();
    };
  }, [parcelLayerVisible, mapInstance, activeFilters.landCategory]);

  // Watch for changes in building footprint visibility
  useEffect(() => {
    if (!mapInstance) return;

    const safeRemoveBuildingLayers = () => {
      try {
        if (mapInstance.getLayer("buildingFootprintFill")) {
          mapInstance.removeLayer("buildingFootprintFill");
        }
        if (mapInstance.getLayer("buildingFootprintOutline")) {
          mapInstance.removeLayer("buildingFootprintOutline");
        }
        if (mapInstance.getSource("buildingFootprint")) {
          mapInstance.removeSource("buildingFootprint");
        }
      } catch (error) {
        console.log("Error removing building footprint layers:", error);
      }
    };

    if (buildingFootprintVisible) {
      const fetchAndAddBuildingFootprint = async () => {
        try {
          const response = await fetch(BUILDING_FOOTPRINT_GEOJSON);
          const data = await response.json();

          // Always remove existing layers before adding new ones
          safeRemoveBuildingLayers();

          mapInstance.addSource("buildingFootprint", {
            type: "geojson",
            data: data,
          });

          mapInstance.addLayer({
            id: "buildingFootprintFill",
            type: "fill",
            source: "buildingFootprint",
            paint: {
              "fill-color": "#8a2be2",
              "fill-opacity": 0.5,
            },
          });

          mapInstance.addLayer({
            id: "buildingFootprintOutline",
            type: "line",
            source: "buildingFootprint",
            paint: {
              "line-color": "#4a148c",
              "line-width": 1,
            },
          });
        } catch (error) {
          console.log("Error fetching or adding building footprint:", error);
        }
      };

      fetchAndAddBuildingFootprint();
    } else {
      safeRemoveBuildingLayers();
    }

    return () => {
      safeRemoveBuildingLayers();
    };
  }, [buildingFootprintVisible, mapInstance, isSatellite]);

  // Watch for changes in water resources visibility
  useEffect(() => {
    if (!mapInstance) return;

    const safeRemoveWaterLayers = () => {
      try {
        if (mapInstance.getLayer("waterResourcesFill")) {
          mapInstance.removeLayer("waterResourcesFill");
        }
        if (mapInstance.getLayer("waterResourcesOutline")) {
          mapInstance.removeLayer("waterResourcesOutline");
        }
        if (mapInstance.getSource("waterResources")) {
          mapInstance.removeSource("waterResources");
        }
      } catch (error) {
        console.log("Error removing water resources layers:", error);
      }
    };

    if (waterResourcesVisible) {
      const fetchAndAddWaterResources = async () => {
        try {
          const response = await fetch(WATER_RESOURCES_GEOJSON);
          const data = await response.json();

          // Always remove existing layers before adding new ones
          safeRemoveWaterLayers();

          mapInstance.addSource("waterResources", {
            type: "geojson",
            data: data,
          });

          mapInstance.addLayer({
            id: "waterResourcesFill",
            type: "fill",
            source: "waterResources",
            filter: ["==", ["geometry-type"], "Polygon"],
            paint: {
              "fill-color": "#4FC3F7",
              "fill-opacity": 0.7,
            },
          });

          mapInstance.addLayer({
            id: "waterResourcesOutline",
            type: "line",
            source: "waterResources",
            filter: ["==", ["geometry-type"], "Polygon"],
            paint: {
              "line-color": "#0288D1",
              "line-width": 1,
            },
          });
        } catch (error) {
          console.log("Error fetching or adding water resources:", error);
        }
      };

      fetchAndAddWaterResources();
    } else {
      safeRemoveWaterLayers();
    }

    return () => {
      safeRemoveWaterLayers();
    };
  }, [waterResourcesVisible, mapInstance, isSatellite]);

  // Watch for changes in historical places visibility
  useEffect(() => {
    if (!mapInstance) return;
  
    const safeRemoveHistoricalPlacesLayers = () => {
      try {
        if (mapInstance.getLayer("historicalPlacesSymbol")) {
          mapInstance.removeLayer("historicalPlacesSymbol");
        }
        if (mapInstance.getLayer("historicalPlacesLabels")) {
          mapInstance.removeLayer("historicalPlacesLabels");
        }
        if (mapInstance.getSource("historicalPlaces")) {
          mapInstance.removeSource("historicalPlaces");
        }
      } catch (error) {
        console.log("Error removing historical places layers:", error);
      }
    };
  
    if (historicalPlacesVisible) {
      // Attempt to fetch and add the historical places layer
      const fetchHistoricalPlaces = async () => {
        try {
          const response = await fetch(HISTORICAL_PLACES_GEOJSON);
          const data = await response.json();
          console.log("Historical Places Data:", data); // Log the data to verify
  
          // Check if the source has already been added
          if (!mapInstance.getSource("historicalPlaces")) {
            mapInstance.addSource("historicalPlaces", {
              type: "geojson",
              data: data,
            });
  
            // Add circle layer for historical places
            mapInstance.addLayer({
              id: "historicalPlacesSymbol",
              type: "circle",
              source: "historicalPlaces",
              paint: {
                "circle-radius": 6,
                "circle-color": "#FF6B6B", // Soft red color
                "circle-stroke-width": 2,
                "circle-stroke-color": "#D32F2F" // Darker red outline
              },
              layout: {
                "visibility": "visible"
              }
            });
  
            // Add text labels for historical places
            mapInstance.addLayer({
              id: "historicalPlacesLabels",
              type: "symbol",
              source: "historicalPlaces",
              layout: {
                "text-field": ["get", "name"],
                "text-font": ["Open Sans Regular"],
                "text-offset": [0, 1.25],
                "text-anchor": "top",
                "text-size": 12,
                "text-allow-overlap": false
              },
              paint: {
                "text-color": "#000000",
                "text-halo-color": "#FFFFFF",
                "text-halo-width": 2
              }
            });
  
            // Add click interaction for historical places
            mapInstance.on("click", "historicalPlacesSymbol", (e) => {
              if (!e.features.length) return;
  
              const feature = e.features[0];
              const coordinates = e.lngLat;
  
              // Create popup content based on historical place properties
              const properties = feature.properties;
              const popupContent = `
                <div>
                  <h3>Historical Place Information</h3>
                  <p>Name: ${properties.Name || 'N/A'}</p>
                  <p>Description: ${properties.description || 'N/A'}</p>
                </div>
              `;
  
              new maplibre.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(mapInstance);
            });
  
            // Change cursor on hover
            mapInstance.on("mouseenter", "historicalPlacesSymbol", () => {
              mapInstance.getCanvas().style.cursor = "pointer";
            });
  
            mapInstance.on("mouseleave", "historicalPlacesSymbol", () => {
              mapInstance.getCanvas().style.cursor = "";
            });
  
            // If data is empty or no points, log a warning
            if (!data.features || data.features.length === 0) {
              console.warn("No historical places found in the GeoJSON file");
            }
          } else {
            // If the source already exists, update its data
            mapInstance.getSource("historicalPlaces").setData(data);
          }
        } catch (error) {
          console.error("Error fetching historical places data:", error);
        }
      };
  
      fetchHistoricalPlaces();
    } else {
      safeRemoveHistoricalPlacesLayers();
    }
  
    return () => {
      safeRemoveHistoricalPlacesLayers();
    };
  }, [historicalPlacesVisible, mapInstance]);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map"></div>
    </div>
  );
};

export default Map;