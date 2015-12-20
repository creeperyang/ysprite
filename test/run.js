import Jasmine from 'jasmine';
import SpecReporter from 'jasmine-spec-reporter';

const jasmine = new Jasmine();
jasmine.addReporter(new SpecReporter());
jasmine.loadConfigFile('test/jasmine.json');
jasmine.execute();
