import { Grid } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { Search } from "./components/Search";
import { SearchResults } from "./components/SearchResults";
import { SearchContainer } from "./contexts/SearchContext";
import { TrackingContainer } from "./contexts/TrackingContext";
import { WeatherContainer } from "./contexts/WeatherContext";

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
              <SearchResults />
            </Grid>
          </WeatherContainer>
        </TrackingContainer>
      </SearchContainer>
    </div>
  );
};
export default App;
