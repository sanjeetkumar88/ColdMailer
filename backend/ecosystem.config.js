module.exports = {
  apps: [
    {
      name: "mailflow-api",
      script: "src/server.ts",
      interpreter: "node",
      interpreter_args: "-r ts-node/register --max-old-space-size=4096",
      env: {
        NODE_ENV: "development",
      },
      watch: false,
    },
    {
      name: "mailflow-worker",
      script: "src/worker.ts",
      interpreter: "node",
      interpreter_args: "-r ts-node/register --max-old-space-size=4096",
      env: {
        NODE_ENV: "development",
      },
      watch: false,
    }
  ]
};
