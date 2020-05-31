import React from 'react';
import Math from './maths/mathjax-loader'
import Layout from './components/layout'

function App() {
  return (
    <Layout
      render={({setLoading,setNotLoading}) => (
      <Math ></Math>
      )}
    />
  );
}

export default App;
