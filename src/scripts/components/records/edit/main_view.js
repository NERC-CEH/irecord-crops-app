/** ****************************************************************************
 * Record Edit main view.
 *****************************************************************************/
import Marionette from 'marionette';
import Morel from 'morel';
import JST from '../../../JST';
import DateHelp from '../../../helpers/date';
import StringHelp from '../../../helpers/string';

export default Marionette.ItemView.extend({
  template: JST['records/edit/record'],

  initialize() {
    const recordModel = this.model.get('recordModel');
    this.listenTo(recordModel, 'request sync error geolocation', this.render);
  },

  serializeData() {
    const recordModel = this.model.get('recordModel');
    const occ = recordModel.occurrences.at(0);
    const specie = occ.get('taxon');
    const appModel = this.model.get('appModel');

    // taxon
    const commonName = specie.common_name;

    const locationPrint = recordModel.printLocation();
    const location = recordModel.get('location') || {};

    let blackgrassLock = appModel.isAttrLocked('blackgrass', occ.get('blackgrass'));
    if (!blackgrassLock) {
      blackgrassLock = appModel.isAttrLocked('blackgrass-ranges', occ.get('blackgrass-ranges'));
    }

    const attrLocks = {
      date: appModel.isAttrLocked('date', recordModel.get('date')),
      location: appModel.isAttrLocked('location', recordModel.get('location')),
      blackgrass: blackgrassLock,
      season: appModel.isAttrLocked('season', occ.get('season')),
      comment: appModel.isAttrLocked('comment', occ.get('comment')),
    };

    let blackgrass = occ.get('blackgrass') && StringHelp.limit(occ.get('blackgrass'));
    if (!blackgrass) {
      blackgrass = occ.get('blackgrass-ranges') && StringHelp.limit(occ.get('blackgrass-ranges'));
    }

    return {
      id: recordModel.id || recordModel.cid,
      commonName,
      isLocating: recordModel.isGPSRunning(),
      isSynchronising: recordModel.getSyncStatus() === Morel.SYNCHRONISING,
      location: locationPrint,
      location_name: location.name,
      date: DateHelp.print(recordModel.get('date')),
      blackgrass,
      season: occ.get('season') && StringHelp.limit(occ.get('season')),
      comment: occ.get('comment') && StringHelp.limit(occ.get('comment')),
      locks: attrLocks,
    };
  },
});
