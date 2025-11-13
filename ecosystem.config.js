module.exports = {
  apps: [
    {
      name: 'idra.to',
      script: './node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './',
      exec_mode: 'cluster',
      max_memory_restart: '512M',
      instances: 'max',
      kill_timeout: 3000,
    },
  ],
};
