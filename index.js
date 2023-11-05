const mailoviIkodovi = new Map();
const db = require("./db/db");
const express = require("express");
const app = express();
const port = 8080;
var randomize = require('randomatic');
const nodemailer = require("nodemailer");
var cors = require('cors')
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cors())
var mydate = require('current-date');




const smtpTransport = require('nodemailer-smtp-transport');
const currentDate = require("current-date");


        var transporter = nodemailer.createTransport(smtpTransport({
          host: 'smtp.zoho.eu',
          port: 465,
      
        secure: true,
         auth: {
        user: 'support@terminihr.com',
        pass: "BXy5rFPd2sZw"
    }
 }));

  


 app.get('/books', (req, res) => {
  res.json({"staje":"mali"});
  console.log("kurcina")
});

app.get('/books2', (req, res) => {
  res.json({"staje":"mali"});
  console.log("kurcina")
});
    
//napravi terminihr gmail i napravi korake koji si morao za svoj mail https://miracleio.me/snippets/use-gmail-with-nodemailer/
app.post("/sendEmail", function (req, res) {
  try{
  var kod = randomize("0",5)
  var email=req.body.email
  mailoviIkodovi.set(email,kod)
  const mailOptions = {
    from: 'support@terminihr.com',
    to: email,
    subject: 'Evo kod brate',
    html: "<div>Tvoj kod je </div> <p style='font-weight:bold;font-size:30px'>" +kod+ "</p>"
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
   console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      console.log(mailoviIkodovi)
    }
  });
  console.log(req.body)}
  catch(err) {
    console.log(err)
  }
});

