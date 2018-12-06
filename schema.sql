DROP TABLE IF EXISTS lastSearched;
DROP TABLE IF EXISTS savedCompanies;

CREATE TABLE lastSearched (
    id SERIAL PRIMARY KEY,
    companyName VARCHAR(255),
    founded VARCHAR(255),
    size VARCHAR(255),
    leaders VARCHAR(255),
    product VARCHAR(255),
    clients VARCHAR(255),
    mission VARCHAR(255),
    contacts VARCHAR(255),
    location VARCHAR(255),
    domain VARCHAR(255),
    logo VARCHAR(255),
    notes VARCHAR(10000)
);

CREATE TABLE savedCompanies (
    id SERIAL PRIMARY KEY,
    companyName VARCHAR(255),
    founded VARCHAR(255),
    size VARCHAR(255),
    leaders VARCHAR(255),
    product VARCHAR(255),
    clients VARCHAR(255),
    mission VARCHAR(255),
    contacts VARCHAR(255),
    location VARCHAR(255),
    domain VARCHAR(255),
    logo VARCHAR(255),
    notes VARCHAR(10000)
);

INSERT INTO savedCompanies (companyName, founded, size, leaders, product, clients, mission, contacts, location, domain, logo, notes)
VALUES('google', '2000', '100', 'leader person', 'search the interwebs', 'everyone', 'to bring knowledge to everyone', 'idk contacts', 'somewhere in cali', 'www.google.com', 'https://placeholder.pics/svg/300', 'I think this company is gonna go under soon');

INSERT INTO savedCompanies (companyName, founded, size, leaders, product, clients, mission, contacts, location, domain, logo, notes)
VALUES('google2', '2002', '102', 'leader person 2', 'search the interwebs 2', 'everyone 2', 'to bring knowledge to everyone 2', 'idk contacts 2', 'somewhere in cali 2', 'www.google.com2', 'https://placeholder.pics/svg/300', 'I think this company is gonna go under soon 2');
