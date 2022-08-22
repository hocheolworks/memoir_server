module.exports = {
  apps: [
    {
      name: 'memoir_server',
      script: 'index.js',
    },
  ],
  deploy: {
    production: {
      user: 'ubuntu',
      host: '172.31.38.79',
      path: '/home/ubuntu/memoir_prd.pem',
      repo: 'git@github.com:hocheolworks/memoir_server.git',
      ref: 'origin/main',
      key: '/Users/jeongcheol/memoir_server.pem',
      'post-deploy': 'npm i; pm2 reload ecosystem.config.js --env production',
    },
  },
};
