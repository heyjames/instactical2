import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Banner from './components/banner';
import MainInfo from './components/mainInfo';
import Blog from './components/blog';

function App() {
  return (
    <React.Fragment>
      <Navbar />
      <Banner />
      <MainInfo />
      <Blog />
      <Footer />
    </React.Fragment>
  );
}

export default App;
