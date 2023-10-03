//u seedu kreiraj tablicu user , samo email , jer ce trebat provjeravat koji mailovi postoje
const {Pool} = require('pg');


const pool = new Pool({
    user: 'postgres',
    host: 'database-2.cyhhgrwp0mi2.eu-central-1.rds.amazonaws.com',
    database: 'Termini',
    password: 'Ivor22c1_2',
    port: 5432,
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
    ('Filip', 'Penzar', 'f@gmail.com', '0914488418','nebitno'),
    ('Noa', 'Menzar', 'nebitno2', '0955870087','nebitno2'),
    ('David', 'Ljubić', 'nebitno3', '0957371841','nebitno3'),
    ('Nino', 'Vukasovic', 'nebitno4', '0997401051','nebitno4'),
    ('Duje', 'Vukasovic', 'nebitno5', '0997869851','nebitno5'),
    ('Tvrle', 'Balic', 'nebitno6', '0994438112','nebitno6'),
    ('Ivor', 'Baričević', 'ivor.baricevic2@gmail.com', '0988829814','nebitno7'),
    ('Dear Google Review','Team','demo@gmail.com','nebitno','irrelenatno')
    
    ;
`;

const sql_seed_friendships = `INSERT INTO friendships (
    posloId,dobioId,status)
    VALUES 
    ('7', '1', 'pending'),
    ('6', '1', 'pending'),
    ('1', '5', 'potvrdeno'),
    ('4', '1', 'potvrdeno')

    
    
    
    ;
`;

const sql_seed_events = `INSERT INTO events (
    tip,sport,grad,mjesto,vrijeme,datum,kolkoLjudi,status,organizatorId,opis)
    VALUES 
    ('javni', 'NOGOMET', 'Zagreb','Palinovecka 27','18:00:00','2024-02-20','10','ongoing','7','ponesite markere'),
    ('javni', 'RRUKOMET', 'Varazdin','Palinovecka 227','18:00:00','1945-12-05','114','ongoing','7','ponesite markere opet'),
    ('privatni', 'STOLNI TENIS', 'Osijek','Palinovecka 27','18:00:00','2023-02-23','10','ongoing','3','ponesite markere'),
    ('privatni', 'STOLNI TENIS', 'Osijek','Palinovecka 27','18:00:00','2023-02-12','10','ongoing','3','ponesite markere'),
    ('javni', 'NOGOMET', 'Split','Palinovecka 27adadad2d2425e','18:00:00','2145-06-06 ','10','ongoing','6','ponesite markereremfnsubiabfaufbafiubaubfabfiubafbafibaue'),
    ('javni', 'RUKOMET', 'Vukovar','Palinovecka 27','18:00:00','2145-06-06 ','10','ongoing','6','ponesite markerenbaiufafbbfaifabfiafaibfaifafubsidrzbvievsjvbkbdjvbjdajbkvjdjbvdbjvdakkjbvdjbvdajbvkdajbvdajkvdakjbvdajbvdakjbvdajbvdajbvdakjbvdabkjvdjbvdakjbvd'),
    ('privatni', 'STOLNI TENIS', 'Osijek','Palinovecka 27','18:00:00','2023-02-12','10','ongoing','5','ponesite markere')
    
    
    
    ;
`;

const sql_seed_events_lists = `INSERT INTO events_lists (
    idEvent,idUser)
    VALUES 
    ('1', '1'),
    ('2', '1'),
    ('2', '2'),
    ('2', '3'),

    ('3', '7'),
    ('4', '7'),
    ('6', '2'),
    ('6', '3'),
    ('6', '5')
    
    

    
    
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