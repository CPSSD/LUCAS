import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';

import './css/style.scss';
import Header from './components/header';
import Main from './components/main';
import store from './store/index';


const App = () => (
  <Provider store={store}>
    <section className="hero is-medium">
      <Helmet>
        <meta charset="utf-8" />
        <title>Amazoff</title>
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
        <link rel="stylesheet" href="style.scss" />
        <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <Header />
      <Main />
    </section>
  </Provider>
);

export default App;
ReactDOM.render(<App />, document.body);
