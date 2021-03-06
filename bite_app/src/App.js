import React, { useState } from 'react';
import {
  ChakraProvider,
  theme,
  Center
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ls from 'local-storage';
import { usePosition } from 'use-position';
import BiteCard from './BiteCard';
import Setup from './Setup';

function App() {
  // defining our main state
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [maxPriceRating, setMaxPriceRating] = useState(1);
  const [minUserRating, setMinUserRating] = useState(1);
  const [maxDistance, setMaxDistance] = useState(600);
  const [priceRating, setPriceRating] = useState(1);
  const [userRating, setUserRating] = useState(1);
  const [isBar, setIsBar] = useState(true);
  const [isRestaurant, setIsRestaurant] = useState(true);
  const [imgData, setImgData] = useState("");
  const watch = true;
  const {
    latitude,
    longitude,
    speed,
    timestamp,
    accuracy,
    error,
  } = usePosition(watch); // ITS A HOOOOOOK

  // defining our main functions
  
  // changeMeal will be invoked by clicking BiteCard's only button
  const changeMeal = () => {
    console.log("changeMeal invoked", ls.get('bite_app_array'));
    let my_places = ls.get('bite_app_array').filter(place => place.business_status === "OPERATIONAL" && place.price_level < maxPriceRating && place.rating > minUserRating);// place.price < maxPriceRating && place.price < maxPriceRating);
    console.log(my_places)
    if (my_places.length > 0) {
      let random_number = Math.floor(Math.random() * my_places.length);
      let my_choice = my_places[random_number];
      setTitle(my_choice.name);
      setAddress(my_choice.vicinity);
      setPriceRating(my_choice.price_level);
      setUserRating(my_choice.rating);
      if (my_choice.types.includes("bar")){ setIsBar(true); }else{ setIsBar(false); }
      if (my_choice.types.includes("restaurant")){ setIsRestaurant(true); }else{ setIsRestaurant(false); }
      return true;
    } else {
      alert("Nothing returned, please widen the search.")
      return false;
    }
  }

  // createLocalArray will be invoked upon leaving the config menu, and populates the local-storage with data from the backend BiteApp API call
  const createLocalArray = async (interval) => {
    console.log(longitude, latitude)
    ls.remove('bite_app_array');
    let requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Connection': 'keep-alive' },
      body: JSON.stringify({
        "long": longitude,
        "lat": latitude,
        "minprice": 1,
        "maxprice": maxPriceRating
      })
    }
    const response = await fetch('http://localhost:5000/query', requestOptions);
    const data = await response.json();
    ls.set('bite_app_array', data);
    console.log(ls.get('bite_app_array'));
    clearInterval(interval);
    changeMeal();
    if (ls.get('bite_app_array')) { return true; }else{ return false; }
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher justifySelf="flex-end" />
        <Center>
        <Router>
          <Switch>
            <Route path="/setup">
              <Setup
                createLocalArray={createLocalArray}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                maxPriceRating={maxPriceRating}
                setMaxPriceRating={setMaxPriceRating}
                minUserRating={minUserRating}
                setMinUserRating={setMinUserRating}
                />
            </Route>
            <Route path="/app">
              <BiteCard
              address={address}
              imageUrl="https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Tweety.svg/1200px-Tweety.svg.png"
              title={title} 
              isRestaurant={isRestaurant} 
              isBar={isBar}
              price={priceRating} 
              rating={userRating}
              changeMeal={changeMeal}/>
            </Route> 
          </Switch>
        </Router>
      </Center>
    </ChakraProvider>
  );
}

export default App;
