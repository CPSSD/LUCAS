import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';

import './css/style.scss';
import Header from './components/header';
import Main from './components/main';
import WhatIsModal from './components/modal';
import store from './store/index';

const App = () => (
  <Provider store={store}>
    <section className="hero is-medium">
      <Helmet>
        <meta charset="utf-8" />
        <title>Lucify</title>
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Playfair+Display" rel="stylesheet"></link>
        <script async defer type="text/javascript" src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places&callback=googleApi`}></script>
        
        <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        <link rel="stylesheet" href="style.scss" />
        <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <Header />
      <Main />
      <WhatIsModal />
    </section>
  </Provider>
);

export default App;
ReactDOM.render(<App />, document.body);
