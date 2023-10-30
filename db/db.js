//u seedu kreiraj tablicu user , samo email , jer ce trebat provjeravat koji mailovi postoje
const {Pool} = require('pg');
const fs = require("fs");


const pool = new Pool({
    user :"doadmin",
    password: "AVNS_D2lUMcwSa3Yhl0N476U",
    host: "db-postgresql-nyc3-78459-do-user-15014682-0.c.db.ondigitalocean.com",
    port:25061,
    database: "MladiGljivor",
    sslmode:"require",
    ssl: {
        ca: fs.readFileSync('./certif/ca-certificate.crt').toString()
      }
});

const sql_create_users = 
`
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    userId int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ime text NOT NULL , 
    prezime text NOT NULL ,
    email text NOT NULL UNIQUE ,
    brTelefona text NOT NULL UNIQUE,
    datumRod text NOT NULL 

    

);
`;
const sql_create_friendships = 
`
DROP TABLE IF EXISTS friendships;
CREATE TABLE friendships (
    friendshipId int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    posloId int NOT NULL ,
    dobioId int NOT NULL,
    status text NOT NULL

    
    

);
`;

const sql_create_events = 
`
DROP TABLE IF EXISTS events;
CREATE TABLE events (
    eventId int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tip text NOT NULL ,
    sport text NOT NULL,
    grad text NOT NULL,
    vrijeme time NOT NULL,
    datum date NOT NULL,
    mjesto text NOT NULL,
    kolkoLjudi text NOT NULL,
    status text NOT NULL,
    organizatorId int NOT NULL,
    opis text,
    datumNastanka text
    
    

);
`;

const sql_create_events_lists = 
`
DROP TABLE IF EXISTS events_lists;
CREATE TABLE events_lists (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idEvent int NOT NULL,
    idUser int NOT NULL
    
    

);
`;

const sql_create_groups = 
`
DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idUser int NOT NULL,
    ime text NOT NULL
    
    

);
`;
const sql_create_groups_lists = 
`
DROP TABLE IF EXISTS groups_lists;
CREATE TABLE groups_lists (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idGroup int NOT NULL,
    idUser int NOT NULL
    
    

);
`;
const sql_seed_users = `INSERT INTO users (
    ime, prezime, email,brTelefona,datumRod)
    VALUES 
    ('Marko', 'Markić', 'f@gmail.com', '0914488418','nebitno'),
    ('Ivan', 'Štrudla', 'nebitno2', '0955870087','nebitno2'),
    ('Joško', 'Gvardiol', 'nebitno3', '0957371841','nebitno3'),
    ('Velimir', 'Mandić', 'nebitno4', '0997401051','nebitno4'),
    ('Danijel', 'Mrvelj', 'nebitno5', '0997869851','nebitno5'),
    ('Živko', 'Guzić', 'nebitno6', '0994438112','nebitno6'),
    ('Ivica', 'Gulaš', 'ivor.baricevic2@gmail.com', '0988829814','nebitno7'),
    ('Ivor','Baričević','demo@gmail.com','nebitno','irrelenatno')
    
    ;
`;

const sql_seed_friendships = `INSERT INTO friendships (
    posloId,dobioId,status)
    VALUES 
    ('7', '1', 'pending'),
    ('6', '1', 'pending'),
    ('1', '5', 'potvrdeno'),
    ('4', '1', 'potvrdeno'),
    ('8', '1', 'potvrdeno'),
    ('8', '2', 'potvrdeno'),
    ('3', '8', 'pending'),
    ('4', '8', 'pending')

    
    
    
    ;
`;

const sql_seed_events = `INSERT INTO events (
    tip,sport,grad,mjesto,vrijeme,datum,kolkoLjudi,status,organizatorId,opis)
    VALUES 
    ('javni', 'NOGOMET', 'Zagreb','Palinovečka 27','18:00:00','2023-11-20','10','ongoing','7','Ponesite markere'),
    ('javni', 'KOŠARKA', 'Varaždin','Alkoholičarska 17','18:00:00','2023-12-05','5','ongoing','7','Nek neko ponese loptu'),
    ('javni', 'STOLNI TENIS', 'Zagreb','Igrališe OŠ Tin Ujević','18:00:00','2023-11-23','4','ongoing','3','Svako donosi svoj reket'),
    ('javni', 'KOŠARKA', 'Osijek','Igralište u centru','18:00:00','2023-02-12','10','ongoing','3','Nek neko ponese loptu'),
    ('javni', 'NOGOMET', 'Split','Lovrinac Igralište','18:00:00','2023-06-06 ','10','ongoing','8','Nek neko donese balun'),
    ('javni', 'RUKOMET', 'Vukovar','Istarska ulica 17','18:00:00','2023-06-06 ','10','ongoing','10','5 na 5'),
    ('javni', 'STOLNI TENIS', 'Pula','Pulska 12 igralište pored benzinske','18:00:00','2023-02-12','1','ongoing','5','')
    
    
    
    ;
`;

const sql_seed_events_lists = `INSERT INTO events_lists (
    idEvent,idUser)
    VALUES 
    ('1', '1'),
    ('1', '2'),
    ('1', '3'),
    ('1', '4'),
    ('2', '1'),
    ('2', '2'),
    ('2', '3'),
    ('3', '7'),
    ('4', '7'),
    ('4', '8'),
    ('4', '1'),
    ('6', '2'),
    ('6', '3'),
    ('6', '5'),
    ('5', '7'),
    ('5', '7'),
    ('6', '4'),
    ('6', '6')
    
    

    
    
    ;
`;



async function seed() {
await pool.query(sql_create_users,[])
await pool.query(sql_create_friendships,[])
await pool.query(sql_create_events,[])
await pool.query(sql_create_events_lists,[])
//await pool.query(sql_create_groups,[])
//await pool.query(sql_create_groups_lists,[])
await pool.query (sql_seed_users,[])
await pool.query (sql_seed_friendships,[])
await pool.query (sql_seed_events,[])
await pool.query (sql_seed_events_lists,[])
console.log("seed succesfull")




}

const connectToDB = async () => {
    console.log("KRUCINA2")
    try {
      await pool.connect();
    } catch (err) {
      console.log(err);
    }
  };

  connectToDB().then(seed());
module.exports=pool;