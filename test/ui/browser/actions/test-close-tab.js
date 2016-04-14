// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../ui/browser/store/store';
import * as actions from '../../../../ui/browser/actions/main-actions';

describe('Action - CLOSE_TAB', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.store.dispatch(actions.createTab('https://moz.org/1'));
    this.store.dispatch(actions.createTab('https://moz.org/2'));
    this.store.dispatch(actions.createTab('https://moz.org/3'));
    expect(this.store.getState().currentPageIndex).toEqual(3);
    expect(this.store.getState().pages.size).toEqual(4);
  });

  it('Should maintain tab selection when destroying a tab before the selected tab', function() {
    const { getState, dispatch } = this.store;

    dispatch(actions.closeTab(1));
    expect(getState().pages.size).toEqual(3);
    expect(getState().pages.get(1).location).toEqual('https://moz.org/2');
    expect(getState().currentPageIndex).toEqual(2,
      'CLOSE_TAB does not update selected tab if the tab destroyed was not selected.');
  });

  it('Should maintain tab selection when destroying a tab after the selected tab', function() {
    const { getState, dispatch } = this.store;

    dispatch(actions.setCurrentTab(1));
    dispatch(actions.closeTab(3));

    expect(getState().pages.size).toEqual(3);
    expect(getState().pages.get(1).location).toEqual('https://moz.org/1');
    expect(getState().currentPageIndex).toEqual(1,
      'CLOSE_TAB does not update selected tab if the tab destroyed was not selected.');
  });

  it('Should destroy a selected tab and select next when it is not last tab', function() {
    const { getState, dispatch } = this.store;

    dispatch(actions.setCurrentTab(1));
    dispatch(actions.closeTab(1));

    expect(getState().pages.size).toEqual(3);
    expect(getState().pages.get(1).location).toEqual('https://moz.org/2');
    expect(getState().currentPageIndex).toEqual(1,
      'CLOSE_TAB on selected tab selects the next tab');
  });

  it('Should destroy a selected tab and select previous when it is the last tab', function() {
    const { getState, dispatch } = this.store;

    dispatch(actions.closeTab(3));
    expect(getState().pages.size).toEqual(3);
    expect(getState().pages.get(2).location).toEqual('https://moz.org/2');
    expect(getState().currentPageIndex).toEqual(2,
      'CLOSE_TAB on last selected tab selects the previous tab');
  });

  it('Destroying the last tab should reset state', function() {
    const { getState, dispatch } = this.store;
    dispatch(actions.closeTab(3));
    dispatch(actions.closeTab(2));
    dispatch(actions.closeTab(1));
    expect(getState().currentPageIndex).toEqual(0);
    expect(getState().pages.size).toEqual(1);

    dispatch(actions.closeTab(0));
    expect(getState().currentPageIndex).toEqual(0);
    expect(getState().pages.size).toEqual(1);
    expect(getState().pages.get(0).location).toEqual('https://www.mozilla.org/');
  });
});
