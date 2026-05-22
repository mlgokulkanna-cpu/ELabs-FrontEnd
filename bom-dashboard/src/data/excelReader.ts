import * as XLSX from "xlsx";

export const readExcelSheet = async (
filePath: string,
sheetName: string
) => {
const response = await fetch(filePath);
const arrayBuffer = await response.arrayBuffer();

const workbook = XLSX.read(arrayBuffer, {
type: "array",
cellDates: true
});

const worksheet = workbook.Sheets[sheetName];

if (!worksheet) {
throw new Error(`Sheet "${sheetName}" not found`);
}

const jsonData = XLSX.utils.sheet_to_json(worksheet, {
defval: "",
raw: false
});

return jsonData;
};