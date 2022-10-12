import chai from "chai";
import { createSandbox } from "sinon";
import sinonChai from "sinon-chai";

export async function mochaGlobalSetup() {
  // initial global setup
  // runs once for all threads
}

export const mochaHooks: Mocha.RootHookObject = {
  // runs once at the beginning of each thread
  beforeAll(done: () => void) {
    done();
  },
  // runs once at the end of each thread
  afterAll(done: () => void) {
    done();
  },
  // runs once before each test
  beforeEach(done: () => void) {
    chai.should();
    chai.use(sinonChai);
    this.sandbox = createSandbox();
    done();
  },
  // runs once after each test
  afterEach(done: () => void) {
    this.sandbox.restore();
    done();
  },
};
