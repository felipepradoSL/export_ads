/*
    Lucratividade geral: custo, receita, ROI, lucro
    Volume: número de campanhas ativas, número de campanhas com vendas, 
        número de campanhas pausadas
    Qualidade de cursos: ticket médio, %campanhas com vendas, campanhas que 
        representam 80% da receita
*/

/****************************************************************************
**
**  Sweet Leads Empreendimentos Digitais
**  https://sweetleads.com.br
**  felipe@sweetleads.com.br
**
**  GitHub
**  
**
**  Script que envia dados para uma planilha para ser utilizada no DataStudio
**      - Seleciona todas as campanhas e envia para a planilha
**      - Script deve ser executado uma vez por dia fora do horário comercial ( de madrugada de preferência)
**  
**  
**   AFILIADOS 4
**  
*****************************************************************************/

/*#####################################################################################
# 
# Proximos passos:
#   - Script pronto
#   - Montar script que insere cabeçalho (executar 1 vez por dia antes de todos)
#   - Definir sequencia das contas para inserir na planilha (acrescentar delay entre as gravações +- 20min)
#   - Programar scripts para rodar na madrugada
#   - Montar Dash
# 
#########################################################################################*/



var ID_SPREADSHEET = "1spc9mInN4bXlV3gcdQgDQUHDSxMS1XHumGzASQLhRBw";

function main(){

  var results = getData().map(saveSpreadSheet);
  
    Logger.log("*************results****************");
  Logger.log(JSON.stringify(results))
  Logger.log("*************results****************");

  if (results){
    Logger.log('Gravado com sucesso!');
  }else
  {
    Logger.log('Results está vazio');
  }

};


function getData(){

  var ads = []; // array with ads

  var conds = [
    "Status = ENABLED",
    "Status = PAUSED"
  ]; // ads conditions 

  var aux = [];

  for(var i = 0 ; i < conds.length ; i++){
    var results = AdsApp.ads()
    .withCondition(conds[i])
    .forDateRange('ALL_TIME')
    .get();

    while(results.hasNext()){

    var currentAccount = AdsApp.currentAccount();
    var accountName = currentAccount.getName();
    var accountId = currentAccount.getCustomerId();

    var current = results.next();
    var campaign = current.getCampaign();

    if(aux.indexOf(campaign.getId()) < 0){
      var adData = {campaign : campaign};

      adData['accountName'] = accountName;
      adData['accountId'] = accountId;
  
      if(campaign.isPaused()){
        adData['status'] = "PAUSED";
      }
      else if(campaign.isEnabled()){
          adData['status'] = "ENABLED";
      };
  
      ads.push(adData);
    }

    aux.push(campaign.getId());

    }

  };



  return ads;

};

function saveSpreadSheet(obj){

  var ss = SpreadsheetApp.openById(ID_SPREADSHEET);
  var sheet = ss.getActiveSheet();  

  var stats = obj.campaign.getStatsFor('ALL_TIME');
  var clicks = stats.getClicks();
  var cost = stats.getCost();

  sheet.appendRow([obj.accountId, obj.accountName, obj.campaign.getId() ,obj.campaign.getName(), clicks, cost, obj.status])

  return obj;
}

