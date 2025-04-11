import React, { useState } from 'react'
import './Home.css' // Ensure the path is correct
import Header from '../../components/Header/Header' // Ensure the path is correct
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu' // Ensure the path is correct
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay' // Ensure the path is correct
import AppDownload from '../../components/AppDownload/AppDownload'

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload/>
    </div>
  );
};

export default Home



