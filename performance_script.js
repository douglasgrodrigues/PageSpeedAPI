function obterDadosHome() {
  var apiKey = API_KEY;
  var apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' + 'YOUR_URL_SITE' + apiKey;

  var options = {
    method: 'get',
    contentType: 'application/json',
    strategy: 'mobile'
  };

  var response = UrlFetchApp.fetch(apiUrl, options);
  var responseData = JSON.parse(response.getContentText());
  var timestamp = new Date();

  // Verificar se as propriedades estão definidas
  var lighthouseResult = responseData.lighthouseResult || {};
  var categories = lighthouseResult.categories || {};

  var performance   = categories.performance.score
  var accessibility = categories.accessibility.score
  var seo           = categories.seo.score
  var snapshotData = lighthouseResult.fullPageScreenshot.screenshot.data;  

  return {
    timestamp: timestamp,
    performance: performance,
    accessibility: accessibility,
    seo: seo,
    fullPageScreenshot: snapshotData
  }
}

function avaliarDesempenhoHome(performance) {
  if (performance >= 0.9) {
    return 'High';
  } else if (performance >= 0.7 && performance < 0.9 ) {
    return 'Fast';
  } else if (performance >= 0.5) {
    return 'Average';
  } else {
    return 'Slow';
  }
}

function reportHome() {
  var planilha = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
  var aba = planilha.getSheetByName('TAB_NAME');
  var dados = obterDadosHome();
  var dataAtual = Utilities.formatDate(dados.timestamp, 'GMT-03:00', 'dd/MM/yyyy HH:mm:ss');

  aba.appendRow([ dataAtual, dados.performance*100, dados.accessibility*100, dados.seo*100, avaliarDesempenhoHome(dados.performance), dados.fullPageScreenshot ]);  
}
