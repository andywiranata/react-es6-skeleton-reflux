'use strict';

import React            from 'react';
import ItemStore        from '../stores/itemStore';
import ItemActions      from '../actions/itemActions';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items : [],
            loading: false
        };
    }

    componentDidMount() {
        this.unsubscribe = ItemStore.listen(this.onStatusChange.bind(this));
        ItemActions.loadItems();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(state) {
        this.setState(state);
    }


    render() {
        return (
            <div className="container">
                <h1>Home Area</h1>

            </div>
        );
    }
}

export default Home;

