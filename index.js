var thesaurus = require("thesaurus");
var pos = require('pos');
var express = require('express');
var app = express();


app.get('/synonymize', function (req, res) {
    var word = req.param('word');
    var synonyms = synonymized(word)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(synonymized(word)));
});


function synonymized(word)
{
    var previousWord = null;
    var currentWord = null;
    var previousTag = null;
    var currentTag = null;

    var returnList = [];

    var words = new pos.Lexer().lex(word);
    var tagger = new pos.Tagger();
    var taggedWords = tagger.tag(words);

    for (i in taggedWords) {
    
        var taggedWord = taggedWords[i];
        var word = taggedWord[0];
        var tag = taggedWord[1];

    if(previousWord != null && previousTag != null) {
        if(isAdjective(previousTag)) {
            var firstLetter = previousWord[0];
            
            var firstSynonyms = thesaurus.find(previousWord);
            var secondSynonyms = thesaurus.find(word);

            console.log("FIRST ::");
            console.log(firstSynonyms);

            console.log("SECOND ::");
            console.log(secondSynonyms);


            for(first in firstSynonyms) {

                var f = firstSynonyms[first]

                for(second in secondSynonyms) {

                    var s = secondSynonyms[second]

                    var splits = s.split(" ");


                    for(split in splits) {

                        var s = splits[split];

                        if(s[0] == f[0]) {
                            returnList.push(f+ " " + s);
                        }
                    }
                }
            }
        }
    }

    previousTag = tag;
    previousWord = word;
   
   }

   return returnList;
}

function isAdjective(tag)
{
    return tag == "JJ" || tag == "JJR" || tag == "JJS"
}



function synonymMatch(word,startingLetter)
{
    var synonyms = thesaurus.find(word);
    for(wd in synonyms) {
        if(wd[0] == startingLetter) {
            return wd;
        }
    }

    return null;
}

app.use(express.static('public'));
app.listen(80)