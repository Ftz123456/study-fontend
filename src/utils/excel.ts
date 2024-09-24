// 新建 @/utils/excel.ts

import saveAs from 'file-saver'; // https://www.npmjs.com/package/file-saver
import ExcelJS from 'exceljs'; // https://github.com/exceljs/exceljs/blob/master/README_zh.md
import dayjs from 'dayjs'; // https://dayjs.fenxianglu.cn/
import * as XLSX from 'xlsx'; // https://www.npmjs.com/package/xlsx
import { Message } from '@arco-design/web-vue'; // https://arco.design/vue/component/message
import { FileItem } from '@arco-design/web-vue/es/upload/interfaces'; // arco类型

export interface DownloadExcelPrams {
    columns: { title: string, key: string }[];
    rows: object[];
    name: string
}

// 导出下载文件
export function downloadExcel({ columns, rows, name = '未命名文件' }: DownloadExcelPrams) {
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Start-front';
    workbook.lastModifiedBy = 'Start-front';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);

    // 将工作簿添加一个sheet页sheet1
    const sheet1 = workbook.addWorksheet(name);
    // 表头数据添加
    sheet1.columns = columns.map(item => ({
        header: item.title,
        key: item.key,
        width: 20
    }));
    // 表格内容添加
    rows.map(item => sheet1.addRow(item));
    workbook.xlsx.writeBuffer().then(buffer => {
        saveAs(
            new Blob([buffer], { type: 'application/octet-stream' }),
            `${name}.xlsx`
        );
    });
};


// 读取文件为json格式
export function readExcle(fileItem:FileItem) {
    console.log('读取文件...',fileItem);
    return new Promise((resove,reject)=>{
        try {
            let workbook:XLSX.Sheet;
            const reader = new FileReader();
            reader.readAsBinaryString(fileItem.file as File); // 发起异步请求
            reader.onload = function(ev){
                const data = ev.target?.result;
                workbook = XLSX.read(data, {type: 'binary'});
                const sheetNames = workbook.SheetNames; // 工作表名称集合
                sheetNames.forEach((name:string) => {
                    const worksheet = workbook.Sheets[name]; // 只能通过工作表名称来获取指定工作表
                    const jsonres = XLSX.utils.sheet_to_json(worksheet);
                    resove(jsonres)
                });
            } // onload
        } catch (error) {
            Message.error('读取失败,请选择正确文件');
            reject(error);
        }
    })
}

