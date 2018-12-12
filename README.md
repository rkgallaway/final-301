# 301 final


**Author**
Ryan Gallaway, Jacob Anderson, Tyler Hood, Fletcher LaRue

**Version**
1.0.0 
#Dependencies
express, dotenv, pg, cors, superagent, node-fetch, ejs, method-override

## Overview
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for a Code Fellows 301 class. (i.e. What's your problem domain?) -->
Use this app to find basic information about companies. Number of employees, year founded, location, name, logo, website, leadership, mission, clients, social media links and potentially more. This is useful for learning more about companies that you might want to work for.

- Search for a specific company, or search an area.
- Save interesting companies for future reference.
- Edit details if existing information is wrong.
- Add notes to companies.


## Architecture
Tyler Hood and Fletcher LaRue:  ejs files, partials, and css 
Ryan Gallaway and Jacob Anderson:  server.js, clearbit and fullcontact api work

Search by company:
Takes the user input (a company name) and sends it to the ClearBit API to get the website URL. The company's website URL is then sent thru the FullContact API to retrieve company data. Company data is presented to the user, and if the user wants to save this company for later it is saved in a SQL database.

Clearbit: https://clearbit.com/

FullContact: https://www.fullcontact.com/

Chuck Norris API: http://www.icndb.com/

## Change Log
Tyler Hood and Fletcher LaRue:  ejs files, partials, and css 
Ryan Gallaway and Jacob Anderson:  server.js, clearbit and fullcontact api work





