import React, { useContext } from "react";
import { Input } from "@material-ui/core";
import { LocationContext } from "../contexts/LocationContext";

export const Search: React.FC<{}> = () => {
  const { query } = useContext(LocationContext);
  return (
    <div>
      <Input
        fullWidth={true}
        aria-label="Search"
        placeholder="Enter the name of location to find it"
        onChange={(e) => query.set(e.target.value)}
      />
    </div>
  );
};
