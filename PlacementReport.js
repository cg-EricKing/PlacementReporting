function main() {
    var currentAccount = AdWordsApp.currentAccount();
    var accountName = currentAccount.getName();
    
    Logger.log("Account: " + accountName);
    
    var spreadsheet_url = '';
    var spreadsheet = SpreadsheetApp.openByUrl(spreadsheet_url);
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
        "SELECT DisplayName, Cost, AverageCpm, Ctr, Clicks, Impressions FROM PLACEMENT_PERFORMANCE_REPORT WHERE Impressions > 100 DURING LAST_7_DAYS");
        var rows = report.rows();
        while(rows.hasNext()) {
         var row = rows.next();
          sheet.appendRow([row["DisplayName"], row["Cost"], row["AverageCpm"], row["Ctr"], row["Clicks"], row["Impressions"]]);
          Logger.log("Printed 7 Day Row");
        }
        var allString = "SELECT DisplayName, Cost, AverageCpm, Ctr, Clicks, Impressions FROM PLACEMENT_PERFORMANCE_REPORT WHERE Impressions > 100 DURING LAST_30_DAYS";
        Logger.log(allString);
        var allReport = AdWordsApp.report(allString);
        
        var iter = report.rows();
        
        while(iter.hasNext()) {
          var allReportRow = iter.next();
          sheet.appendRow([
            allReportRow["DisplayName"],
            allReportRow["Cost"],
            allReportRow["AverageCpm"],
            allReportRow["Ctr"],
            allReportRow["Clicks"],
            allReportRow["Impressions"]]);
          Logger.log("Printed 30 Day Row");
        }
      }
  }