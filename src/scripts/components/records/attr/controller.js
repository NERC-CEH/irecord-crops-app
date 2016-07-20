/** ****************************************************************************
 * Record Attribute controller.
 *****************************************************************************/
import Backbone from 'backbone';
import Morel from 'morel';
import DateHelp from '../../../helpers/date';
import Log from '../../../helpers/log';
import App from '../../../app';
import appModel from '../../common/models/app_model';
import recordManager from '../../common/record_manager';
import MainView from './main_view';
import HeaderView from '../../common/views/header_view';
import LockView from '../../common/views/attr_lock_view';

const API = {
  show(recordID, attr) {
    Log('Records:Attr:Controller: showing');
    recordManager.get(recordID, (err, recordModel) => {
      if (err) {
        Log(err, 'e');
      }

      // Not found
      if (!recordModel) {
        Log('No record model found.', 'e');
        App.trigger('404:show', { replace: true });
        return;
      }

      // can't edit a saved one - to be removed when record update
      // is possible on the server
      if (recordModel.getSyncStatus() === Morel.SYNCED) {
        App.trigger('records:show', recordID, { replace: true });
        return;
      }

      // MAIN
      const mainView = new MainView({
        attr,
        model: recordModel,
      });
      App.regions.main.show(mainView);

      // HEADER
      const lockView = new LockView({
        model: new Backbone.Model({ appModel, recordModel }),
        attr,
        onLockClick: API.onLockClick,
      });

      const headerView = new HeaderView({
        onExit() {
          API.onExit(mainView, recordModel, attr);
        },
        rightPanel: lockView,
        model: new Backbone.Model({ title: attr }),
      });

      App.regions.header.show(headerView);

      // if exit on selection click
      mainView.on('save', () => {
        API.onExit(mainView, recordModel, attr);
      });

      // FOOTER
      App.regions.footer.hide().empty();
    });
  },

  onLockClick(options) {
    Log('Records:Attr:Controller: lock clicked');
    const attr = options.view.options.attr;
    // invert the lock of the attribute
    // real value will be put on exit
    if (attr === 'blackgrass') {
      if (appModel.getAttrLock(attr)) {
        appModel.setAttrLock(attr, !appModel.getAttrLock(attr));
      } else {
        appModel.setAttrLock('blackgrass-ranges',
          !appModel.getAttrLock('blackgrass-ranges'));
      }
    } else {
      appModel.setAttrLock(attr, !appModel.getAttrLock(attr));
    }
  },

  onExit(mainView, recordModel, attr) {
    Log('Records:Attr:Controller: exiting');
    const values = mainView.getValues();
    API.save(attr, values, recordModel);
  },

  /**
   * Update record with new values
   * @param values
   * @param recordModel
   */
  save(attr, values, recordModel) {
    let currentVal;
    let newVal;
    const occ = recordModel.occurrences.at(0);

    switch (attr) {
      case 'date':
        currentVal = recordModel.get('date');

        // validate before setting up
        if (values.date !== 'Invalid Date') {
          newVal = values.date;
          recordModel.set('date', newVal);
        }
        break;
      case 'blackgrass':
        currentVal = occ.get('blackgrass');

        // todo: validate before setting up
        if (values.blackgrass) {
          // specific blackgrass
          newVal = values.blackgrass;
          occ.set('blackgrass', newVal);
          occ.unset('blackgrass-ranges');
        } else {
          // blackgrass ranges
          attr = 'blackgrass-ranges';
          // don't save default values
          newVal = values['blackgrass-ranges'] === 'default' ?
            null : values['blackgrass-ranges'];
          occ.set('blackgrass-ranges', newVal);
          occ.unset('blackgrass');
        }
        break;
      case 'season':
        currentVal = occ.get('season');

        // todo:validate before setting up
        // don't save default values
        newVal = values.season === 'default' ? null : values.season;
        occ.set('season', newVal);
        break;
      case 'comment':
        currentVal = occ.get('comment');

        // todo:validate before setting up
        newVal = values.comment;
        occ.set('comment', newVal);
        break;
      default:
    }

    // save it
    recordModel.save(null, {
      success: () => {
        // update locked value if attr is locked
        API.updateLock(attr, newVal, currentVal);

        window.history.back();
      },
      error: (err) => {
        Log(err, 'e');
        App.regions.dialog.error('Problem saving the sample.');
      },
    });
  },

  updateLock(attr, newVal, currentVal) {
    let lockedValue = appModel.getAttrLock(attr);

    switch (attr) {
      case 'date':
        if (lockedValue && DateHelp.print(newVal) === DateHelp.print(new Date())) {
          appModel.setAttrLock(attr, null);
        }
        break;
      case 'blackgrass-ranges':
        if (!lockedValue) {
          lockedValue = appModel.getAttrLock('blackgrass');
        }
      case 'blackgrass':
        if (!lockedValue) {
          lockedValue = appModel.getAttrLock('blackgrass-ranges');
        }

        if (!lockedValue) return; // nothing was locked

        if (attr === 'blackgrass-ranges') {
          appModel.setAttrLock(attr, newVal);
          appModel.setAttrLock('blackgrass', null);
        } else {
          appModel.setAttrLock(attr, newVal);
          appModel.setAttrLock('blackgrass-ranges', null);
        }
        break;
      default:
        if (lockedValue && (lockedValue === true || lockedValue === currentVal)) {
          appModel.setAttrLock(attr, newVal);
        }
    }
  },
};

export { API as default };
