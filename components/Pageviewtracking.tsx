// Google Apps Script für Page View Tracking
// Erstelle ein neues Sheet namens "PageViews" mit diesen Spalten:
// Timestamp | Page | Referrer | UTM Source | UTM Medium | UTM Campaign | UTM Content | Device | User Agent

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PageViews');
    
    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, message: 'Sheet "PageViews" not found' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parameter auslesen
    const params = e.parameter;
    const timestamp = params.timestamp || new Date().toISOString();
    const page = params.page || '/';
    const referrer = params.referrer || 'direct';
    const utmSource = params.utm_source || '-';
    const utmMedium = params.utm_medium || '-';
    const utmCampaign = params.utm_campaign || '-';
    const utmContent = params.utm_content || '-';
    const device = params.device || 'unknown';
    const userAgent = params.userAgent || '-';
    
    // Neue Zeile hinzufügen
    sheet.appendRow([
      timestamp,
      page,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      device,
      userAgent
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test-Funktion (optional)
function test() {
  const testEvent = {
    parameter: {
      timestamp: new Date().toISOString(),
      page: '/test',
      referrer: 'https://google.com',
      utm_source: 'test',
      utm_medium: 'manual',
      utm_campaign: 'testing',
      device: 'desktop',
      userAgent: 'Test Browser'
    }
  };
  
  const result = doPost(testEvent);
  Logger.log(result.getContent());
}