# Deploy

0. `nvm use 18`
1. `firebase login`
2. `firebase functions:config:set pushover.token="" pushover.user="" pushover.device="iphone"`
    - Get token from app in Pushover
    - Get user from homepage in Pushover
3. `yarn run build`
4. `yarn run deploy`
