'use strict';
const express = require('express');
var cookieParser = require('cookie-parser')
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')

const app = express();
const fs = require('fs');
const port = 6789;
var listaIntrebari=[];
/*const listaIntrebari = [
  {
    intrebare: 'Tastatura este un dispozitiv periferic de intrare:',
    variante: ['Adevarat', 'Fals'],
    corect: 0
  },
  {
    intrebare: 'Care din următoarele dispozitive periferice sunt dispozitive de intrare?',
    variante: ['Mouse', 'Monitor','Imprimanta','Boxe'],
    corect: 0
  },
  {
    intrebare: 'Monitorul este un dispozitiv periferic de ieșire',
    variante: ['Adevarat', 'Fals'],
    corect: 0
   
  },
  {
    intrebare: 'Dispozitivele de intrare sunt acele dispozitive cu ajutorul cărora',
    variante: ['calculatorul transmite informații către utilizator', 'utilizatorul transmite comenzi către calculator','utilizatorul se conectează la internet','calculatorul funcționează normal'],
    corect: 1
   
  },
  {
    intrebare: 'Calculatorul este un ansamblu de:',
    variante: ['componente hardware', 'componente software','componente hardware și software','componente electronice'],
    corect: 2
   
  },
  {
    intrebare: 'HardDisk-ul, cardul de memorie, CD-ul, memory stick-ul sunt',
    variante: ['dispozitive de stocare magnetice', 'dispozitive de stocare','dispozitive de stocare optice','dispozitive de stocare electronice'],
    corect: 1
   
  },

  

  //...
];




*/
// directorul 'views' va conține fișierele .ejs (html + js executat la server)


app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'));
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
app.get('/', (req, res) => res.render('index',{utilizator:req.cookies["utilizator"]}));
app.get('/autentificare', (req, res) => res.render('autentificare',{mesajEroare:req.cookies["mesajEroare"]}));
// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția specificată

//app.get('/autentificare', (req, res) => res.render('autentificare'));


app.get('/chestionar', (req, res) => {

  fs.readFile('views/intrebari.json', (err, data) => {
    //if (err) throw err;
    listaIntrebari = JSON.parse(data);
    //console.log(listaIntrebari);
    res.render('chestionar', {intrebari: listaIntrebari});
});




	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări

 
});




app.post('/verificare-autentificare', (req, res) => {
  let json=JSON.stringify(req.body);
  var a =JSON.parse(json);
  console.log(a.uname);
  if(a.uname=='Utilizator' && a.psw=='parola')
  {
    res.cookie("utilizator",a.uname);
    res.redirect('/');
   console.log("aici");
  }
  else
  {
    res.cookie("mesajEroare","Autentificare eronata");
    res.redirect('/autentificare');
    console.log("nu");
  }
  //console.log(req.body);
 // res.json(req.body);
});


app.post('/rezultat-chestionar', (req, res) => {
  let json=JSON.stringify(req.body);
 
  var a =JSON.parse(json);
  var b=0;
  
  for(let i=0;i<listaIntrebari.length;i++)
  {


    if(a["q "+i]==listaIntrebari[i].corect)
      b++;
    
  }
  console.log(b);
  res.render('rezultat-chestionar',{intrebari: listaIntrebari,Raspunsuri_corecte:b});
});
 


app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));