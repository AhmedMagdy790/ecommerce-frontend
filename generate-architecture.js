import fs from 'fs';
import path from 'path';

const targetDir = './src'; 
const outputFile = 'architecture-report.md';

function getStructure(dir, level = 0) {
    let result = '';
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        const indent = '  '.repeat(level);

        if (stats.isDirectory()) {
            result += `${indent}- 📁 **${file}**\n`;
            result += getStructure(fullPath, level + 1);
        } else {
            result += `${indent}- 📄 ${file}\n`;
        }
    });
    return result;
}

const report = `# تقرير هيكلية المشروع

## شجرة المجلدات
${getStructure(targetDir)}

---
تم توليد هذا التقرير تلقائياً.
`;

fs.writeFileSync(outputFile, report);
console.log('✅ تم توليد ملف architecture-report.md بنجاح!');