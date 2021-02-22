import React from "react";
import { Search } from "./components/Search";
import { SearchContainer } from "./contexts/SearchContext";
import { WeatherContainer } from "./contexts/WeatherContext";
import { TrackingContainer } from "./contexts/TrackingContext";
import { Actions } from "./components/Actions";
import { Grid } from "@material-ui/core";
import { Weather } from "./components/Weather";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    padding: {
      "& > div": {
        padding: theme.spacing(2),
      },
    },
  }),
);
const App: React.FC<{}> = () => {
  const classes = useStyles();

  return (
    <div>
      <SearchContainer>
        <TrackingContainer>
          <WeatherContainer>
            <Grid container direction="column" className={classes.padding}>
              <Search />
              <Actions />
              <Weather />
            </Grid>
          </WeatherContainer>
        </TrackingContainer>
      </SearchContainer>
    </div>
  );
};
export default App;
