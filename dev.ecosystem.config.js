module.exports = {
  apps: [
    {
      name: 'admin.idra.to-dev',
      script: './node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './',
      exec_mode: 'cluster',
      max_memory_restart: '512M',
      instances: 1,
      kill_timeout: 3000,
      env: {
        NODE_ENV: 'production',
        PORT: 4003,
      },
    },
  ],
};