app.post("/verifyCode", async function (req, res) {
  try{
  var email = req.body.email;
  var kod = mailoviIkodovi.get(email);
  var sentKod = req.body.code;
  console.log(kod, sentKod, email, req.body);
  console.log("kuracverify");

  try {
    if(email.toLowerCase()==="demo@gmail.com" && sentKod==="12345") {
      mailoviIkodovi.delete(email);
      return res.status(202).json("Success");

    }
   
  

    if (kod === sentKod) {
     
      const loginStatus = await checkMail(req.body.email);

    

      if (loginStatus) {
        console.log("login succeeded i user postoji");
        mailoviIkodovi.delete(email);
        return res.status(202).json(loginStatus);
      } else {
        console.log("login succeeded");
        mailoviIkodovi.delete(email);
        return res.status(200).json("Success");
      }
    } else {
      console.log("login failed");
      return res.status(401).send("Failed");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal server error" });
  } }

  catch(err) {
    console.log(err)
  }
});


async function checkMail(email) {
  try {
  var text = "select * from users where email=$1"
  //var text2=" select * from users where brTelefona=$1"
  var values=[email]
  //var values2=[brTelefona]

  var odg=await db.query(text,values)
  //var odg2=db.query(text2,values2)

 

  if(odg.rows.length>0){
    
    return {"err":"Email je vec u uporabi!"}}

  return undefined}

  catch(err) {

    console.log(err)
  }


}

app.get("/checkMail/:email",(req,res)=> {
  try{
  checkMail(req.params.email).then(odg=>{
    if(odg){
      console.log("500")
    res.status(500).end()}
    else{
      console.log("200")
    res.status(200).end()}
  })}
  catch(err) {

  }


})


async function checkBr(brTelefona) {

  try{
  
  var text2=" select * from users where brTelefona=$1"
  
  var values2=[brTelefona]

  
  var odg2=await db.query(text2,values2)


  if(odg2.rows.length>0)
    return {"err":"Broj se vec koristi!"}

  return undefined}

  catch(err) {

  }


}

 async function registriraj(body) {

  try{
   
  var email=body.email
  var ime = body.ime
  var prezime= body.prezime 
  var brTelefona = body.brTelefona.replace(/\s+/g,'')
  var datumRod = body.datumRod
  console.log(email,ime,prezime,datumRod)
 
  const text="INSERT INTO USERS(ime,prezime,email,brTelefona,datumRod) VALUES ($1,$2,$3,$4,$5) RETURNING *"
  const values = [ime,prezime,email,brTelefona,datumRod]
  const odg=await db.query(text,values)
  return odg.rows[0]
  }
  catch(err) {

  }

}



app.post("/regUser",function(req,res){
  try{
  console.log("regUser")
  var emailErr= false;
  var brErr = false
    if(req.body.email===undefined || req.body.ime===undefined || req.body.prezime===undefined || req.body.brTelefona===undefined || req.body.datumRod===undefined){
          res.json({"err":"nista ne smije bit null"})
          console.log("regUser ima null")
          return}
  

        else{
          checkBr(req.body.brTelefona).then(err2=>{
            if(err2){
            console.log("regUser postojeci Broj")
            return res.status(500).json(err2)}
            else{
            registriraj(req.body).then(user=>res.json(user))
            console.log("user regged")}
          })

        }
      
      }



      catch(err) {

      }
     
    })


async function createEvent(body) {

  try{
   
  var tip=body.tip
  var sport=body.sport
  var grad = body.grad
  var mjesto= body.mjesto 
  var vrijeme = body.vrijeme
  var opis=body.opis
  var datum = body.datum
  var kolkoLjudi = body.brojLjudi
  var status = body.status
  var organizerEmail = body.email
  var datumNastanka=mydate()
  console.log(datum +" JE DATUM NASTANKA")
 
  const text1="Select userid from  USERS where users.email=$1  "
  const values1 = [organizerEmail]
  const odg=await db.query(text1,values1)
  const userid=odg.rows[0].userid
  const text="INSERT INTO events(tip,grad,mjesto,vrijeme,datum,kolkoLjudi,status,organizatorId,sport,opis,datumNastanka) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *"
  const values = [tip,grad,mjesto,vrijeme,datum,kolkoLjudi,status,userid,sport,opis,datumNastanka]
  const odg2=await db.query(text,values)
  return odg2 }
  catch(err) {

  }

}

app.post("/createEvent",function(req,res){
  try{


  createEvent(req.body).then(odg=>res.json(odg))
  }
  catch(err) {

  }




})

async function joinEvent(body) {
   try {
  var email=body.email
  var eventid= body.id
  
  console.log(email,eventid)
 
  const text1="Select userid from  USERS where users.email=$1  "
  const values1 = [email]
  const odg=await db.query(text1,values1)
  const userid=odg.rows[0].userid
  const text2="INSERT INTO events_lists(idEvent,idUser) VALUES($1,$2) RETURNING *"
  const values2 = [eventid,userid]
  await db.query(text2,values2)}
  catch(err) {

  }


}

app.post("/joinEvent",function(req,res){

  try{

  joinEvent(req.body)
  }

  catch(err) {

  }




})

async function unJoinEvent(body) {
  try{
   
  var email=body.email
  var eventid= body.id
  
  console.log("remove",email,eventid)
 
  const text1="Select userId from  USERS where users.email=$1  "
  const values1 = [email]
  const odg=await db.query(text1,values1)
  const userid=odg.rows[0].userid
  const text2="DELETE FROM events_lists where idUser=$2 and idEvent = $1"
  const values2 = [eventid,userid]
  await db.query(text2,values2)
  }

  catch(err) {

  }

}

app.post("/unJoinEvent",function(req,res){

  try  {
  console.log("hit")

  unJoinEvent(req.body)
  }
  catch(err) {

  }




})

//U BAZU DODAJE TKO JE POSLO, TKO JE DOBIO I JEL PENDING ILI POTVRDEN
async function dodajFrenda(body) {
  try{
   //POKUSAJ SVE ISPRVE NE OVAK JER NEMA MAILA U BAZI
  var email=body.email
  var dobioId= body.userid
  
  console.log(email,dobioId)

  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  const posloId=odg.rows[0].userid
 // console.log(userid)

  //console.log("userid",userid)
  //console.log("idFrend",idFrend)
  //console.log(userid,"je userid")
  const text2="INSERT INTO FRIENDSHIPS(posloId,dobioId,status) VALUES($1,$2,$3) RETURNING *"
 
  const values2 = [posloId,dobioId,"pending"]
  
  await db.query(text2,values2)}

  catch(err) {

  }
  


}

app.post("/dodajFrenda",function(req,res){

  try{

  
  dodajFrenda(req.body) }

  catch(err)
 {

 }




})

async function potvrdiFrenda(body) {
  try{
   
  var id= body.friendshipid

  console.log(id)
  

 
  

  const text2="UPDATE FRIENDSHIPS  set status='potvrdeno' where friendshipId=$1"
  const values2 = [id]
 
  await db.query(text2,values2)
  
  console.log("potvrdeno")}

  catch(err) {

  }


}
app.post("/potvrdiFrenda",function(req,res){

  try{

  potvrdiFrenda(req.body)
  }

  catch(err) {

  }





})

async function makniReq(body) {

  try{
   
  
  var id= body.friendshipid
  

 
  

  const text2="Delete from friendships where friendshipid=$1;"
  const values2 = [id]
  
  await db.query(text2,values2)
  
  console.log("obrisano") }

  catch(err) {

  }


}

app.post("/makniReq",function(req,res){
  try{

  makniReq(req.body)
  }
  catch(err) {
  }
  





})

async function deleteFrend(body) {

  try {
   
  
  var id= body.friendshipid
  
  console.log(id)
 
  

  const text2="Delete from friendships where friendshipid=$1;"
  const values2 = [id]
  await db.query(text2,values2)
 
  console.log("obrisano")}


  catch(err) {

  }


}

app.post("/deletefrend",function(req,res){

  try{


  deleteFrend(req.body)
  }
  catch(err) {

  }
  





})


async function nadiPrivatneObjave(frendid,userid) {

  try{
  const text = "Select events.eventId as eventId,* ,(select count (*) from events_lists where events_lists.idEvent=events.eventId)as br from events JOIN users on events.organizatorId=users.userId where events.organizatorId=$1 and $3 not in (select idUser from events_lists where events_lists.idEvent=events.eventId) and events.tip=$2 and (events.datum>CURRENT_DATE or (events.datum=CURRENT_DATE and events.vrijeme>CURRENT_TIME))"
  const values=[frendid,"privatni",userid]
  const odg=await db.query(text,values)
  //console.log("privatni",odg.rows)
  termini=odg.rows
  const formattedArray = termini.map((obj) => ({
    ...obj, // Copy all properties from the original object
    datum: formatDateString(obj.datum), // Format the Date property
  }));

console.log("PRIVATNI EVENTI PRIJE FILTRIRANJA")
  console.log(formattedArray)

  const filteredArray = formattedArray.filter((obj)=>{
   return parseInt(obj.kolkoljudi)>parseInt(obj.br)
  })
  console.log("PRIVANTI EVENTI NAKON FILTRIRANJA")

  console.log(filteredArray)
  
  return filteredArray}

  catch(err) {

  }
  
}

async function nadiJavneObjave(id) { 
  try{
  const text = "Select events.eventId as eventId,*,(select count (*) from events_lists where events_lists.idEvent=events.eventId)as br from events JOIN users on events.organizatorId=users.userId where events.tip=$1 and events.organizatorId!=$2 and $2 not in (select idUser from events_lists where events_lists.idEvent=events.eventId) and (events.datum>CURRENT_DATE or (events.datum=CURRENT_DATE and events.vrijeme>CURRENT_TIME));"
  const values=["javni",id]
  const odg=await db.query(text,values)
 // console.log("javni",odg.rows)
  termini= odg.rows;
  const formattedArray = termini.map((obj) => ({
    ...obj, // Copy all properties from the original object
    datum: formatDateString(obj.datum), // Format the Date property
  }));
  console.log("JAVNI EVENTI PRIJE FILTIRIRANJA")
console.log(formattedArray)

const filteredArray = formattedArray.filter((obj)=>{
 return parseInt(obj.kolkoljudi)>parseInt(obj.br)
 })
 console.log("JAVNI EVENTI NAKON FILTRIRANJA")
 console.log(filteredArray)
  
  return filteredArray 

  }

  catch(err) {

  }
}




async function getFeed(email) {
  try{
  console.log("MAILCINA JE "+email)
  const text1="Select userId from  USERS where users.email=$1  "
  const values1 = [email]
  const odg=await db.query(text1,values1)
  const userid=odg.rows[0].userid
  
  const text2="Select dobioId as Id from FRIENDSHIPS where posloId=$1 and status=$2 UNION Select posloId as Id from FRIENDSHIPS where dobioId=$1 and status=$2  "
  const values2=[userid,"potvrdeno"]
  const odg2=await db.query(text2,values2)
  
  const frendovi=odg2.rows

  
  const objave = []

  console.log("BROJ FRENDOVA JE "+frendovi.length)
  
for(let i  =0;i<frendovi.length;i++) {
    nadiPrivatneObjave(frendovi[i].id,userid).then(stupci=>{if(stupci) for(let i = 0;i<stupci.length;i++){objave.push(stupci[i])}})
  }
  await nadiJavneObjave(userid).then(stupci=>{if(stupci)for(let i = 0;i<stupci.length;i++){objave.push(stupci[i])}})
  
  return objave; }
  catch(err) {

  }
}

app.get("/feed/:email",function(req,res) {
  try{
  const email=req.params.email
  getFeed(email).then((objave)=>res.json(objave))
  }
  catch(err) {

  }
  

})

async function getUserSaBrojem(br) {
  if(br.startsWith("095"))
  console.log(br)
  try{
  const text = "Select * from users where brTelefona=$1"
  const values=[br]
  const odg= await db.query(text,values)
  
  if(odg.rows)
    return odg.rows[0]
    else
    return undefined

  }
  catch(err) {

  }
}

app.get("/userSaBrojem/:br",function(req,res) {
  try{
  const br=req.params.br
  
  getUserSaBrojem(br).then((user)=>{
    if(user)
    res.status(200).json(user)
    else
    res.status(500).json({"err":"nema ga"})
  
  })
  

  }
  catch(err) {

  }

})

async function getUserFrendovi(email) {
  try {
  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  const userid=odg.rows[0].userid

  const text="select * from users join friendships on users.userId=friendships.posloId where friendships.dobioId=$1 and friendships.status=$2 UNION select * from users join friendships on users.userId=friendships.dobioId where friendships.posloId=$1 and friendships.status=$2"
  const values=[userid,"potvrdeno"]
  const frendoviOdg=await db.query(text,values)
  const frendovi=frendoviOdg.rows
  return frendovi}
  catch(err) {

  }
}

app.get("/userFrendovi/:email",function(req,res) {
  try{
  const email=req.params.email
  
  getUserFrendovi(email).then((frendovi)=>{
    console.log("kurcinaa")
    console.log(frendovi)
   res.status(200).json(frendovi)
  
  }) }

  catch(err) {

  }
  

})
//VRACA PODATKE O USERIMA KOJI SU MI POSLALI ZAHTJEVE
async function getUserReqs(email) {
  try{
  const text1="Select * from USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)
  
  const userid=odg.rows[0].userid
  console.log(userid)

  const text="select * from users join friendships on users.userId=friendships.posloId where friendships.dobioId=$1 and friendships.status=$2"
  const values=[userid,"pending"]
  const frendoviOdg=await db.query(text,values)
  const frendovi=frendoviOdg.rows
  return frendovi}
  catch(err) {

  }
}

app.get("/userReqs/:email",function(req,res) {
  try {
  const email=req.params.email
  
  getUserReqs(email).then((frendovi)=>{
    console.log(frendovi)
   res.status(200).json(frendovi)
  
  })
}
catch(err) {

}

})


async function traziUsere(input,email) {
  try{
  const text2="Select * from  USERS where users.email=$1;"
  const values2 = [email]
  const odg2=await db.query(text2,values2)

  const userid=odg2.rows[0].userid
  console.log(email)
  var input2=input.trim().toLowerCase()
  const searchTerms = input2.split(' ');

  console.log(input2)
  
  var text = "SELECT CASE WHEN users.userid IN (SELECT posloId FROM friendships WHERE friendships.dobioId = $2 AND friendships.status = $4 UNION SELECT dobioId FROM friendships WHERE friendships.posloId = $2 AND friendships.status = $4) THEN 'true' ELSE 'false' END AS pending, *, CASE WHEN users.userid IN (SELECT posloId FROM friendships WHERE friendships.dobioId = $2 AND friendships.status = $3 UNION SELECT dobioId FROM friendships WHERE friendships.posloId = $2 AND friendships.status = $3) THEN 'true' ELSE 'false' END AS friends FROM USERS WHERE (LOWER(ime) LIKE ANY($1) OR LOWER(prezime) LIKE ANY($1) OR (CONCAT(LOWER(ime), LOWER(prezime)) LIKE ANY($1))) AND users.userid != $2;"
  
  
    const values=[searchTerms,userid,"potvrdeno","pending"]
    const odg=await db.query(text,values)
    
    return odg.rows
  }
  
  catch(err) {

  }
  
}

app.get("/traziUsere/:input/:email",function(req,res){
  try{

    
  traziUsere(req.params.input,req.params.email).then((useri)=>{
    console.log(useri)
   res.status(200).json(useri)
  
  })
  }
  catch(err) {

  }


})

async function deleteEvent(eventId) {
  try{
  const text2="DELETE from  EVENTS where EVENTS.eventId=$1;"
  const values2 = [eventId]
  const odg2 = await db.query(text2,values2)

  return null}
  catch(err) {

  }

}

app.get("/deleteEvent/:eventid",function(req,res){
  try{

  deleteEvent(req.params.eventid).then((re)=>{
    console.log(re)
   res.status(200).json("Succ")
  
  })}

  catch(err) {

  }



})



  


async function getTerminiUKojimaSudjelujem(email) {

  try{

  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  const userid=odg.rows[0].userid

  const text="Select events.eventId as eventId,*,(select count (*) from events_lists where events_lists.idEvent=events.eventId)as br from events join events_lists  on events.eventId=events_lists.idEvent join users on users.userId=events.organizatorId where events_lists.idUser=$1 and  (events.datum>CURRENT_DATE or (events.datum=CURRENT_DATE and events.vrijeme>CURRENT_TIME))"
  const values=[userid]
  const terminiOdg=await db.query(text,values)
  const termini=terminiOdg.rows
  const formattedArray = termini.map((obj) => ({
    ...obj, // Copy all properties from the original object
    datum: formatDateString(obj.datum), // Format the Date property
  }));

  
  return formattedArray}

  catch(err) {

  }
  
}

app.get("/terminiUKojimaSudjelujem/:email",function(req,res){
  try{

getTerminiUKojimaSudjelujem(req.params.email).then((termini)=>{
    console.log(termini)
   res.setHeader('Cache-Control', 'no-store');
   res.status(200).json(termini)
  
  })
  
  }

catch(err) {

}


})

function formatDateString(date) {
  const options = {
    timeZone: "Europe/Belgrade", // CET timezone
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return date.toLocaleString("en-US", options);
}

async function getTerminiKojeOrganiziram(email) {

  try{

  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  const userid=odg.rows[0].userid

  //const text2 = "Select *, CURRENT_TIME as timeboy from events where events.datum=CURRENT_DATE and events.organizatorId=$1"
  const text="Select events.datum  as realdatum ,events.eventId as eventId,*,(select count (*) from events_lists where events_lists.idEvent=events.eventId)as br from events join users on events.organizatorId=users.userId where events.organizatorId=$1 and  (events.datum>CURRENT_DATE or (events.datum=CURRENT_DATE and events.vrijeme>CURRENT_TIME))"
  const values=[userid]
  const terminiOdg=await db.query(text,values)
  const termini=terminiOdg.rows
 

  //const testOdg = await db.query(text2,values)
  console.log("-------------------------------------------------------------------------------------")
  
  console.log("--------------------------------------------------------------------------------")

  const formattedArray = termini.map((obj) => ({
    ...obj, // Copy all properties from the original object
    datum: formatDateString(obj.datum), // Format the Date property
  }));

  
  return formattedArray}

  catch(error) {

  }
  
}

app.get("/terminiKojeOrganiziram/:email",function(req,res){

  try{
getTerminiKojeOrganiziram(req.params.email).then((termini)=>{
    res.setHeader('Cache-Control', 'no-store');
    console.log(termini)
   res.status(200).json(termini)
  
  })
}

catch(err) {

}
  





})

async function getTerminiKojeOrganiziramProsli(email) {

  try{

  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  

  const userid=odg.rows[0].userid

  const text="Select events.eventId as eventId,*,(select count (*) from events_lists where events_lists.idEvent=events.eventId)as br from events join users on events.organizatorId=users.userId where events.organizatorId=$1 and  (events.datum<CURRENT_DATE or (events.datum=CURRENT_DATE and events.vrijeme<CURRENT_TIME))"
  const values=[userid]
  const terminiOdg=await db.query(text,values)
  const termini=terminiOdg.rows
  //console.log("TERMINI KOJE SAM ORGANIZIRAO A PROSLI SU : " +termini)
  const formattedArray = termini.map((obj) => ({
    ...obj, // Copy all properties from the original object
    datum: formatDateString(obj.datum), // Format the Date property
  }));

  
  return formattedArray
}

catch(error) {

}
}

app.get("/terminiKojeOrganiziramProsli/:email",function(req,res){

  try{

getTerminiKojeOrganiziramProsli(req.params.email).then((termini)=>{
    console.log(termini)
   res.status(200).json(termini)
  
  })
  
  }
catch(error) {

}



})

app.get("/deleteAcc/:email",function(req,res){

  try{

deleteAcc(req.params.email).then((acc)=>{
    console.log(acc)
   res.status(200).json(acc)
  
  })
  
  }
catch(error) {

}



})

async function deleteAcc(email) {

  

}

async function getTerminiUKojimaSamSudjelovao(email) {

  try{

  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  const userid=odg.rows[0].userid

  const text="Select events.eventId as eventId,*,(select count (*) from events_lists where events_lists.idEvent=events.eventId)as br from events join events_lists  on events.eventId=events_lists.idEvent join users on users.userId=events.organizatorId where events_lists.idUser=$1 and  (events.datum<CURRENT_DATE or (events.datum=CURRENT_DATE and events.vrijeme<CURRENT_TIME))"
  const values=[userid]
  const terminiOdg=await db.query(text,values)
  const termini=terminiOdg.rows
  const formattedArray = termini.map((obj) => ({
    ...obj, // Copy all properties from the original object
    datum: formatDateString(obj.datum), // Format the Date property
  }));

  
  return formattedArray}

  catch(error) {

  }
  
}

app.get("/terminiUKojimaSamSudjelovao/:email",function(req,res){

  try{

getTerminiUKojimaSamSudjelovao(req.params.email).then((termini)=>{
    console.log(termini)
   res.status(200).json(termini)
  
  })
  
}

catch(erroor) {

}





})

async function getDetalji(id,email) {

  try{
  const text2="Select * from  USERS where users.email=$1;"
  const values2 = [email]
  const odg2=await db.query(text2,values2)

  const userid=odg2.rows[0].userid

  const text1="Select events.eventId as eventid,*,(select count (*) from events_lists where events_lists.idEvent=events.eventId)as br from  events join users on events.organizatorid=users.userId where events.eventId=$1;"
  const values1 = [id]
  const odg=await db.query(text1,values1)

  const eventInfo=odg.rows[0]

  const text="select *,CASE when exists (select dobioId  from friendships where friendships.posloId=$2 and friendships.dobioId=users.userid and friendships.status=$4 UNION select posloId from friendships where friendships.dobioId=$2 and friendships.posloId=users.userid and friendships.status=$4  ) then 'true' else 'false' end as pending ,CASE when exists (select dobioId from friendships where friendships.posloId=$2 and friendships.dobioId=users.userid and friendships.status=$3 UNION select posloId from friendships where friendships.dobioId=$2 and friendships.posloId=users.userid and friendships.status=$3 ) then 'true' else 'false' end as frend from events_lists join users  on events_lists.idUser=users.userid  where events_lists.idEvent=$1"
  const values=[id,userid,"potvrdeno","pending"]
  
  const sudioniciOdg=await db.query(text,values)
  const sudionici=sudioniciOdg.rows
  eventInfo.datum=formatDateString(eventInfo.datum)
  const info={sudionici,eventInfo}
  return info
  }

  catch(error) {

  }
}

app.get("/detalji/:id/:email",function(req,res){

  try{

  getDetalji(req.params.id,req.params.email).then((termini)=>{
      console.log("TERMINIU SU " +termini)
     res.status(200).json(termini)
    
    })
    
  }
  catch(error) {

  }
  
  
  
  
  })

  async function editOpis(eventid,opis){

    try{
    console.log("editOpis")
    console.log(eventid,opis)
    const text="UPDATE EVENTS  set opis=$2 where eventId=$1;"
    const values=[eventid,opis]
    
   await db.query(text,values)
    }
    catch(err) {

    }


  }
  

  app.post("/editOpis",function(req,res){

    try {

    editOpis(req.body.eventid,req.body.opis)

    }
    catch(error) {

    }
      
    
    
    
    
    
    })


    async function editInfo(body){

      try{
      console.log(body)
      const datum = formatDateString(body.datum)
      console.log(body.datum)
      console.log(datum)

      const text="UPDATE EVENTS set vrijeme=$2 ,datum=$3,tip=$4,sport=$5,grad=$6 ,mjesto=$7,kolkoLjudi=$8  where eventId=$1;"
      const values=[body.eventid,body.vrijeme,datum,body.tip,body.sport,body.grad,body.mjesto,body.brojLjudi]
      
     await db.query(text,values)
      }

      catch(err) {

      }
  
    }
    
  
    app.post("/editInfo",function(req,res){

      try{
  
      editInfo(req.body)
      }
      catch(err) {

      }
      
      
      
      
      
      })

      async function getBr(eventid) {

        try{

       
        const text="select eventId,(select count (*) from events_lists where events_lists.idEvent=events.eventId)as br  from events where eventId=$1"
        const values=[eventid]
        const odg=await db.query(text,values)
      
        const br=odg.rows[0].br

        return br;}

        catch(err) {

        }


      }


      app.get("/getBr/:id",function(req,res){


        try{
        getBr(req.params.id).then((br)=>
        { console.log(br)
          res.status(200).json(br)
        })
      }
      catch(err) {
        
      }
        
        
        
        
        
        })


       // server.listen(httpsport, () => {
         // console.log(`Server is running on https://your_domain:${httpsport}`);
        //});




app.listen(port, function () {
  console.log(`app listening on port ${port}!`);
});
