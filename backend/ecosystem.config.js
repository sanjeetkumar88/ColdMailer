module.exports = {
  apps: [
    {
      name: "mailflow-api",
      script: "dist/server.js",
      env: {
        NODE_ENV: "production",
      },
      watch: false,
      max_memory_restart: "400M"
    },
    {
      name: "mailflow-worker",
      script: "dist/worker.js",
      env: {
        NODE_ENV: "production",
      },
      watch: false,
      max_memory_restart: "400M"
    }
  ]
};
