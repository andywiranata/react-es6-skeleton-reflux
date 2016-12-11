'use strict';

import Reflux from 'reflux';
import ApiEndpoint from '../utilities/apiEndpoint';


const ItemActions = Reflux.createActions([
    {'loadItems': {children: ['completed', 'failed']}}
]);

ItemActions.loadItems.listen(function(){

    setTimeout(() => {
        const items = ['Foo', 'Bar', 'Lorem'];
        this.completed(items);

    }, 300);
});



export default ItemActions;
