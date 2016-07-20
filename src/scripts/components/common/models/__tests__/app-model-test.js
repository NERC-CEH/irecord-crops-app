import _ from 'lodash';
import Occurrence from '../occurrence';
import Sample from '../sample';
import { AppModel } from '../app_model';

describe('App Model', () => {
  function getRandomSample() {
    const occurrence = new Occurrence({
      taxon: { warehouse_id: 166205 },
    });
    const sample = new Sample({
      location: {
        latitude: 12.12,
        longitude: -0.23,
        name: 'automatic test' },
    }, {
      occurrences: [occurrence],
      onSend: () => {}, // overwrite manager's one checking for user login
    });
    return sample;
  }

  before(() => {
    const appModel = new AppModel();
    appModel.clear();
    appModel.save();
  });

  it('has default values', () => {
    const appModel = new AppModel();
    expect(_.keys(appModel.attributes).length).to.be.equal(4);
    expect(appModel.get('locations')).to.be.an.array;
    expect(appModel.get('attrLocks')).to.be.an.object;
    expect(appModel.get('autosync')).to.be.equal.true;
    expect(appModel.get('useGridRef')).to.be.equal.true;
  });

  describe('Past locations extension', () => {
    it('has functions', () => {
      const appModel = new AppModel();
      expect(appModel.setLocation).to.be.a('function');
      expect(appModel.removeLocation).to.be.a('function');
      expect(appModel.locationExists).to.be.a('function');
      expect(appModel.getLocationSref).to.be.a('function');
      expect(appModel.printLocation).to.be.a('function');
    });
  });

  describe('Locking attributes extension', () => {
    it('has functions', () => {
      const appModel = new AppModel();
      expect(appModel.setAttrLock).to.be.a('function');
      expect(appModel.getAttrLock).to.be.a('function');
      expect(appModel.isAttrLocked).to.be.a('function');
      expect(appModel.appendAttrLocks).to.be.a('function');
    });

    it('should sample append locked attributes', () => {
      const appModel = new AppModel();

      // lock some attributes
      appModel.setAttrLock('blackgrass', 123);

      // create a new sample
      const sample = getRandomSample();
      appModel.appendAttrLocks(sample);

      // check if correct
      const blackgrass = sample.occurrences.at(0).get('blackgrass');
      expect(blackgrass).to.be.equal(123);
    });

    it('should copy new attributes and not references', () => {
      const appModel = new AppModel();

      // lock some attributes
      const blackgrassObject = { num: 1 };
      appModel.setAttrLock('blackgrass', blackgrassObject);

      // create a new sample
      const sample = getRandomSample();
      appModel.appendAttrLocks(sample);

      const sample2 = getRandomSample();
      appModel.appendAttrLocks(sample2);

      // check if references with saved lock attributes
      let lockNum = appModel.getAttrLock('blackgrass');
      lockNum.num = 2;

      let blackgrass = sample2.occurrences.at(0).get('blackgrass');
      expect(blackgrass).to.deep.equal({ num: 1 });

      // check if references between samples
      let num = sample.occurrences.at(0).get('blackgrass');
      num.num = 3;

      blackgrass = sample2.occurrences.at(0).get('blackgrass');
      expect(blackgrass).to.deep.equal({ num: 1 });

      // check if haven't overwritten
      blackgrassObject.num = 4;
      sample.occurrences.at(0).set('blackgrass', blackgrassObject);

      blackgrass = sample2.occurrences.at(0).get('blackgrass');
      expect(blackgrass).to.deep.equal({ num: 1 });
    });
  });

  describe('Activities support', () => {
    function getRandActivity() {
      const activity = {
        id: (Math.random() * 100).toFixed(0),
        name: '',
        description: '',
        type: '',
        group_from_date: '2015-01-01',
        group_to_date: '2020-01-01',
      };
      return activity;
    }

    it('should remove expired activity lock', () => {
      let appModel = new AppModel();
      const activity = getRandActivity();
      activity.group_to_date = '2000-01-01';
      appModel.setAttrLock('activity', activity);
      appModel.save();
      expect(appModel.getAttrLock('activity')).to.be.an('object');

      appModel = new AppModel();
      expect(appModel.getAttrLock('activity')).to.be.undefined;
    });
  });
});
