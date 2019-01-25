const manufacturerPage = require('administration/page-objects/module/sw-manufacturer.page-object.js');

module.exports = {
    '@tags': ['manufacturer-inline-edit', 'manufacturer', 'inline-edit'],
    before: (browser, done) => {
        global.FixtureService.create('product-manufacturer').then(() => {
            done();
        });
    },
    'navigate to manufacturer module': (browser) => {
        browser
            .openMainMenuEntry('#/sw/product/index', 'Product', '#/sw/manufacturer/index', 'Manufacturer')
            .assert.urlContains('#/sw/manufacturer/index')
            .waitForElementVisible('.sw-button__content');
    },
    'inline edit manufacturer name and website and verify edits': (browser) => {
        const page = manufacturerPage(browser);

        browser
            .waitForElementVisible('.sw-grid-row:first-child .sw-context-button__button')
            .expect.element('.sw-grid-row:first-child .sw-manufacturer-list_column-manufacturer-name').to.have.text.that.equals('MAN-U-FACTURE');

        browser
            .moveToElement(`${page.elements.gridRow}:first-child`, 5, 5).doubleClick()
            .waitForElementVisible('.is--inline-editing')
            .fillField('input[name=sw-field--item-name]', 'I am Groot', true)
            .waitForElementVisible(`${page.elements.gridRow}__inline-edit-action`)
            .click(`${page.elements.gridRow}__inline-edit-action`)
            .waitForElementNotPresent('.is--inline-editing ')
            .refresh()
            .waitForElementVisible('.sw-page__smart-bar-amount')
            .assert.containsText('.sw-grid-column.sw-grid__cell.sw-grid-column--left', 'I am Groot')
            .moveToElement(`${page.elements.gridRow}:first-child .sw-grid-column:nth-child(3)`, 5, 5).doubleClick()
            .fillField('input[name=sw-field--item-link]', 'www.google.ru', true)
            .waitForElementVisible(`${page.elements.gridRow}__inline-edit-action`)
            .click(`${page.elements.gridRow}__inline-edit-action`)
            .waitForElementNotPresent('.is--inline-editing ')
            .assert.containsText('.sw-grid-column.sw-grid__cell.sw-grid-column--left:nth-child(2)', 'I am Groot');
    },
    after: (browser) => {
        browser.end();
    }
};
