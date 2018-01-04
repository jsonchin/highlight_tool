function testExtractTable() {
  const doc = DocumentApp.openByUrl('https://docs.google.com/document/d/1S-QoWUdC07lOn6iijAhEOFNaFFWK6PHpQ_2AE6XfXe0/edit');
  Logger.log(extractHighlightedTextFromDoc(doc));
}

function testExtractText() {
  const extractedTexts = [{
    "text": "Topic Sentence\/Subclaim\n\n\n\nhereeeeeeee\nhereeee",
    "color": "#ff8000"
  }];

  const doc = DocumentApp.openByUrl('https://docs.google.com/document/d/1S-QoWUdC07lOn6iijAhEOFNaFFWK6PHpQ_2AE6XfXe0/edit');

  const hSet = new HighlighterSet('setName');
  appendExtractedTextChrono(extractedTexts, doc, hSet);
}
