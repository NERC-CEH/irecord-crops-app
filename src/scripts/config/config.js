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
    url: 'https://www.brc.ac.uk/irecord/user/mobile/register',
    timeout: 30000
  },

  report: {
    url: 'http://www.brc.ac.uk/irecord/mobile/report',
    timeout: 80000
  },

  // mapping
  map: {
    API_KEY: '28994B5673A86451E0530C6CA40A91A5'
  },

  // morel configuration
  morel:{
    manager: {
      url: 'https://www.brc.ac.uk/irecord/mobile/submit',
      appname: 'irc',
      appsecret: 'irecordCrops!',
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
      location_source: { id: 760 },
      location_gridref: { id: 335 },

      device: {
        id: 273,
        values: {
          iOS: 2398,
          Android: 2399
        }
      },

      device_version: { id: 759 },

      date: {
        values: function (date) {
          return DateHelp.print(date);
        }
      },
    },
    occurrence: {
      taxon: {
        values: function (taxon) {
          return taxon.warehouse_id;
        }
      },
      blackgrass: {
        id: 567
      },
      season: {
        id: 106,
        values: {
          'default': 6325,
          'Spring': 6326,
          'Winter': 6327
        }
      }
    }
  }
};
