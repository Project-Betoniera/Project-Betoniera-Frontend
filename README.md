# Project Betoniera - Frontend

[![typescript][typescript-shield]][typescript-url]
[![vite][vite-shield]][vite-url]
[![react][react-shield]][react-url]
[![fluent ui][fluentui-shield]][fluentui-url]

[🌐 Website](https://betoniera.org/)

## 📄 Description
Alternative frontend for [Fondazione JobsAcademy's calendar manager](https://gestionale.fondazionejobsacademy.org/), that aims to provide a better and faster UI (especially on mobile devices), along with some nice-to-have features, such as syncing calendars with third-party apps.
## 🧑‍💻 Get started with development
### 📌 Prerequisites
To start developing, you need to have [Node.js](https://nodejs.org/en/) installed on your machine.
After that, you can clone the repository, then install the dependencies with the following command
```bash
npm install
```
Before starting the vite development server, you need to create a `.env` file in the root folder (the folder in which the `package.json` file is located) and set set the required environment variables, found in the table below. The optional environment variables can be omitted.
Key|Default / Example value|Description|Required
-|-|-|-
`API_URL`|`https://api.betoniera.org/dev/`|The URL of the backend server|✅
`IS_BETA_BUILD`|`false`|Used to show or hide the 'BETA' badges|❌
`PLAUSIBLE_DOMAIN`|`betoniera.org`|The domain name in Plausible Analytics|❌
`PLAUSIBLE_SCRIPT`|`https://plausible.io/js/plausible.js`|The path to the Plausible script|❌

#### Notes:
- You can copy and rename the `.env.example` file to `.env` to get started.
- If the default backend server is used, the application must be started on port `5173`, as the development backend server is configured to accept requests only from `http://localhost:5173`.  
If your development server starts on port `5174`, you likely already have another vite development server running.
- To use Plausible Analytics, the `PLAUSIBLE_DOMAIN` environment variable must be set at build time to the same domain name that was set in Plausible Analytics. If it is not set, Plausible Analytics will not be loaded.  
Additionally, a custom path to the Plausible script can be set with the `PLAUSIBLE_SCRIPT` environment variable. If not set, the default path to Plausible SaaS will be used.

### 🚀 Running the application
Once all the environment variables are set, you can start the vite development server with the following command
```bash
npm start
```

## 📃 License

Project Betoniera Frontend  
Copyright (C) 2024  Michelangelo Camaioni and contributors

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.


[typescript-shield]: https://img.shields.io/badge/TypeScript-262626?logo=typescript&style=for-the-badge
[typescript-url]: https://typescriptlang.org/

[react-shield]: https://img.shields.io/badge/React-23272f?logo=react&style=for-the-badge
[react-url]: https://react.dev/

[fluentui-shield]: https://img.shields.io/badge/Fluent%20UI-292929?logo=microsoft&style=for-the-badge
[fluentui-url]: https://react.fluentui.dev/

[vite-shield]: https://img.shields.io/badge/Vite-1b1b1f?logo=vite&style=for-the-badge
[vite-url]: https://vitejs.dev/
