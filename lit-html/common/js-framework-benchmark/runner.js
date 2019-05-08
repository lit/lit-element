import * as bench from '/bench.js';

const raf = () => new Promise((resolve) => requestAnimationFrame(resolve));

const clickId = (id) => document.getElementById(id).click();

const clickXPath = (xpath) =>
    document.evaluate(xpath, document.body).iterateNext().click();

export function runBenchmark() {
  bench.start();

  // The following scripts are based on the scripts from
  // https://github.com/krausest/js-framework-benchmark/blob/master/webdriver-ts/src/benchmarks.ts
  switch (bench.config.script) {
    case 'create rows':
      clickId('add');
      break;

    case 'replace all rows':
      clickId('run');
      break;

    case 'partial update':
      clickId('run');
      clickId('update');
      break;

    case 'select row':
      clickId('run');
      clickXPath('//tbody/tr[2]/td[2]/a');
      break;

    case 'swap rows':
      clickId('run');
      clickId('swaprows');
      break;

    case 'remove row':
      clickId('run');
      clickXPath('//tbody/tr[4]/td[3]/a/span[1]');
      break;

    case 'create many rows':
      clickId('runlots');
      break;

    case 'append rows to large table':
      clickId('run');
      clickId('add');
      break;

    case 'clear rows':
      clickId('run');
      clickId('clear');
      break;

    default:
      throw new Error(`Unknown config.script "${bench.config.script}"`);
  }

  bench.stop();
}
