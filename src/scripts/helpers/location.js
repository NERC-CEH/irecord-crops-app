/** ****************************************************************************
 * Some location transformation logic.
 *****************************************************************************/
import LatLon from '../../vendor/latlon/js/latlon-ellipsoidal';
import OsGridRef from '../../vendor/latlon/js/osgridref';

const helpers = {
  coord2grid(location) {
    const locationGranularity = helpers._getGRgranularity(location);

    const p = new LatLon(location.latitude, location.longitude, LatLon.datum.WGS84);
    const grid = OsGridRef.latLonToOsGrid(p);

    return grid.toString(locationGranularity).replace(/\s/g, '');
  },

  grid2coord(gridrefString) {
    function normalizeGridRef(incorrectGridref) {
      // normalise to 1m grid, rounding up to centre of grid square:
      let e = incorrectGridref.easting;
      let n = incorrectGridref.northing;

      switch (incorrectGridref.easting.toString().length) {
        case 1: e += '50000'; n += '50000'; break;
        case 2: e += '5000'; n += '5000'; break;
        case 3: e += '500'; n += '500'; break;
        case 4: e += '50'; n += '50'; break;
        case 5: e += '5'; n += '5'; break;
        case 6: break; // 10-digit refs are already 1m
        default: return new OsGridRef(NaN, NaN);
      }
      return new OsGridRef(e, n);
    }

    let gridref = OsGridRef.parse(gridrefString);
    gridref = normalizeGridRef(gridref);

    if (!isNaN(gridref.easting) && !isNaN(gridref.northing)) {
      return OsGridRef.osGridToLatLon(gridref, LatLon.datum.WGS84);
    }

    return null;
  },

  /**
   * 1 gridref digits. (10000m)  -> < 3 map zoom lvl
   * 2 gridref digits. (1000m)   -> 5
   * 3 gridref digits. (100m)    -> 7
   * 4 gridref digits. (10m)     -> 9
   * 5 gridref digits. (1m)      ->
   */
  mapZoom2meters(accuracy) {
    // cannot be odd
    if (accuracy % 2 !== 0) {
      accuracy = accuracy === 1 ? accuracy + 1 : accuracy - 1;
    }

    if (accuracy <= 3) {
      accuracy = 0;
    } else if (accuracy <= 5) {
      accuracy = 1;
    } else if (accuracy <= 7) {
      accuracy = 2;
    } else if (accuracy <= 9) {
      accuracy = 3;
    } else{
      accuracy = 4;
    }

    accuracy = 5000 / Math.pow(10, accuracy); // meters
    return accuracy < 1 ? 1 : accuracy;
  },

  meters2MapZoom(accuracy) {
    const digits = Math.log(accuracy) / Math.LN10;
    let mapZoomLevel = digits ? 20 - digits * 2 : 18; // max zoom 10 (digits == 0)
    mapZoomLevel = Number((mapZoomLevel).toFixed(0)); // round the float
    return mapZoomLevel;
  },

  /**
   * 1 gridref digits. (10000m)
   * 2 gridref digits. (1000m)
   * 3 gridref digits. (100m)
   * 4 gridref digits. (10m)
   * 5 gridref digits. (1m)
   */
  _getGRgranularity(location) {
    let locationGranularity;
    let accuracy = location.accuracy;

    // don't need to recalculate if exists
    if (location.source === 'gridref') {
      return accuracy;
    }

    // normalize to meters
    if (location.source === 'map') {
      accuracy = helpers.mapZoom2meters(accuracy);
    }

    // calculate granularity
    const digits = Math.log(accuracy) / Math.LN10;
    locationGranularity = 10 - digits * 2; // MAX GR ACC -
    locationGranularity = Number((locationGranularity).toFixed(0)); // round the float

    // normalize granularity
    // cannot be odd
    if (locationGranularity % 2 !== 0) {
      // should not be less than 2
      locationGranularity =
        locationGranularity === 1 ? locationGranularity + 1 : locationGranularity - 1;
    }

    if (locationGranularity > 10) {
      // no more than 10 digits
      locationGranularity = 10;
    } else if (locationGranularity < 2) {
      // no less than 2
      locationGranularity = 2;
    }
    return locationGranularity;
  },

  isInUK(location) {
    if (!location.latitude || !location.longitude) return null;

    let gridref = location.gridref;
    if (!gridref) {
      gridref = helpers.coord2grid(location);
    }

    if (gridref) return true;

    return false;
  },
};

export default helpers;
