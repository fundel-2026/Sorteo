import * as XLSX from 'xlsx';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Parses a file (Excel or PDF) and returns an array of strings (names).
 * @param {File} file 
 * @returns {Promise<string[]>}
 */
export async function parseFile(file) {
    const extension = file.name.split('.').pop().toLowerCase();

    if (extension === 'xlsx' || extension === 'xls') {
        return parseExcel(file);
    } else if (extension === 'pdf') {
        return parsePDF(file);
    } else {
        throw new Error('Formato no soportado. Usa Excel o PDF.');
    }
}

function parseExcel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Assume first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Get all data as JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Flatten and filter
                const participants = jsonData
                    .flat()
                    .map(item => String(item).trim())
                    .filter(item => item.length > 0 && item.toLowerCase() !== 'nombre' && item.toLowerCase() !== 'participantes'); // Basic header filtering

                resolve(participants);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
}

async function parsePDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join('\n'); // Join with newlines to try to preserve rows
        fullText += pageText + '\n';
    }

    // Split by newlines and clean up
    const participants = fullText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    return participants;
}
