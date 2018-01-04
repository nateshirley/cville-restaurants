import React, { Component } from 'react';
import L from 'leaflet';
// postCSS import of Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import Sidebar from './Sidebar';


// store the map configuration properties in an object,
let config = {};

config.params = {
  center: [38.0341,-78.4994],
  zoomControl: false,
  zoom: 13,
  maxZoom: 18,
  minZoom: 11,
  scrollwheel: false,
  legends: true,
  infoControl: false,
  attributionControl: true
};
config.tileLayer = {
  uri: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  params: {
    minZoom: 11,
    attribution: 'Rike Moss Custom Designs',
    id: '',
    accessToken: ''
  }
};

let restaurantNames = [];
let namePlus = [];


class Map extends Component 
{
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      tileLayer: null,
      geojsonLayer: null,
      geojson: null,
      target: null
    };
    this._mapNode = null;
    this.onEachFeature = this.onEachFeature.bind(this);
    this.pointToLayer = this.pointToLayer.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.zoomToRest = this.zoomToRest.bind(this);
  }

  

  componentDidMount() 
  {

    axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.0341,-78.499&radius=1000&types=restaurant&opennow&key=AIzaSyA4-wFo31cK9vkbOJadn6cq5aqMFXnpn84')
    .then(response => {
        const results = response.data.results;
    
        let fingeo = 
        {
            type: "FeatureCollection",
            features: []
        };
        var i = 0;
        
        for (i; i < results.length; i++) 
        {
            fingeo.features.push({
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [results[i].geometry.location.lng, results[i].geometry.location.lat]
                },
                "properties": 
                {
                    "name": results[i].name,
                    "rating": results[i].rating,
                    "price_level": results[i].price_level,
                    "address": results[i].vicinity
    
                }
            });
        }
        this.setState(
          {
          geojson: fingeo
          });
      }) 
      .catch(error => {
        console.log('the data was not fetched and parsed', error)
      });

    // create the Leaflet map object
    if (!this.state.map) this.init(this._mapNode);
  }

  updateMap(e) 
  {
    let name = e.target.value;
    let zooming = []
    var i = 0;
    // console.log(namePlus);
    for(i; i < namePlus.length; i++)
    {
      if(name === namePlus[i].name)
      {
        zooming.push(namePlus[i].coordinates);
        zooming.push(namePlus[i].coordinates);
      }
    }
    this.setState({
      target: zooming
    });
  }

  componentDidUpdate(prevProps, prevState) 
  {
    // code to run when the component receives new props or state
    // check to see if geojson is stored, map is created, and geojson overlay needs to be added
    if (this.state.geojson && this.state.map && !this.state.geojsonLayer) 
    {
      // add the geojson overlay
      this.addGeoJSONLayer(this.state.geojson);
    }

    if (this.state.target !== prevState.target) 
    {
      // filter / re-render the geojson overlay
      this.zoomToRest();
    }
  }

  addGeoJSONLayer(geojson) 
  {
    // an options object is passed to define functions for customizing the layer
    const geojsonLayer = L.geoJson(geojson, {
      onEachFeature: this.onEachFeature,
      pointToLayer: this.pointToLayer
    });

    // add our GeoJSON layer to the Leaflet map object
    geojsonLayer.addTo(this.state.map);
    // store the Leaflet GeoJSON layer in our component state for use later
    this.setState({ geojsonLayer });
    // fit the geographic extent of the GeoJSON layer within the map's bounds / viewport
    this.zoomToFeature(geojsonLayer);
  }

  zoomToRest(target) 
  {
    this.state.map.fitBounds(this.state.target);
    console.log(this.state.target);
  }

  zoomToFeature(target) 
  {
    // pad fitBounds() so features aren't hidden under the sidebar
    var fitBoundsParams = {
      paddingTopLeft: [200,10],
      paddingBottomRight: [10,10]
    };
    // set the map's center & zoom so that it fits the geographic extent of the layer
    this.state.map.fitBounds(target.getBounds(), fitBoundsParams);
  }

  pointToLayer(feature, latlng) 
  {
    // renders our GeoJSON points as circle markers, rather than Leaflet's default image markers
    // parameters to style the GeoJSON markers
    var markerParams = {
      radius: 7,
      fillColor: 'navy',
      color: '#fff',
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.8
    };

    return L.circleMarker(latlng, markerParams);
  }

  onEachFeature(feature, layer) 
  {
    if (feature.properties && feature.properties.name && feature.properties.rating 
      && feature.properties.address && feature.properties.price_level) 
    {
      let coords = [];
      coords.push((feature.geometry.coordinates[1]));
      coords.push((feature.geometry.coordinates[0]));
      restaurantNames.push(feature.properties.name + " (" + feature.properties.rating + ")");
      namePlus.push({"name": feature.properties.name + " (" + feature.properties.rating + ")", "coordinates": coords});
      // assemble the HTML for the markers' popups (Leaflet's bindPopup method doesn't accept React JSX)
      const popupContent = `<h3>${feature.properties.name}</h3>
        <strong>Customer Rating: </strong>${feature.properties.rating} -
        <strong>Address: </strong>${feature.properties.address} -
        <strong>Price Level: </strong>${feature.properties.price_level}`;

        layer.bindPopup(popupContent);
        restaurantNames.sort();

    }

    else if (feature.properties && feature.properties.name && feature.properties.rating) 
    {

      let coords = [];
      coords.push((feature.geometry.coordinates[1]));
      coords.push((feature.geometry.coordinates[0]));

      restaurantNames.push(feature.properties.name + " (" + feature.properties.rating + ")");
      namePlus.push({"name": feature.properties.name + " (" + feature.properties.rating + ")", "coordinates": coords});
      // assemble the HTML for the markers' popups 
      const popupContent = `<h3>${feature.properties.name}</h3>
        <strong>Customer Rating: </strong>${feature.properties.rating} -
        <strong>Address: </strong>${feature.properties.address}`;

      // add our popups
      layer.bindPopup(popupContent);
      restaurantNames.sort();
    }
  }

  init(id) 
  {
    if (this.state.map) return;
    // this function creates the Leaflet map object and is called after the Map component mounts
    let map = L.map(id, config.params);
    L.control.zoom({ position: "bottomleft"}).addTo(map);
    L.control.scale({ position: "bottomleft"}).addTo(map);

    // a TileLayer is used as the "basemap"
    const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);

    // set our state to include the tile layer
    this.setState({ map, tileLayer }); 
  }

  render() 
  {
    return (
      <div id="mapUI">
        <Sidebar names={restaurantNames}
        highlight={this.updateMap}
        />
        <div ref={(node) => this._mapNode = node} id="map" />
      </div>
    );
  }
}

export default Map;
