# People Locator App

The People Locator App is a web application that allows you to add people and their coordinates, and then search for people within a certain range of kilometers from your own coordinates. This application is built using Node.js, PostgreSQL, PostGIS, and TypeScript.

# Installation

To install the People Locator App, follow these steps:

- Clone this repository to your local machine.
- Install the required dependencies by running npm install in server y client.
- Create a PostgreSQL database and add the connection string to the .env file.
- Start the server by running npm start or npm run dev.

# Usage

The frontend of the People Locator App is built using React.js and Leaflet with react-leaflet to display a map with markers indicating the location of the users.

If you have installed the client and server correctly, the app should create the user myself which represents your own coordinates as a user, then you can just click on the "add user" button to add as many people as coordinates you want, finally in the field "search by km" enter a number in kilometer, if the added people are within the selected distance you can see which people are in the selected range.

You can also click on the added person in the list on the left bar and the map will automatically take you to the approximate area where the person is located.

![People Locator](https://i.ibb.co/RYDRRgH/Captura-de-pantalla-2023-03-25-a-la-s-21-33-58.png)

# Dependencies:

- Node.js v16.18
- PostGIS v3.3.2
- PostgreSQL
- TypeScript
- Express.js
- Knex.js
- React.js
- Leaflet.js
- Dotenv
- ESLint

# Contributing

If you would like to contribute to the development of the People Locator App, please follow these guidelines:

Fork this repository to your own GitHub account and clone it to your local machine.
Install the required dependencies by running npm install.
Make your changes and test them thoroughly.
Create a pull request to this repository with a detailed description of your changes.

# License

The People Locator App is licensed under the MIT License. See the LICENSE file for more information.

# Acknowledgements

The People Locator App was inspired by the need to locate people within a certain range of kilometers from your own coordinates. This application was built as a learning project using Node.js, PostgreSQL, PostGIS, and TypeScript.
