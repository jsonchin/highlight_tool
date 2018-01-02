function runCompatabilityTests() {
  testBackwardsCompatabilityV2();
  Logger.log('Tests successful.');
}

function testBackwardsCompatabilityV2() {
  const v2HighlighterLibraryJSON = {
    "set2label1":"Background Essay",
    "set2label0":"   Thesis",
    "set2color0":"#ffa6ff",
    "set2color1":"#ffff00",
    "set2label3":"Citation",
    "set2label2":"Evidence",
    "set2color2":"#00ff00",
    "set0N":"4.0",
    "set5label0":"pink",
    "set5label1":"teal",
    "set5label2":"_",
    "setN":"6.0",
    "set1N":"2.0",
    "set2label5":"Topic Sentence/Subclaim",
    "set2label4":"Argument",
    "set5N":"3.0",
    "set3color2":"#00d5ff",
    "set3color3":"#00ecff",
    "set3":"qqqqqq",
    "set3label3":"e",
    "set2":"DBQ",
    "set5":"debugme",
    "set4":"DefaultSetName",
    "set1color0":"#45817d",
    "set1color1":"#c3ff00",
    "set4color0":"#5aae51",
    "set3label0":"  numero",
    "set1":"Economics",
    "set2N":"6.0",
    "set3label1":"c",
    "set0":"History",
    "set3label2":"d",
    "set4color1":"#fcf503",
    "set4color2":"#ff0000",
    "set0label1":"Political",
    "set4label2":"Commentary",
    "set4color3":"#5686a9",
    "set0label0":"Military",
    "set4label3":"Conclusion",
    "set0label3":"Economic",
    "set0label2":"Social",
    "set0color3":"#00ceff",
    "set0color2":"#92e6c2",
    "set0color1":"#faff95",
    "set0color0":"#ff9a00",
    "set4label0":"Thesis",
    "set4label1":"Evidence",
    "set3N":"4.0",
    "set3color0":"#0079ff",
    "set3color1":"#00beff",
    "selectedSet":"4",
    "set1label1":"Stocks",
    "set1label0":"Downturn",
    "set5color2":"#ff0000",
    "set5color0":"#fec2f2",
    "set5color1":"#96e9e9",
    "set4N":"4.0",
    "set2color3":"#0000ff",
    "set2color4":"#a400a4",
    "set2color5":"#ff8000"
  };

  const v3HighlighterLibraryJSON = {
    "currentSetIndex": 0,
    "highlighterSets": [
      {
        "setName": "History",
        "highlighters": [
          {
            "label": "Military",
            "color": "#ff9a00"
          },
          {
            "label": "Political",
            "color": "#faff95"
          },
          {
            "label": "Social",
            "color": "#92e6c2"
          },
          {
            "label": "Economic",
            "color": "#00ceff"
          }
        ],
        "isSetMinimized": false
      },
      {
        "setName": "Economics",
        "highlighters": [
          {
            "label": "Downturn",
            "color": "#45817d"
          },
          {
            "label": "Stocks",
            "color": "#c3ff00"
          }
        ],
        "isSetMinimized": false
      },
      {
        "setName": "DBQ",
        "highlighters": [
          {
            "label": "Thesis",
            "color": "#ffa6ff"
          },
          {
            "label": "Background Essay",
            "color": "#ffff00"
          },
          {
            "label": "Evidence",
            "color": "#00ff00"
          },
          {
            "label": "Citation",
            "color": "#0000ff"
          },
          {
            "label": "Argument",
            "color": "#a400a4"
          },
          {
            "label": "Topic Sentence\/Subclaim",
            "color": "#ff8000"
          }
        ],
        "isSetMinimized": false
      },
      {
        "setName": "qqqqqq",
        "highlighters": [
          {
            "label": "numero",
            "color": "#0079ff"
          },
          {
            "label": "c",
            "color": "#00beff"
          },
          {
            "label": "d",
            "color": "#00d5ff"
          },
          {
            "label": "e",
            "color": "#00ecff"
          }
        ],
        "isSetMinimized": false
      },
      {
        "setName": "DefaultSetName",
        "highlighters": [
          {
            "label": "Thesis",
            "color": "#5aae51"
          },
          {
            "label": "Evidence",
            "color": "#fcf503"
          },
          {
            "label": "Commentary",
            "color": "#ff0000"
          },
          {
            "label": "Conclusion",
            "color": "#5686a9"
          }
        ],
        "isSetMinimized": false
      },
      {
        "setName": "debugme",
        "highlighters": [
          {
            "label": "pink",
            "color": "#fec2f2"
          },
          {
            "label": "teal",
            "color": "#96e9e9"
          },
          {
            "label": "_",
            "color": "#ff0000"
          }
        ],
        "isSetMinimized": false
      }
    ]
  };

  // clear the properties except for v2 properties
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperties(v2HighlighterLibraryJSON, true);

  // convert
  convertV2ToV3Library();
  
  // compare the converted result
  const convertedV3HLibraryJSON = loadHighlighterLibraryJSON();
  assertEquals(JSON.stringify(convertedV3HLibraryJSON), JSON.stringify(v3HighlighterLibraryJSON),
    'Converted v3 library is not equal.');

  assertEquals(JSON.stringify(convertedV3HLibraryJSON), JSON.stringify(v3HighlighterLibraryJSON),
    'Converted v3 library is not equal.');

  // test negative
  v3HighlighterLibraryJSON.highlighterSets[0].highlighters[0].label = 'Incorrect label!';
  assertNotEquals(JSON.stringify(convertedV3HLibraryJSON), JSON.stringify(v3HighlighterLibraryJSON),
    'Converted v3 library should not be equal.');
}
