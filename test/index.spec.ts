// test/index.spec.ts

import { JSDOM } from 'jsdom'
import { expect } from 'chai'
import initStylableScrollbars from '../src/index'

beforeEach(() => {
  const dom = new JSDOM(
    `<html>
       <body>

        <div stylable-scrollbar-scrollable="example"></div>
        <div stylable-scrollbar="example" direction="horizontal">
            <div stylable-scrollbar-handle></div>
        </div>
       
        <div stylable-scrollbar-scrollable="2"></div>
        <div stylable-scrollbar="2" direction="vertical">
            <div stylable-scrollbar-handle></div>
        </div>
       </body>
     </html>`,
    { url: 'http://localhost' },
  );

  global.window = dom.window;
  global.document = dom.window.document;
});

describe("Stylable Scrollbars", function () {
  describe("Init", function () {
    it("successfully initialises from appropriate html", function () {
      const scrollbars = initStylableScrollbars()
      expect(scrollbars.length).to.equal(2)
    });
  });
});