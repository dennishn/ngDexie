import { NgDexiePage } from './app.po';

describe('ng-dexie App', () => {
  let page: NgDexiePage;

  beforeEach(() => {
    page = new NgDexiePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
