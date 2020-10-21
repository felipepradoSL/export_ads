/****************************************************************************
**
**  Sweet Leads Empreendimentos Digitais
**  https://sweetleads.com.br
**  felipe@sweetleads.com.br
**
**  GitHub
**  https://github.com/felipepradoSL/export_ads
**
**  Script que envia dados para uma planilha para ser utilizada no DataStudio
**      - Seleciona todas as campanhas e envia para a planilha    
**      - PLANILHA: https://docs.google.com/spreadsheets/d/1spc9mInN4bXlV3gcdQgDQUHDSxMS1XHumGzASQLhRBw/
**  
**   > AFILIADOS 3 <
**  
*****************************************************************************/


// ID Spreadsheet
var ID_SPREADSHEET = "1spc9mInN4bXlV3gcdQgDQUHDSxMS1XHumGzASQLhRBw";

// email to receive alert error
var email = "felipe@sweetleads.com.br";

// IMPORTANT: Set the date correctly for each ads account
// CHANGE HERE start date -> 06/09/20
var DURING_START_DATE = 20200906; //yyyymmdd

//var STANDARD_BACKFILL_DAYS = 3;  

function main(){
  
  // return all ads
  var results = getAds();

  try{
     Logger.log("Salvando na planilha...");
    // save in spreadsheet  
    saveSpreadSheet(results); 
    Logger.log("Salvo com sucesso!");
  }catch(e){
      Logger.log("Erro ao salvar: " +e);
      MailApp.sendEmail(email, "SweetLeads - GoogleAds - "+AdsApp.currentAccount().getCustomerId()+" - "+AdsApp.currentAccount().getName(), "Erro ao salvar dados na planilha:\n\n"+e);
  }  

};

function getAds(){
  
  
 // var date = new Date();
  //date.setDate(date.getDate()-STANDARD_BACKFILL_DAYS);
  //var startDate = Utilities.formatDate(date, "America/Sao_Paulo", "yyyyMMdd"); 
  var endDate = Utilities.formatDate(new Date(), "America/Sao_Paulo", "yyyyMMdd");
  var DURING = "DURING "+ DURING_START_DATE +","+ endDate;
 
    // query returns campaign-specific attributes where impressions > 0
 var query =  'SELECT ExternalCustomerId, Date, CampaignName, CampaignId, AccountDescriptiveName, Clicks, Impressions, Cost, Conversions, ConversionValue, CampaignStatus ' +
     'FROM   CAMPAIGN_PERFORMANCE_REPORT ' +
     'WHERE Impressions > 0 '+
     DURING; 

     Logger.log("Coletando campanhas...")
 
 try{ 
  // Logger.log("Query will execute: "+ query);
   var report = AdWordsApp.report(query);
 
   var rows = report.rows();
   var data = [];
   while (rows.hasNext()) {
     var row = rows.next();
     var accountId = row['ExternalCustomerId'];
   var accountName = row['AccountDescriptiveName'];
     var campaignName = row['CampaignName'];
     var campaignId = row['CampaignId'];
     var clicks = row['Clicks'];
     var impressions = row['Impressions'];
     var date = row['Date']
     var cost = row['Cost'];
     var conversions = row['Conversions'];
     var revenue = row['ConversionValue'];
     var status = row['CampaignStatus'];

     data.push([
       accountId,
       date,
       campaignName,
       campaignId,
       accountName,
       clicks,
       impressions,
       cost,
       conversions,
       revenue,
       status,
     ]);                 

     }    
   } catch (e) {
     MailApp.sendEmail(email, "SweetLeads - GoogleAds - "+AdWordsApp.currentAccount().getCustomerId()+" - "+AdWordsApp.currentAccount().getName(), "Erro na extração dos dados do GoogleAds:\n\n"+e);
   }

  return data;

};

function saveSpreadSheet(obj){

  var ss = SpreadsheetApp.openById(ID_SPREADSHEET);
  var sheet = ss.getActiveSheet();    

  var lastRow = sheet.getLastRow();

  var range = sheet.getRange(lastRow+1, 1, obj.length, 11); // o último parâmetro (11) é o número de atributos (colunas)
  range.setValues(obj);
  };

