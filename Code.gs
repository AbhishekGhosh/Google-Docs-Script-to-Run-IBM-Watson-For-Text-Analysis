/*

IBM Watson Demo for Google Docs
-------------------------------

Contributed by Abhishek Ghosh
Email: admin@thecustomizewindows.com
Web: https://thecustomizewindows.com/
Twitter: @AbhishekCTRL

*/

function analyzeText_() {
  
  var text = getSelectedText_();
  
  if (!text.length) {
    showMessage_("Please select some text in the document.");
    return;
  }
  
  var credentials =  {
    "username": "b5e4783c-2646-4b24-86fb-d737f4b7b6d0",
    "password": "AcSJCy5squjb"
  };
  
  var payload = {
    "text": text.join("\n"),
    "features": {
      "entities": {
        "emotion": false,
        "sentiment": false,
        "limit": 10
      }
    }
  };
  
  var url = "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27";
  
  var response = UrlFetchApp.fetch(url, {
    "method": "POST",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "headers": {
      "Authorization" : "Basic " + Utilities.base64Encode(credentials.username + ":" + credentials.password)
    }
  });
  
  var entities = JSON.parse(response).entities;
  
  var answers = entities.filter(function(entity) {
    return entity.relevance > .3
  }).map(function(entity) {
    return [entity.text, entity.type].join(" - ");
  });
  
  if (answers.length) {
    showMessage_(answers.join("\n"));
  } else {
    showMessage_("Sorry, no entities were found");
  }
  
}

function about_() {
  showMessage_("This demo was contributed by Abhishek Ghosh\nEmail: admin@thecustomizewindows.com\nWebsite: https://thecustomizewindows.com/");
}


function onOpen(e) {
  DocumentApp.getUi()
  .createMenu("★ IBM Watson")
  .addItem('Analyze Text', 'analyzeText_')
  .addItem('About', 'about_')
  .addToUi();
}

function getSelectedText_() {
  var text = [];
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var elements = selection.getSelectedElements();
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();        
        text.push(element.getText().substring(startIndex, endIndex + 1));
      } else {
        var element = elements[i].getElement();
        if (element.editAsText) {
          var elementText = element.asText().getText();
          if (elementText) {
            text.push(elementText);
          }
        }
      }
    }
  }
  return text;
}

function showMessage_(e) {
  DocumentApp.getUi().alert(e);
}

/**
* @OnlyCurrentDoc  
*/



