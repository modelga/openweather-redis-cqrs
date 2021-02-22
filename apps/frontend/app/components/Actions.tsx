import React, { useContext } from "react";
import { Button, Grid } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { TrackingContext } from "../contexts/TrackingContext";
import { SearchContext } from "../contexts/SearchContext";
import { WeatherContext } from "../contexts/WeatherContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
  }),
);
export const Actions: React.FC<{}> = () => {
  const classes = useStyles();
  const { searchResult } = useContext(SearchContext);
  const { result, track, unTrack } = useContext(TrackingContext);
  const { result: weatherResult, updateStatus, update } = useContext(WeatherContext);
  const { error, data } = result;
  return searchResult.data ? (
    <div>
      <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={3}>
        <Grid item xs>
          <Button color="primary" variant="contained" onClick={data ? unTrack : track}>
            {data ? "Remove" : "Add"}
          </Button>
        </Grid>
        {data ? (
          <Grid item>
            <Button color="secondary" variant="contained" onClick={update}>
              Update
            </Button>
          </Grid>
        ) : null}
      </Grid>
    </div>
  ) : null;
};
