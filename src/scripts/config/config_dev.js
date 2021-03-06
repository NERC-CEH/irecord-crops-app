/** ****************************************************************************
 * Main app configuration file.
 *****************************************************************************/
import LocHelp from './helpers/location';
import DateHelp from './helpers/date';

export default {
  version: '{APP_VER}', // replaced on build
  build: '{APP_BUILD}', // replaced on build
  name: '{APP_NAME}', // replaced on build

  gps_accuracy_limit: 100,

  // logging
  log: {
    states: ['e', 'w', 'i', 'd'], // see log helper
    ga_error: true
  },

  // google analytics
  ga: {
    status: true,
    ID: 'UA-58378803-6',
  },

  login: {
    url: 'http://192.171.199.230/irecord7/user/mobile/register',
    timeout: 80000
  },

  report: {
    url: 'http://192.171.199.230/irecord7/mobile/report',
    timeout: 80000
  },

  // mapping
  map: {
    os_api_key: '28994B5673A86451E0530C6CA40A91A5',
    mapbox_api_key: 'pk.eyJ1IjoiY2VoYXBwcyIsImEiOiJjaXBxdTZyOWYwMDZoaWVuYjI3Y3Z0a2x5In0.YXrZA_DgWCdjyE0vnTCrmw',
    mapbox_osm_id: 'cehapps.0fenl1fe',
    mapbox_satellite_id: 'cehapps.0femh3mh',
  },

  // morel configuration
  morel:{
    manager: {
      url: 'http://192.171.199.230/irecord7/mobile/submit',
      appname: 'test',
      appsecret: 'mytest',
      website_id: 23,
      survey_id: 411,
      input_form: 'enter-app-record'
    },
    sample: {
      location: {
        values: function (location, options) {
          // convert accuracy for map and gridref sources
          let accuracy = location.accuracy;
          if (location.source !== 'gps') {
            if (location.source === 'map') {
              accuracy = LocHelp.mapZoom2meters(location.accuracy);
            } else {
              accuracy = null;
            }
          }

          let attributes = {
            location_name: location.name,
            location_source: location.source,
            location_gridref: location.gridref,
            location_altitude: location.altitude,
            location_altitude_accuracy: location.altitudeAccuracy,
            location_accuracy: accuracy
          };

          // add other location related attributes
          options.flattener(attributes, options);

          return location.latitude + ', ' + location.longitude;
        }
      },
      location_accuracy: { id: 282 },
      location_altitude: { id: 283 },
      location_altitude_accuracy: { id: 284 },
      location_source: { id: 578 },
      location_gridref: { id: 335 },

      device: {
        id: 273,
        values: {
          iOS: 2398,
          Android: 2399
        }
      },

      device_version: { id: 579 },

      date: {
        values: function (date) {
          return DateHelp.print(date);
        }
      },
    },
    occurrence: {
      taxon: {
        values: function (taxon) {
          return taxon.warehouse_dev_id;
        }
      },
      blackgrass: {
        id: 407
      },
      season: {
        id: 406,
        values: {
          'default': 4914,
          'Spring': 4915,
          'Winter': 4916
        }
      }
    }
  }
};
