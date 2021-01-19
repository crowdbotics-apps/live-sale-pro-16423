// base config
const oAuth2Config = {
    issuer: 'https://hydra.livesalepro.com',
    clientId: 'lsp-encoder-app',
    redirectUrl: 'lspencoderapp:/oauth',
    scopes: ['openid','offline'],
    clientSecret: '<Add ClientSecret here>'
};

export default oAuth2Config