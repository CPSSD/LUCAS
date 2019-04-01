# Lucify (Web frontend for LUCAS)

## Description

Lucify is a front end for the LUCAS service aiming to provide a tool to verify and spot fake reviews in businesses

## Installation and running

### Prerequisites

* NPM 6.X
* Google API Key
* Yelp API Key
* LUCAS is running

### 1. Creating a .env file

* First things first is you need to create 2 api keys for the project.
  * To find a guide on how to create the YELP API Key go here: https://www.yelp.com/developers/documentation/v3/authentication
  * To find a guide on how to create a GOOGLE API Key go here: https://developers.google.com/maps/documentation/javascript/get-api-key
    * Note: You need to select both the Maps and Places API when creating the key.

* After you have your keys available create a file called .env in the Lucify directory and copy your keys into the file in the format of:
  ```
  GOOGLE_API_KEY= 'YOUR_GOOGLE_KEY' 
  YELP_API_KEY= 'YOUR_YELP_KEY'
  DB_USERNAME= 'login'
  DB_PASSWORD= 'password'
  ```
To get the current production credentials please contact Kirill

### 2. Run npm install

### 3. Run npm start

