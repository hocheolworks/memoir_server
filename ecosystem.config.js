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
      host: '15.164.103.217',
      path: '/home/ubuntu/memoir_server',
      repo: 'git@github.com:hocheolworks/memoir_server.git',
      ref: 'origin/main',
      key: '/Users/jeongcheol/memoir_prd.pem',
      'post-deploy': 'npm i; pm2 reload ecosystem.config.js --env production',
    },
  },
};
