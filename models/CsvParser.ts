export class CsvParser {
    private firstLine = true;

    public async parseCsvContent(
        csvContent: string
    ): Promise<Record<PropertyKey, string>[]> {
        return new Promise((resolve, reject) => {
            if (!csvContent.length) {
                reject("csv content is empty");
            }
            let headers: string[] = [];
            const formattedCsv: Record<string, string>[] = [];
            const lines = csvContent.split(/\r?\n/);
            lines.pop();
            for (const line of lines) {
                if (this.firstLine) {
                    headers = this.splitLine(line);
                    this.firstLine = false;
                } else {
                    const splitLine = this.splitLine(line);
                    const keyedValue: Record<string, string> = {};
                    for (let i = 0; i < headers.length; i++) {
                        keyedValue[headers[i]] = splitLine[i];
                    }
                    formattedCsv.push(keyedValue);
                }
            }

            resolve(formattedCsv);
        });
    }

    private splitLine(line: string): string[] {
        let inQuotes = false;
        let word: string[] = [];
        const splitArr = [];
        for (const char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
                splitArr.push(word.join(""));
                word = [];
            } else {
                word.push(char);
            }
        }
        splitArr.push(word.join(""));
        return splitArr;
    }
}
