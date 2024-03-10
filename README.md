# Project Betoniera - Frontend
## Description
Frontend [React](https://react.dev) application for the unofficial JobsAcademy calendar manager.

## Get started with development
### Prerequisites
To start developing, you need to have [Node.js](https://nodejs.org/en/) installed on your machine.
After that, you can clone the repository, then install the dependencies with the following command:
```bash
npm install
```
Before starting the development server, you need to create a `.env` file in the root folder (the folder in which the `package.json` file is located) and set set the required environment variables, found in the table below. The optional environment variables can be omitted.
Key|Default / Example value|Description|Required
-|-|-|-
`API_URL`|`https://api.betoniera.org/dev/`|The url of the backend server|✅
`IS_BETA_BUILD`|`false`|Used to show or hide the 'BETA' badges|❌
`PLAUSIBLE_DOMAIN`|`betoniera.org`|The domain name in Plausible Analytics|❌
`PLAUSIBLE_SCRIPT`|`https://plausible.io/js/plausible.js`|The path to the Plausible script|❌

#### Notes:
- If the default development backend server is used, the application must be started on port `5173`, as the development backend server is configured to accept requests only from `http://localhost:5173`.
- To use Plausible Analytics, the `PLAUSIBLE_DOMAIN` environment variable must be set at build time to the domain name in Plausible Analytics. If it is not set, Plausible Analytics will not be loaded.  
Additionally, a custom path to the Plausible script can be set with the `PLAUSIBLE_SCRIPT` environment variable. If it is not set, the default path to Plausible SaaS will be used.

### Running the application
Once all the environment variables are set, you can start the vite development server with:
```bash
npm start
```
