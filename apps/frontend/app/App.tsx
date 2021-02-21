import React from "react";
import { Search } from "./components/Search";
import { LocationContainer } from "./contexts/LocationContext";
import { WeatherContainer } from "./contexts/WeatherContext";

const App: React.FC<{}> = () => {
  return (
    <LocationContainer>
      <WeatherContainer>
        <Search />
      </WeatherContainer>
    </LocationContainer>
  );
};
export default App;
