// import logo from './logo.svg';
// import { useEffect } from 'react';
// import axios from 'axios'
import IndexRouter from './router/IndexRouter';
import './App.css';
import store from './redux/store'
import {Provider} from 'react-redux'
function App() {
  return (
    <Provider store={store}>
       <IndexRouter></IndexRouter>
    </Provider>
     
  );
}
export default App;
