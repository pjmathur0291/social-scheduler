import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export interface GoogleSheetsConfig {
  sheetId: string;
  worksheetTitle?: string;
  serviceAccountEmail?: string;
  privateKey?: string;
}

export interface FormSubmissionData {
  [key: string]: any;
  timestamp?: string;
  formId?: string;
  formName?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  utmId?: string;
  referrer?: string;
  landingPage?: string;
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

export class GoogleSheetsService {
  private doc: GoogleSpreadsheet | null = null;
  private config: GoogleSheetsConfig;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  private async initializeDoc() {
    if (!this.doc) {
      // Use service account authentication if credentials are provided
      if (this.config.serviceAccountEmail && this.config.privateKey) {
        const auth = new JWT({
          email: this.config.serviceAccountEmail,
          key: this.config.privateKey.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        
        this.doc = new GoogleSpreadsheet(this.config.sheetId, auth);
      } else {
        // For public sheets or sheets with public access
        console.warn('No service account credentials provided. Make sure the sheet is publicly accessible or use API key authentication.');
        // Create a dummy auth object for the constructor
        const dummyAuth = new JWT({
          email: 'dummy@example.com',
          key: 'dummy-key',
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        this.doc = new GoogleSpreadsheet(this.config.sheetId, dummyAuth);
      }
      
      await this.doc.loadInfo();
    }
    return this.doc;
  }

  async addFormSubmission(data: FormSubmissionData, formFields?: FormField[]): Promise<boolean> {
    try {
      const doc = await this.initializeDoc();
      
      // Get or create worksheet with new format
      const worksheetTitle = this.config.worksheetTitle || 'Form Submissions';
      let sheet = doc.sheetsByTitle[worksheetTitle];
      
      if (!sheet) {
        // Create new worksheet with proper headers
        sheet = await doc.addSheet({ 
          title: worksheetTitle,
          headerValues: this.getHeaderValues(data, formFields)
        });
        console.log(`Created new worksheet: ${worksheetTitle}`);
      } else {
        // Check if headers need to be updated
        await sheet.loadHeaderRow();
        const currentHeaders = sheet.headerValues;
        const expectedHeaders = this.getHeaderValues(data, formFields);
        
        // If headers don't match, update them
        if (JSON.stringify(currentHeaders) !== JSON.stringify(expectedHeaders)) {
          await sheet.setHeaderRow(expectedHeaders);
          console.log(`Updated headers in worksheet: ${worksheetTitle}`);
        }
      }

      // Prepare row data
      const rowData = this.prepareRowData(data, formFields);
      
      // Add the row
      await sheet.addRow(rowData);
      
      console.log('Successfully added form submission to Google Sheets');
      return true;
    } catch (error) {
      console.error('Error adding form submission to Google Sheets:', error);
      return false;
    }
  }

  private getHeaderValues(data: FormSubmissionData, formFields?: FormField[]): string[] {
    const headers: string[] = [];
    
    // Add timestamp first
    headers.push('Timestamp');
    
    // Add form fields dynamically based on actual form structure
    if (formFields && formFields.length > 0) {
      // Sort form fields by their position or order
      const sortedFields = formFields.sort((a, b) => {
        // If fields have position data, sort by position
        if ('position' in a && 'position' in b) {
          return (a as any).position.y - (b as any).position.y;
        }
        // Otherwise maintain original order
        return 0;
      });
      
      sortedFields.forEach(field => {
        headers.push(field.label);
      });
    } else {
      // Fallback: extract field names from data if formFields not provided
      const formFieldKeys = Object.keys(data).filter(key => key.startsWith('field-'));
      formFieldKeys.forEach(key => {
        const fieldLabel = data[`${key}_label`] || key.replace('field-', '').replace(/-/g, ' ');
        headers.push(fieldLabel);
      });
    }
    
    // Add tracking and metadata fields
    headers.push('Form ID');
    headers.push('Form Name');
    
    // Add UTM and tracking fields
    if (data.utmSource) headers.push('UTM Source');
    if (data.utmMedium) headers.push('UTM Medium');
    if (data.utmCampaign) headers.push('UTM Campaign');
    if (data.utmTerm) headers.push('UTM Term');
    if (data.utmContent) headers.push('UTM Content');
    if (data.utmId) headers.push('UTM ID');
    if (data.referrer) headers.push('Referrer');
    if (data.landingPage) headers.push('Landing Page');
    
    return headers;
  }

  private prepareRowData(data: FormSubmissionData, formFields?: FormField[]): any {
    const rowData: any = {};
    
    // Add timestamp
    rowData['Timestamp'] = data.timestamp || new Date().toISOString();
    
    // Add form fields dynamically
    if (formFields && formFields.length > 0) {
      // Sort form fields by their position or order
      const sortedFields = formFields.sort((a, b) => {
        // If fields have position data, sort by position
        if ('position' in a && 'position' in b) {
          return (a as any).position.y - (b as any).position.y;
        }
        // Otherwise maintain original order
        return 0;
      });
      
      sortedFields.forEach(field => {
        const fieldValue = data[field.id] || '';
        rowData[field.label] = fieldValue;
      });
    } else {
      // Fallback: extract field values from data if formFields not provided
      const formFieldKeys = Object.keys(data).filter(key => key.startsWith('field-'));
      formFieldKeys.forEach(key => {
        const fieldLabel = data[`${key}_label`] || key.replace('field-', '').replace(/-/g, ' ');
        rowData[fieldLabel] = data[key] || '';
      });
    }
    
    // Add form metadata
    rowData['Form ID'] = data.formId || '';
    rowData['Form Name'] = data.formName || '';
    
    // Add UTM and tracking data
    if (data.utmSource) rowData['UTM Source'] = data.utmSource;
    if (data.utmMedium) rowData['UTM Medium'] = data.utmMedium;
    if (data.utmCampaign) rowData['UTM Campaign'] = data.utmCampaign;
    if (data.utmTerm) rowData['UTM Term'] = data.utmTerm;
    if (data.utmContent) rowData['UTM Content'] = data.utmContent;
    if (data.utmId) rowData['UTM ID'] = data.utmId;
    if (data.referrer) rowData['Referrer'] = data.referrer;
    if (data.landingPage) rowData['Landing Page'] = data.landingPage;
    
    return rowData;
  }

  async testConnection(): Promise<boolean> {
    try {
      const doc = await this.initializeDoc();
      console.log(`Connected to Google Sheet: ${doc.title}`);
      return true;
    } catch (error) {
      console.error('Error testing Google Sheets connection:', error);
      return false;
    }
  }
}

// Helper function to create Google Sheets service instance
export function createGoogleSheetsService(config: GoogleSheetsConfig): GoogleSheetsService {
  return new GoogleSheetsService(config);
}
