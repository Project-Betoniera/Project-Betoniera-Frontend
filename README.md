# Project Betoniera - Frontend
## Description
Frontend [React](https://react.dev) application for the unofficial JobsAcademy calendar manager.

## Get started with development
To start developing, you need to have [Node.js](https://nodejs.org/en/) installed on your machine.
After that, you can clone the repository, then install the dependencies with the following command:
```bash
npm install
```
Before starting the development server, you need to create a `.env` file in the root of the project, with the following content:
```bash
API_URL = http://localhost:4000
```
Note:
- You can also make a copy of the `.env.example` file and rename it to `.env`.
- The `API_URL` variable is the url of the [backend server](https://github.com/Genio2003/Project-Betoniera-Backend), which is not included in this repository.
- `API_URL` can also be set as an environment variable. Variables from `.env` are read with the `dotenv` package.

To use Plausible Analytics, the `PLAUSIBLE_DOMAIN` environment variable must be set at build time to the domain name in Plausible Analytics. If it is not set, Plausible Analytics will not be loaded.  
Additionally, a custom path to the Plausible script can be set with the `PLAUSIBLE_SCRIPT` environment variable. If it is not set, the default path to Plausible SaaS will be used.

Then, you can start the development server with:
```bash
npm start
```
