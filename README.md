# rcx-member-self-service-portal

Instructions to serve app
```sh
git clone https://github.com/reactorcx/rcx-member-self-service-portal
cd rcx-member-self-service-portal
npm i
npm run build
npm start
```
Local development steps will update here soon

### Required Environment Variables
|Variable Name| Description|
|-------------|------------|
|REST_URL| Rle Api URL|
|COGNITO_USER_POOL_ID| Cognito user pool id |
|COGNITO_CLIENT_ID| Cognito client id |
|AWS_DEFAULT_REGION| Default aws region |
|RLE_VERSION| Rle Api version|
|PORT| Port at which Node(express) should serve react app|
|NODE_ENV| Type of environment like production, development, test |
|AWS_DEFAULT_REGION| AWS region |
|USER_NAME| username to connect to rcx crud |
|USER_PASSWORD| password to connect to rcx crud |
|DEFAULT_PROGRAM| Default program id |
|CARD_NAME| Loyalty card name |
