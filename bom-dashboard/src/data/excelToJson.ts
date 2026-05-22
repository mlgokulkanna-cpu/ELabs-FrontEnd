import { readExcelSheet } from "./excelReader";

const excelFilePath = "/data/dummy_dataset.xlsx";

const sheetNames = [
"master_fg_data",
"agent_extracted_data"
];

const downloadJsonFile = (
data: any,
fileName: string
) => {
const jsonString = JSON.stringify(data, null, 2);

const blob = new Blob(
[jsonString],
{ type: "application/json" }
);

const url = URL.createObjectURL(blob);

const link = document.createElement("a");

link.href = url;
link.download = `${fileName}.json`;

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

URL.revokeObjectURL(url);
};

const convertSheetsToJson = async () => {
try {

for (const sheetName of sheetNames) {

const data = await readExcelSheet(
excelFilePath,
sheetName
);

downloadJsonFile(data, sheetName);

console.log(
`${sheetName}.json generated successfully`
);

}

} catch (error) {

console.error(
"excel to json conversion failed",
error
);

}
};

convertSheetsToJson();