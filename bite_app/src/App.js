import React, { useState } from 'react';
import {
  ChakraProvider,
  theme,
  Center
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import ls from 'local-storage';
import { usePosition } from 'use-position';
import {useSpring, animated } from 'react-spring';
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
  const [setup, setSetup] = useState(true);
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
    let my_places = ls.get('bite_app_array').filter(place => place.business_status === "OPERATIONAL").filter(place => place.price_level <= maxPriceRating).filter(place => place.rating >= minUserRating);
    console.log(my_places)
    if (my_places.length > 0) {
      let random_number = Math.floor(Math.random() * my_places.length);

      let my_choice = my_places[random_number];
      const randomPhoto = Math.floor(Math.random() * my_choice.photos.length);
      let photo_ref = my_choice.photos[randomPhoto].photo_reference
      const imageRequestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Connection': 'keep-alive' },
        body: JSON.stringify({
          "verb": "photo",
          "photoRef" : photo_ref
        })
      };
      fetch('https://clb4c9g6i7.execute-api.us-east-1.amazonaws.com/free_bite_dev/bite', imageRequestOptions)
        .then(response => response.blob())
        .then(blob => blob.text())
        .then(b64Str => setImgData(`data:image/png;base64,${b64Str}`))
      //console.log(imgData);
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
  const createLocalArray = async (interval, toggle_parent, open_parent) => {
    ls.remove('bite_app_array');
    let requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Connection': 'keep-alive', 'Accept-Encoding': 'gzip, deflate, br' },
      body: JSON.stringify({
        "verb": "create",
        "long": longitude,
        "lat": latitude,
        "radius": maxDistance,
        "minPrice": 0,
        "maxPrice": 5
      })
    }
    const response = await fetch('https://clb4c9g6i7.execute-api.us-east-1.amazonaws.com/free_bite_dev/bite', requestOptions);
    const data = await response.json();
    console.log(data)
    ls.set('bite_app_array', data["Results"]);
    if (data["NextPageToken"] !== "") {
      await new Promise(r => setTimeout(r, 2000));
      let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Connection': 'keep-alive', 'Accept-Encoding': 'gzip, deflate, br' },
        body: JSON.stringify({
          "verb": "nextpage",
          "pageToken": data["NextPageToken"]
        })
      }
      const stage2_response = await fetch('https://clb4c9g6i7.execute-api.us-east-1.amazonaws.com/free_bite_dev/bite', requestOptions);
      const stage2_data = await stage2_response.json();
      ls.set('bite_app_array', data["Results"].concat(stage2_data["Results"]));
      if (stage2_data["NextPageToken"] !== "") {
        await new Promise(r => setTimeout(r, 2000));
        let requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Connection': 'keep-alive', 'Accept-Encoding': 'gzip, deflate, br' },
          body: JSON.stringify({
            "verb": "nextpage",
            "pageToken": stage2_data["NextPageToken"]
          })
        }
        const stage3_response = await fetch('https://clb4c9g6i7.execute-api.us-east-1.amazonaws.com/free_bite_dev/bite', requestOptions);
        const stage3_data = await stage3_response.json();
        ls.set('bite_app_array', data["Results"].concat(stage2_data["Results"], stage3_data["Results"]))
      }
      changeMeal();
      clearInterval(interval);
      toggle_parent(!open_parent);
      setTimeout(() => setSetup(false), 300); 
      setTimeout(() => toggle_parent(open_parent), 1000);
    }
  }
  const [open, toggle] = useState(true)
  const props = useSpring({ opacity: open ? 1 : 0, marginTop: open ? 0 : -300, transform: `perspective(600px) rotateY(${open ? 0 : 360}deg)`, config: { mass: 5, tension: 500, friction: 80 } })
  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher justifySelf="flex-end" />
        <Center>
        <animated.div style={props}>
        { setup ? <Setup
                createLocalArray={createLocalArray}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                maxPriceRating={maxPriceRating}
                setMaxPriceRating={setMaxPriceRating}
                minUserRating={minUserRating}
                setMinUserRating={setMinUserRating}
                setSetup={setSetup}
                open_parent={open}
                toggle_parent={toggle}/> :
              <BiteCard
              address={address}
              imageUrl={imgData}
              title={title} 
              isRestaurant={isRestaurant} 
              isBar={isBar}
              price={priceRating} 
              rating={userRating}
              changeMeal={changeMeal}
              open={open}
              toggle={toggle}/> }
        </animated.div>  
      </Center>
    </ChakraProvider>
  );
}

export default App;
