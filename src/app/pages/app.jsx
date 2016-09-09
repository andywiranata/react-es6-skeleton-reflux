'use strict';

import React            from 'react';
import Footer           from '../components/footer.jsx'
import Header           from '../components/header.jsx'

const App = (props) => {

    return (
      <div>
          <Header/>
          <div className="content root-content">
              {props.children}
          </div>
          <Footer />
      </div>
    );
};

export default App;
