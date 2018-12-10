'use strict';

const express = require('express');
const pg = require('pg');
const fetch = require('node-fetch');
const methodOverride = require('method-override');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT;

//const superagent = require('superagent');
//const util = require('util');
// const cors =  require('cors');

//databse setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//set view engine for templating
app.set('view engine', 'ejs');

//showing app where to find resources
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

// Middleware to handle PUT and DELETE requests
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in urlencoded POST bodies and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))


//+++++++++++++++ ROUTES +++++++++++++++++++

//route  for home view
app.get('/', getHome);
app.post('/results', getCompanyDomain);
app.put('/update/:company_id', editCompanyDetails);
app.post('/add', saveNewCompanyDetails);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//handler for POST request / searches

//+++++++++++++++ MODELS ++++++++++++++++

function Company(fullContact, clearBit) {
  //this.tableName = 'lastsearched';
  this.companyName = fullContact.name;
  this.founded = fullContact.founded;
  this.size = fullContact.employees;
  this.leaders = fullContact.dataAddOns? fullContact.dataAddOns.name: 'unknown leaders';
  this.product;
  this.clients;
  this.mission;
  this.contacts;
  this.location;
  this.domain = clearBit.domain;
  this.logo = clearBit.logo;
  this.notes; //needs populated w/ sql notes
  console.log(this);
}


//++++++++++++++ SQL +++++++++++++++

function saveCompany(company) {
  const values = [
    company.companyName,
    company.founded,
    company.size,
    company.leaders,
    company.product,
    company.clients,
    company.mission,
    company.contacts,
    company.location,
    company.domain,
    company.logo,
    company.notes
  ];

  let SQL = `DELETE FROM lastsearched;`;
  client.query(SQL);

  SQL = `INSERT INTO lastsearched (companyName, founded, size, leaders, product, clients, mission, contacts, location, domain, logo, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`;

  client.query(SQL, values);
}

function editCompanyDetails(request, response) {

  let SQL = `UPDATE savedcompanies SET companyName=$1, founded=$2, size=$3, leaders=$4, product=$5, clients=$6, mission=$7, contacts=$8, location=$9, domain=$10, logo=$11, notes=$12 WHERE id=${request.params.company_id};`;

  let values = [
    request.body.companyName,
    request.body.founded,
    request.body.size,
    request.body.leaders,
    request.body.product,
    request.body.clients,
    request.body.mission,
    request.body.contacts,
    request.body.location,
    request.body.domain,
    request.body.logo,
    request.body.notes
  ];

  return client.query(SQL, values)
    .then(() => {
      return response.redirect('/');
    })
    .catch(error => handleError(error, response));

}

function saveNewCompanyDetails(request, response) {
  let SQL = `INSERT INTO savedcompanies (companyName, founded, size, leaders, product, clients, mission, contacts, location, domain, logo, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`;

  let values = [
    request.body.companyName,
    request.body.founded,
    request.body.size,
    request.body.leaders,
    request.body.product,
    request.body.clients,
    request.body.mission,
    request.body.contacts,
    request.body.location,
    request.body.domain,
    request.body.logo,
    request.body.notes
  ];

  return client.query(SQL, values)
    .then(() => {
      return response.redirect('/');
    })
    .catch(error => handleError(error, response));
}

//++++++++++++++ HELPERS +++++++++++++++

//on page load
function getHome(request, response) {
  let SQL = 'SELECT * from savedCompanies;';
  return client
    .query(SQL)
    .then(results => {
      response.render('index', { results: results.rows });
    })
    .catch(error => handleError(error, response));

  //load savedComppanies
}

//++++++++++++++++ HANDLERS +++++++++++++++++

//error handler
function handleError(err, res) {
  //console.error(err);
  res.render('error.ejs', { error: 'Error recieved' });
}

