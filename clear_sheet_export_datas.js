/****************************************************************************
**
**  Sweet Leads Empreendimentos Digitais
**  https://sweetleads.com.br
**  felipe@sweetleads.com.br
**
**  GitHub
**  
**
**  Script que limpa dados da planilha utilizada no DataStudio
**      - Limpa a planilha e insere o cabeçalho
**      - PLANILHA: https://docs.google.com/spreadsheets/d/1spc9mInN4bXlV3gcdQgDQUHDSxMS1XHumGzASQLhRBw/
**  
**   CONTA PRINCIPAL
**  
*****************************************************************************/

var ID_SPREADSHEET = '1spc9mInN4bXlV3gcdQgDQUHDSxMS1XHumGzASQLhRBw';

var HEADER_SHEET = [
    "accountId",
    "date",
    "campaignName",
    "campaignId",
    "accountName",
    "clicks",
    "impressions",
    "cost",
    "conversions",
    "conversionvalue",
    "status"
]

function main(){

    var ss = SpreadsheetApp.openById(ID_SPREADSHEET);
    var sheet = ss.getActiveSheet();

    try{
        sheet.clear();
        sheet.appendRow(HEADER_SHEET);
    }
    catch(e){
        Logger.log("Erro ao modificar planilha: " + e);
    }
}