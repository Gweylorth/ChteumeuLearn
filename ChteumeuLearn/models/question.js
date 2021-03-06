var data = require('../lib/data');
var questionSchema = new data.Schema({
  domain: String,
  question: String,
  answers: [String],
  correct: Number
})
var Question = data.mongoose.model('Question', questionSchema);


var question1 = 
{
  id: 0,
  domain: "HTML5",
  question: "Que signifie HTML ?",
  answers: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"],
  correct: 0
};

var question2 = 
{
  id: 1,
  domain: "HTML5",
  question: "Qui définit les standards du Web ?",
  answers: ["Mozilla", "Google", "Le World Wide Web Consortium", "Microsoft"],
  correct: 2
};

var question3 = 
{
  id: 2,
  domain: "HTML5",
  question: "Choisissez la bonne balise HTML pour le plus grand titre :",
  answers: ["<head>", "<h1>", "<h6>", "<heading>"],
  correct: 1
};

var question4 = 
{
  id: 3,
  domain: "HTML5",
  question: "Lequel de ces doctypes est correct en HTML5?",
  answers: ["<!DOCTYPE html>", "<!DOCTYPE HTML5>", "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 5.0//EN http://www.w3.org/TR/html5/strict.dtd>"],
  correct: 0
};

var question5 = 
{
  id: 4,
  domain: "HTML5",
  question: "Quel élément HTML5 spécifie un pied-de-page pour un document ou une section ?",
  answers: ["<footer>", "<section>", "<bottom>"],
  correct: 0
};

var question6 = 
{
  id: 5,
  domain: "CSS3",
  question: "Que signifie CSS ?",
  answers: ["Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets", "Creative Style Sheets"],
  correct: 0
};

var question7 = 
{
  id: 6,
  domain: "CSS3",
  question: "Où doit on placer, dans un document HTML, la référence vers une feuille de style externe ?",
  answers: ["Dans la section <body>", "En haut du document", "Dans la section <head>", "À la fin du document"],
  correct: 2
};

var question8 = 
{
  id: 7,
  domain: "CSS3",
  question: "Laquelle de ces syntaxes est correcte en CSS ?",
  answers: ["body:color=black;", "{body;color:black;}", "{body:color=black;}", "body {color: black;}"],
  correct: 3
};

var question9 = 
{
  id: 8,
  domain: "JavaScript",
  question: "Un script externe JavaScript doit contenir la balise script :",
  answers: ["Faux", "Vrai"],
  correct: 0
};

var question10 = 
{
  id: 9,
  domain: "JavaScript",
  question: "Comment écrire le message 'Hello World' dans une fenêtre d'alerte ?",
  answers: ["msgBox('Hello World');", "alert('Hello World');", "msg('Hello World');", "alertBox('Hello World');"],
  correct: 1
};

// Untouched data
var originalData = [question1, 
question2,
question3, 
question4, 
question5, 
question6, 
question7, 
question8, 
question9, 
question10];

// Data restricted to given domains
//var data = originalData;

exports.addQuestion =function (question, answers,correct,domain, callback) {
  var instance = new Question();
  instance.question = question;
  instance.answers = answers;
  instance.correct = correct;
  instance.domain = domain;

  instance.save(function (err) {
  if (err) {
      callback(err);
  }
  else {
      callback(null, instance);
  }
  }); 
}

function addNewQuestion(array,i,callback){
  if(array.length != 0){
  }
  else{
    var instance = new Question();
    instance.question = originalData[i].question;
    instance.answers = originalData[i].answers;
    instance.correct = originalData[i].correct;
    instance.domain = originalData[i].domain;

    instance.save(function (err) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, instance);
      }
    }); 
  }
}

function searchQuestion(questionSearch,callback){
  Question.find({question:questionSearch.question},function(err,docs){
      callback(docs);
  });
}

exports.addAllQuestions = function addAllQuestions(i){
  if(i < originalData.length) {
    searchQuestion(originalData[i],function(docs){
      addNewQuestion(docs,i,function(){});
      addAllQuestions(i+1);
    });
  }
  else{
    return;
  }
}
// Trouve l'index d'une question dans un tableau selon son id
function findIndex(questions, id) {
    for (var i = questions.length - 1; i >= 0; i--) {
        if (questions[i].id == id) {
            return i;
        }
    };

    return -1;
}

// Rend les questions propres a un seul domaine
function pickDomain(domain) {
    var domainQuestions = [];
    for (var i = originalData.length - 1; i >= 0; i--) {
        if (originalData[i].domain == domain) {
            domainQuestions.push(originalData[i]);
        }
    };
    return domainQuestions;
}

// Restreint les questions aux domaines specifies
exports.restrictDomains = function(domains) {
    data = [];
    for (var i = domains.length - 1; i >= 0; i--) {
        data.concat(pickDomain(domains[i]));
    };
}

function findDomains(selectedDomains,maxQuestions,callback){
  var questions = [];
  if(typeof(selectedDomains) != 'string'){
    Question.find({domain:{$in: selectedDomains}},function(err,docs){
    var remove = (docs.length-maxQuestions);
    for(var i = 0;i<remove;i++){
      var randPick = Math.floor(Math.random()* docs.length);
      questions[i] = docs[randPick];
      docs.splice(randPick,1);      
    }
    callback(questions);
    });
  }
  else{
    Question.find({domain:selectedDomains},function(err,docs){
    var remove = (docs.length-maxQuestions);
    for(var i = 0;i<remove;i++){
      var randPick = Math.floor(Math.random()* docs.length);
      questions[i] = docs[randPick];
      docs.splice(randPick,1);      
    }
    callback(questions);
    });
  }
}

exports.getIds = function (selectedDomains,maxQuestions,callback){
  findDomains(selectedDomains,maxQuestions,function(questions){
    callback(questions);
  })
}

function restrictQuestions(array,maxQuestions){
  var remove = (array.length-maxQuestions);
  for(var i = 0;i<remove;i++){
    var randPick = Math.floor(Math.random()* array.length);
    array.splice(randPick,1);
  }
}

// Obtenir une seule question via son id
exports.getQuestionByID = function(id) {
    var index = findIndex(data, id);
    if (index == -1) {
        return null;
    } else {
        return index;
    }
}

exports.getRandomQuestionById = function(iDs){
  var randPick = Math.floor(Math.random()* iDs.length);
  return originalData[iDs[randPick]];
}

exports.getRandomQuestionInData = function(callback){
  Question.find(function(err,docs){
    var randPick = Math.floor(Math.random()* docs.length);
    callback(docs[randPick]); 

  }); 
}

// Obtenir une question aleatoire SAUF celles dont les id sont dans except
exports.getRandomQuestion = function(except) {
    var curatedList = data;
    for (var i = except.length - 1; i >= 0; i--) {
        var qIndex = findIndex(curatedList, except[i]);
        if (qIndex == -1) {
            continue;
        }
        curatedList.splice(qIndex, 1);
    };
    var randPick = Math.floor(Math.random()* curatedList.length);
    return curatedList[randPick];
}

exports.getAnswer = function(id,callback) {
    console.log(id);
    Question.findOne({'_id':id},function(err,docs){
      var rightAnswer = docs.correct;
      callback(rightAnswer);
    })
    
}