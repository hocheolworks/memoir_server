module.exports = {
  apps: [
    {
      name: 'memoir_server',
      script: 'main.js',
    },
  ],
  deploy: {
    production: {
      user: 'ubuntu',
      host: '54.180.51.124',
      path: '/home/ubuntu/memoir_server/',
      repo: 'git@github.com:hocheolworks/memoir_server.git',
      ref: 'origin/main',
      key: '/Users/jeongcheol/memoir_prd.pem',
      'post-deploy':
        'npm i; npm run build; pm2 start dist/main.js --name memoir_server;',
    },
  },
};
