import React, { useContext } from "react";
import { TextField } from "@material-ui/core";
import { SearchContext } from "../contexts/SearchContext";

export const Search: React.FC<{}> = () => {
  const { query } = useContext(SearchContext);
  return (
    <div>
      <TextField
        fullWidth={true}
        aria-label="Search"
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        label="Location"
        placeholder="Enter the name of location to find it"
        onChange={(e) => query.set(e.target.value)}
      />
    </div>
  );
};
