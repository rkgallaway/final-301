'use strict';
//dependencies
console.log('hi');
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const fetch = require('node-fetch');
// const cors =  require('cors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

//databse setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));
console.log('~~~~~~~~~~~~');
//set view engine for templating
app.set('view engine', 'ejs');

//showing app where to find resources
app.use(express.static('./public'));
app.use(express.urlencoded( {extended: true} ));

//+++++++++++++++routes+++++++++++++++++++

//route  for home view
app.get('/', getHome)
app.post('/results', getCompanyDomain);

//
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//handler for POST request / searches

// //+++++++++++++++models++++++++++++++++
function Company(info) {
  this.companyName = info
  this.founded = info
  this.size = info
  this.leaders = info
  this.product = info
  this.clients = info
  this.mission = info
  this.contacts = info
  this.location = info
  this.domain = info
  this.log = info
}

// //++++++++++++++helpers+++++++++++++++
// //on page load
function getHome(request, response){
  let SQL = 'SELECT * from savedCompanies;';
  return client.query(SQL)
    .then( (results) => {
      response.render('index', {results: results.rows});
    })
    .catch( (error) => handleError(error) );


  //load savedComppanies
}

// //++++++++++++++++handlers+++++++++++++++++

// //on page load
// function getHome(request, response){
//   let SQL = 'SELECT * from savedCompanies;';
//   return client.query(SQL)
//     .then( (results) => {
//       response.render('/', {showSavedCompanies: results.rows});
//     })
//     .catch( (error) => handleError(error) );
// }

// //error handler
function handleError(err, res){
  console.error(err);
  res.render('error.ejs', {error: 'Error recieved'});
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
function getCompanyInfo(response){ // we passed in trying to find the dmoain we will get
  fetch('https://api.fullcontact.com/v3/company.enrich',{
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FULLCONTACT_API_KEY}` //add to .env
    },
    body: JSON.stringify({
      'domain': response.domain //we added, not sure where it lives yet
    })
  }).then(function(res) {
    return res.json();
  })
    .then(results => response.render('results', {searchResults: results}))
    .catch( (error) => handleError(error) );


}

function getCompanyDomain(request, response){
  console.log('request' + request);
  fetch(`https://company.clearbit.com/v1/domains/find?name=${request}`, { //need to get search results
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.CLEARBIT_API_KEY}` //add to .env
    }

  }).then(function(res) {
    return res.json();
  }).then(function(json) {
    console.log('json: ' + json);
    getCompanyInfo(json);
  })
    .catch( (error) => handleError(error) );


}






// new search

// first we need location optained

// give location to clearbit to get domain name

// use
