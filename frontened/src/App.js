import './App.css';
import React from 'react';
import Header from './components/layout/Header/Header.js';
// import Home from './components/Home/Home.js';
import Footer from './components/layout/Footer/Footer.js'
import { BrowserRouter as Router,Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Header />
      {/* <Route extract path='/' component={Home} />  */}
      <Footer/>
    </Router>


  );
}

export default App;
