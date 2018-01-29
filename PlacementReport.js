function main() {
    var currentAccount = AdWordsApp.currentAccount();
    var accountName = currentAccount.getName();
    
    Logger.log("Account: " + accountName);
    
    var spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1yCToteUPvD6xwBFX_Xorj09tW5Fav-DCxWllG5EqlhE/edit?usp=sharing';
    var spreadsheet = SpreadsheetApp.openByUrl(spreadsheet_url);
    // Format report to print on correct sheet  - IMPORTANT!!
    var sheet = spreadsheet.getSheets()[0];
    
    var campaignSelector = AdWordsApp
        .campaigns()
        .forDateRange("LAST_7_DAYS");
  
    var campaignIterator = campaignSelector.get();

      while (campaignIterator.hasNext()) {
        // Get campaign stats
        var campaign = campaignIterator.next();
        var campaignName = campaign.getName();
        Logger.log("Campaign Name:" + campaignName);
        
        // Generate a report on placements
        var report = AdWordsApp.report(
        "SELECT DisplayName, Cost, Impressions, Ctr, Clicks, AverageCpm FROM PLACEMENT_PERFORMANCE_REPORT WHERE Impressions > 100 DURING LAST_7_DAYS");
        var rows = report.rows();
        while(rows.hasNext()) {
         var row = rows.next();
          sheet.appendRow([row["DisplayName"], row["Cost"], row["Impressions"], row["Ctr"], row["Clicks"], row["AverageCpm"]]);
          Logger.log("Printed 7 Day Row");
        }
        var allString = "SELECT DisplayName, Cost, Impressions, Ctr, Clicks, AverageCpm FROM PLACEMENT_PERFORMANCE_REPORT WHERE Impressions > 100 DURING LAST_30_DAYS";
        Logger.log(allString);
        var allReport = AdWordsApp.report(allString);
        
        var iter = report.rows();
        
        while(iter.hasNext()) {
          var allReportRow = iter.next();
          sheet.appendRow([
            allReportRow["DisplayName"],
            allReportRow["Cost"],
            allReportRow["Impressions"],
            allReportRow["Ctr"],
            allReportRow["Clicks"],
            allReportRow["AverageCpm"]]);
          Logger.log("Printed 30 Day Row");
        }
      }
  }