/** ****************************************************************************
 * Record List main view.
 *****************************************************************************/
import Marionette from 'marionette';
import Log from '../../../../helpers/log';
import JST from '../../../../JST';

const RecordView = Marionette.ItemView.extend({
  tagName: 'label',
  className: 'item item-radio',

  template: JST['common/taxon/species'],

  events: {
    click: 'select',
  },

  select(e) {
    this.trigger('record', this.model.toJSON());
  },

  serializeData() {
    const data = {
      common_name: this.model.get('common_name'),
    };

    const recordModel = this.options.recordModel;
    if (recordModel) {
      const occurrence = recordModel.occurrences.at(0);

      if (occurrence.get('taxon').common_name === data.common_name) {
        data[data.common_name] = true;
      }
    }
    return data;
  },
});


export default Marionette.CollectionView.extend({
  id: 'crops-list',
  tagName: 'div',
  className: 'list',
  childView: RecordView,

  childViewOptions() {
    return { recordModel: this.options.recordModel };
  },
});