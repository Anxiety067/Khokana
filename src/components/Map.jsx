import React, { useEffect, useRef, useState, useCallback } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibre from "maplibre-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArtstation } from "@fortawesome/free-brands-svg-icons";
import "./Map.css";

const SATELLITE_STYLE_URL =
  "https://api.maptiler.com/maps/hybrid/style.json?key=FX2ydQEN4qqjoeYQBh6L";
const GALLI_MAPS_STYLE_URL =
  "https://map-init.gallimap.com/styles/light/style.json?accessToken=4ce1a22b-3b8b-4eeb-ba2f-51cb7448f559";
const WARD_BOUNDARY_GEOJSON = "/merge_ward.json";
const ROAD_NETWORK_GEOJSON = "/Road.json";
const PARCEL_GEOJSON = "/connecte_joine.geojson";
const BUILDING_FOOTPRINT_GEOJSON = "/building_khokana.json";
const WATER_RESOURCES_GEOJSON = "/water.json";

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
  activeFilters,
}) => {
  const mapContainer = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const markersRef = useRef([]);
  const [isSatellite, setIsSatellite] = useState(false);

  // Memoized clearMarkers function
  const clearMarkers = useCallback(() => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        if (marker && marker.remove) {
          marker.remove();
        }
      });
      markersRef.current = [];
    }
  }, []);

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
        "poi_transit",
      ];

      layersToHide.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          // Check if the layer exists
          map.setLayoutProperty(layerId, "visibility", "none"); // Hide the layer
        }
      });
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
      clearMarkers();
      if (map) {
        try {
          map.remove();
        } catch (error) {
          console.log("Error removing map:", error);
        }
      }
    };
  }, [clearMarkers, isSatellite]);

  useEffect(() => {
    if (mapInstance) {
      mapInstance.setStyle(
        isSatellite ? SATELLITE_STYLE_URL : GALLI_MAPS_STYLE_URL
      );
    }
  }, [isSatellite, mapInstance]);

  // Handle communal places with improved performance
  useEffect(() => {
    if (!mapInstance) return;

    const addMarkers = (data, options) => {
      // Clear existing markers before adding new ones
      clearMarkers();

      const newMarkers = data.features.map((feature) => {
        const coordinates = feature.geometry.coordinates;
        const properties = feature.properties;

        const markerElement = document.createElement("div");
        markerElement.className = `custom-marker ${options.markerClass}`;

        if (options.icon === "art") {
          markerElement.innerHTML = `<i class="fab fa-artstation" style="color: #FFA500; font-size: 20px;"></i>`;
        } else if (options.icon === "community") {
          markerElement.innerHTML = `<i class="fas fa-people-arrows" style="color: #4CAF50; font-size: 20px;"></i>`;
        } else if (options.icon === "museum") {
          markerElement.innerHTML = `<i class="fas fa-museum" style="color: #9c27b0; font-size: 20px;"></i>`;
        } else if (options.icon === "place_of_worship") {
          markerElement.innerHTML = `<i class="fas fa-church" style="color: #8b4513; font-size: 20px;"></i>`;
        }

        // Create marker with popup
        const marker = new maplibre.Marker({
          element: markerElement,
          anchor: "bottom",
        })
          .setLngLat(coordinates)
          .setPopup(
            new maplibre.Popup({ offset: 25 }).setHTML(`
              <div class="custom-popup">
                <h3>${properties.name || options.defaultName}</h3>
                <p>${properties.description || ""}</p>
                <p>Type: ${properties.type || options.type}</p>
              </div>
            `)
          );

        marker.addTo(mapInstance);
        return marker;
      });

      markersRef.current = newMarkers;
    };

    const fetchData = async () => {
      if (!activeFilters.communalPlace) {
        clearMarkers();
        return;
      }

      try {
        let response;
        let options = {};

        switch (activeFilters.communalPlace) {
          case "art":
            response = await fetch("/art_places.json");
            options = {
              markerClass: "art-marker",
              icon: "art",
              defaultName: "Art Place",
              type: "Art",
            };
            break;
          case "community_center":
            response = await fetch("/community_centers.json");
            options = {
              markerClass: "community-center-marker",
              icon: "community",
              defaultName: "Community Center",
              type: "Community Center",
            };
            break;
          case "museum":
            response = await fetch("/museum.json");
            options = {
              markerClass: "museum-marker",
              icon: "museum",
              defaultName: "Museum",
              type: "Museum",
            };
            break;
          case "place_of_worship":
            response = await fetch("/place_of_worship.json");
            options = {
              markerClass: "place-of-worship-marker",
              icon: "place_of_worship",
              defaultName: "Place of Worship",
              type: "Place of Worship",
            };
            break;
          default:
            clearMarkers();
            return;
        }

        const data = await response.json();
        addMarkers(data, options);
      } catch (error) {
        console.log("Error fetching communal places:", error);
        clearMarkers();
      }
    };

    fetchData();

    return () => {
      clearMarkers();
    };
  }, [activeFilters.communalPlace, mapInstance, clearMarkers]);

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
      try {
        if (!mapInstance.getSource("wardBoundary")) {
          mapInstance.addSource("wardBoundary", {
            type: "geojson",
            data: WARD_BOUNDARY_GEOJSON,
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
        }
      } catch (error) {
        console.log("Error adding ward boundary layers:", error);
      }
    } else {
      safeRemoveLayers();
    }

    return () => {
      safeRemoveLayers();
    };
  }, [wardBoundaryVisible, mapInstance]);

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
      try {
        if (!mapInstance.getSource("roadNetwork")) {
          mapInstance.addSource("roadNetwork", {
            type: "geojson",
            data: ROAD_NETWORK_GEOJSON,
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
                1.5, // default width for other road types
              ],
            },
          });
        }
      } catch (error) {
        console.log("Error adding road network layers:", error);
      }
    } else {
      safeRemoveRoadLayers();
    }

    return () => {
      safeRemoveRoadLayers();
    };
  }, [roadNetworkVisible, mapInstance]);

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
                  return feature.properties['dddd — Sheet1_जग्गाधनी'] === mappedCategory;
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
                    ["get", "dddd — Sheet1_जग्गाधनी"],
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
                    <p>जग्गाधनीको नाम: ${properties['dddd — Sheet1_जग्गाधनीको नाम'] || 'N/A'}</p>
                    <p>जग्गाधनीको बाबुको नाम: ${properties['dddd — Sheet1_जग्गाधनीको बाबुको नाम'] || 'N/A'}</p>
                    <p>जग्गाधनीको बाजेको नाम: ${properties['dddd — Sheet1_जग्गाधनीको बाजेको नाम'] || 'N/A'}</p>
                    <p>साविक ठेगाना÷ गा.वि.स.: ${properties['dddd — Sheet1_साविक ठेगाना÷ गा.वि.स.'] || 'N/A'}</p>
                    <p>वार्ड नं.: ${properties['dddd — Sheet1_वार्ड नं.'] || 'N/A'}</p>
                    <p>सिट नं.: ${properties['dddd — Sheet1_सिट नं.'] || 'N/A'}</p>
                    <p>कित्ता नं.: ${properties['dddd — Sheet1_कित्ता नं.'] || 'N/A'}</p>
                    <p>श्रेस्ता अनुसारको क्षेत्रफल रो: ${properties['dddd — Sheet1_श्रेस्ता अनुसारको क्षेत्रफल११रो'] || 'N/A'}</p>
                    <p>श्रेस्ता अनुसारको क्षेत्रफल आ: ${properties['dddd — Sheet1_श्रेस्ता अनुसारको क्षेत्रफले१२आ'] || 'N/A'}</p>
                    <p>श्रेस्ता अनुसारको क्षेत्रफल पै: ${properties['dddd — Sheet1_श्रेस्ता अनुसारको क्षेत्रफलेपै'] || 'N/A'}</p>
                    <p>श्रेस्ता अनुसारको क्षेत्रफल दा: ${properties['dddd — Sheet1_श्रेस्ता अनुसारको क्षेत्रफले१३दा'] || 'N/A'}</p>
                    <p>अधिग्रहम गरिने क्षेत्रफल रो: ${properties['dddd — Sheet1_अधिग्रहम गरिने क्षेत्रफल१६रो'] || 'N/A'}</p>
                    <p>अधिग्रहम गरिने क्षेत्रफल आ: ${properties['dddd — Sheet1_अधिग्रहम गरिने क्षेत्रफल१७आ'] || 'N/A'}</p>
                    <p>अधिग्रहम गरिने क्षेत्रफल पै: ${properties['dddd — Sheet1_अधिग्रहम गरिने क्षेत्रफलपै'] || 'N/A'}</p>
                    <p>अधिग्रहम गरिने क्षेत्रफल दा: ${properties['dddd — Sheet1_अधिग्रहम गरिने क्षेत्रफल१८।००दा'] || 'N/A'}</p>
                    <p>कैफियत: ${properties['dddd — Sheet1_कैफियत'] || 'N/A'}</p>
                    <p>जग्गाधनी: ${properties['dddd — Sheet1_जग्गाधनी'] || 'N/A'}</p>
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

  // Add new useEffect for building footprint layer
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
      try {
        if (!mapInstance.getSource("buildingFootprint")) {
          mapInstance.addSource("buildingFootprint", {
            type: "geojson",
            data: BUILDING_FOOTPRINT_GEOJSON,
          });

          // Add fill layer for buildings
          mapInstance.addLayer({
            id: "buildingFootprintFill",
            type: "fill",
            source: "buildingFootprint",
            paint: {
              "fill-color": "#8a2be2", // Purple color for buildings
              "fill-opacity": 0.5,
            },
          });

          // Add outline layer for buildings
          mapInstance.addLayer({
            id: "buildingFootprintOutline",
            type: "line",
            source: "buildingFootprint",
            paint: {
              "line-color": "#4a148c", // Darker purple for outline
              "line-width": 1,
            },
          });
        }
      } catch (error) {
        console.log("Error adding building footprint layers:", error);
      }
    } else {
      safeRemoveBuildingLayers();
    }

    return () => {
      safeRemoveBuildingLayers();
    };
  }, [buildingFootprintVisible, mapInstance]);

  // Add new useEffect for water resources layer
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
        if (mapInstance.getLayer("waterResourcesSymbol")) {
          mapInstance.removeLayer("waterResourcesSymbol");
        }
        if (mapInstance.getSource("waterResources")) {
          mapInstance.removeSource("waterResources");
        }
      } catch (error) {
        console.log("Error removing water resources layers:", error);
      }
    };

    if (waterResourcesVisible) {
      try {
        if (!mapInstance.getSource("waterResources")) {
          mapInstance.addSource("waterResources", {
            type: "geojson",
            data: WATER_RESOURCES_GEOJSON,
          });

          // Add fill layer for water bodies (polygons)
          mapInstance.addLayer({
            id: "waterResourcesFill",
            type: "fill",
            source: "waterResources",
            filter: ["==", ["geometry-type"], "Polygon"],
            paint: {
              "fill-color": "#4FC3F7", // Light blue color for water
              "fill-opacity": 0.7,
            },
          });

          // Add outline layer for water bodies
          mapInstance.addLayer({
            id: "waterResourcesOutline",
            type: "line",
            source: "waterResources",
            filter: ["==", ["geometry-type"], "Polygon"],
            paint: {
              "line-color": "#0288D1", // Darker blue for outline
              "line-width": 1,
            },
          });
        }
      } catch (error) {
        console.log("Error adding water resources layers:", error);
      }
    } else {
      safeRemoveWaterLayers();
    }

    return () => {
      safeRemoveWaterLayers();
    };
  }, [waterResourcesVisible, mapInstance]);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map"></div>
      <FontAwesomeIcon icon={faArtstation} />
    </div>
  );
};

export default Map;
