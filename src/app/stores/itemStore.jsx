'use strict';

import Reflux from 'reflux';
import ItemActions from '../actions/itemActions';

const ItemStore = Reflux.createStore({
  listenables: ItemActions,

    init() {
    },

    onLoadItems() {
        this.trigger({
            loading: true
        });
    },

    onLoadItemsCompleted(items) {
        this.items = items;
        this.trigger({
            items : this.items,
            loading: false
        });
    },

    onLoadItemsFailed(error) {
        this.trigger({
            error : error,
            loading: false
        });
    }
});

export default ItemStore;
