/** ****************************************************************************
 * Record Show main view.
 *****************************************************************************/
import Marionette from 'marionette';
import Morel from 'morel';
import JST from '../../../JST';
import DateHelp from '../../../helpers/date';
import StringHelp from '../../../helpers/string';
import Gallery from '../../common/gallery';

export default Marionette.ItemView.extend({
  template: JST['records/show/main'],

  events: {
    'click img': 'photoView',
  },

  photoView(e) {
    e.preventDefault();

    const items = [];
    const recordModel = this.model.get('recordModel');
    recordModel.occurrences.at(0).images.each((image, index) => {
      items.push({
        src: image.getURL(),
        w: image.get('width') || 800,
        h: image.get('height') || 800,
      });
    });

// Initializes and opens PhotoSwipe
    var gallery = new Gallery(items);
    gallery.init();
  },

  serializeData() {
    const recordModel = this.model.get('recordModel');
    const occ = recordModel.occurrences.at(0);
    const specie = occ.get('taxon');

    // taxon
    const scientificName = specie.scientific_name;
    let commonName = specie[specie.found_in_name];
    if (specie.found_in_name === 'scientific_name') {
      // show recommended name
      if (specie.commonName) {
        commonName = specie.commonName;
      } else {
        commonName = '';
      }
    }

    const syncStatus = recordModel.getSyncStatus();

    const locationPrint = recordModel.printLocation();
    const location = recordModel.get('location') || {};

    let blackgrass = occ.get('blackgrass') && StringHelp.limit(occ.get('blackgrass'));
    if (!blackgrass) {
      blackgrass = occ.get('blackgrass-ranges') && StringHelp.limit(occ.get('blackgrass-ranges'));
    }


    // show activity title.
    const group = recordModel.get('group');

    return {
      id: occ.cid,
      isSynchronising: syncStatus === Morel.SYNCHRONISING,
      onDatabase: syncStatus === Morel.SYNCED,
      scientific_name: scientificName,
      commonName,
      location: locationPrint,
      location_name: location.name,
      date: DateHelp.print(recordModel.get('date')),
      blackgrass,
      season: occ.get('season') && StringHelp.limit(occ.get('season')),
      comment: occ.get('comment'),
      group_title: group ? group.title : null,
      images: occ.images,
    };
  },
});