function getCompanyDomain(request, response) {
  // console.log(request.body.searchTerm);
  fetch(
    `https://company.clearbit.com/v1/domains/find?name=${
      request.body.searchTerm
    }`,
    {
      //need to get search results
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CLEARBIT_API_KEY}` //add to .env
      }
    }
  )
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      console.log('json: (should return clearbit object)', json);
      getCompanyInfo(request, response, json);
    })
    .catch(error => handleError(error, response));
}

function getCompanyInfo(request, response, json) {
  // we passed in trying to find the dmoain we will get
  fetch('https://api.fullcontact.com/v3/company.enrich', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FULLCONTACT_API_KEY}` //add to .env
    },
    body: JSON.stringify({
      domain: json.domain //we added, not sure where it lives yet
    })
  })
    .then(function(res) {
      return res.json();
    })
    .then(apiResponse => {
      //console.log(apiResponse)
      const newCompany = new Company(apiResponse, json);
      saveCompany(newCompany);
      return newCompany;
    })
    .then(results => {
      return response.render('results', { searchResults: results });
    })

    .catch(error => handleError(error, response));
}

// function getCompany(request, response){

// }

// //reference from book app
// function createSearch(request, response) {
//   let url = 'https://www.googleapis.com/books/v1/volumes?q=';
//   superagent.get(url)
//     .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult)))
//     .then(results => response.render('pages/searches/show', {searchResults: results}))
//     .catch(error => handleError(error, response))
// }
// // reference above

// //on page load
// function getHome(request, response){
//   let SQL = 'SELECT * from savedCompanies;';
//   return client.query(SQL)
//     .then( (results) => {
//       response.render('/', {showSavedCompanies: results.rows});
//     })
//     .catch( (error) => handleError(error) );
// }

// Company.prototype = {
//   save: function() {
//     const SQL = `INSERT INTO ${this.tableName} (companyName, founded, size, leaders, product, clients, mission, contacts, location, domain, logo, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`;
//     const values = [this.companyName, this.founded, this.size, this.leaders, this.product, this.clients, this.mission, this.contacts, this.location, this.domain, this.logo];

//     client.query(SQL,values);
//   }
// }


const teamMembers = [
  {
    name: 'Fletcher LaRue',
    title: 'Software Developer',
    profile_pic_path: '/images/Fletcher_LaRue_about.jpg',
    twitter_url: '#',
    linkedin_url: 'https://www.linkedin.com/in/fletcher-larue/',
    github_url: 'https://github.com/asdFletcher',
    bio: 'Currently enrolled in Code Fellows Seattle campus on the Full Stack JavaScript course. This will formalize my long passion for coding, problem solving, and building cool stuff! My background is in Mechanical Engineering, but I\'ve seen the light and switched to web development. Not out of the blue though over the years I\'ve done side projects  courses and my family of web developers.',
  },
  {
    name: 'Tyler R Hood',
    title: 'Software Developer',
    profile_pic_path: '/images/Tyler_Hood_about.jpg',
    twitter_url: '#',
    linkedin_url: 'https://www.linkedin.com/in/tyler-r-hood/',
    github_url: 'https://github.com/Thood50',
    bio: 'Im alive',
  },
  {
    name: 'C',
    title: 'Software Developer',
    profile_pic_path: '/images/Fletcher_LaRue_about.jpg',
    twitter_url: '#',
    linkedin_url: 'https://www.linkedin.com/in/fletcher-larue/',
    github_url: 'https://github.com/asdFletcher',
    bio: '',
  },
  {
    name: 'D',
    title: 'Software Developer',
    profile_pic_path: '/images/Fletcher_LaRue_about.jpg',
    twitter_url: '#',
    linkedin_url: 'https://www.linkedin.com/in/fletcher-larue/',
    github_url: 'https://github.com/asdFletcher',
    bio: '',
  }
];

app.get('/about', handleAbout);
// app.get('/', getHome)

function handleAbout(request, response) {

  const shuffledPeople = [];

  while (shuffledPeople.length < 4) {
    // pick a number
    let num = Math.floor(Math.random()*4);

    let included = false;
    // if it exists in the object

    for (let i = 0; i < shuffledPeople.length; i ++){
      if (shuffledPeople[i].name === teamMembers[num].name){
        included = true;
      }
    }

    // dont add them
    if (!included) {
      shuffledPeople.push(teamMembers[num]);
    }

  }
  response.render('about', {teamMembers: shuffledPeople});
}




