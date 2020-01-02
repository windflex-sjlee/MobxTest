/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import ImageList from './src/components/ImageList';
import {Provider} from 'mobx-react';
import store from './src/store';

const App = () => {
  return(
    <Provider store={store}>
      <ImageList />
    </Provider>
  );
};


export default App;
