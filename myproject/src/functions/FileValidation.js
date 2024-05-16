/* global toBlob */
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useReactToPrint } from 'react-to-print';

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export function imageValidation(file,setErrorMessage){
    if (file) {
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        if (!allowedExtensions.exec(file.name)) {
          setErrorMessage('Valid id must be png/jpeg');
        } else {
          setErrorMessage(null); // Reset the error message if the file is valid
        }
      }
}

export function pdfValidation(file,setErrorMessage){
    if (file) {
        const allowedExtensions = /(\.pdf)$/i;
        if (!allowedExtensions.exec(file.name)) {
          setErrorMessage('Certificate must be pdf');
        } else {
          setErrorMessage(null); // Reset the error message if the file is valid
        }
      }
}

export function exportCSV(data,name){
  const csvColumns = Object.keys(data[0]); // Extract column headers

  const csv = Papa.unparse({
      fields: csvColumns,
      data: data,
  });

  const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
  });

  saveAs(blob, name+"_data.csv");
}



