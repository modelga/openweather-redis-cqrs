import express from "express";

type ConfigType = {
  token?: string;
  port?: number;
};

export default function ({ port, token }: ConfigType = { port: 80 }) {
  const app = express();

  return {
    start() {
      app.listen(port, () => {
        console.log(`Manager (API) is listening on port ${port}`);
      });
    },
  };
}
