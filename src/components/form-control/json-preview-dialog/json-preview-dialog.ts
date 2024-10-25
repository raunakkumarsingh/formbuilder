import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'asw-json-preview-dialog',
    templateUrl: './json-preview-dialog.html',
})
export class AswJsonPreviewDialog {
    formattedHtmlCode: string = ''; // Holds the formatted HTML code as plain text

    constructor(
        public dialogRef: MatDialogRef<AswJsonPreviewDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.generateHtmlCode();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    generateHtmlCode(): void {
        let htmlCode = '';
        let currentRowColumnSum = 0;
        let currentRowHtml: string[] = [];
        if(this.data.length>0) htmlCode+='<form class="p-4 bg-light rounded">\n'
        this.data.forEach((control: any, index: number) => {
            const columnSize = parseInt(control.column.split('-').pop() || '12', 10);

            // If adding the current control exceeds 12 columns, close the current row and start a new one
            if (currentRowColumnSum + columnSize > 12) {
                htmlCode += `    <div class="row">\n${currentRowHtml.join('\n')}\n    </div>\n`;
                currentRowColumnSum = 0;
                currentRowHtml = [];
            }

            // Add the current control to the row and update the column sum
            currentRowColumnSum += columnSize;

            // Build the HTML for the current control
            let controlHtml = '';
            switch (control.controlType) {
                case 'header':
                    controlHtml = [
                        `        <div class="${control.column} ${control.customClass || ''}">`,
                        `            <${control.subtype} class="${control.style || ''}">${control.label}</${control.subtype}>`,
                        `        </div>`
                    ].join('\n');
                    break;

                case 'textfield':
                    controlHtml = [
                        `        <div class="${control.column} ${control.customClass || ''}">`,
                        // `            <label for="${control.id}">${control.label}</label>`,
                        `            <input type="text" id="${control.id}" class="form-control"`,
                        `                placeholder="${control.tooltip || ''}"`,
                        `                maxlength="${control.maxlength || ''}"${control.isRequired ? ' required' : ''}${control.isDisabled ? ' disabled' : ''}>`,
                        `        </div>`
                    ].join('\n');
                    break;

                case 'textarea':
                    controlHtml = [
                        `        <div class="${control.column} ${control.customClass || ''}">`,
                        // `            <label for="${control.id}">${control.label}</label>`,
                        `            <textarea id="${control.id}" class="form-control"`,
                        `                placeholder="${control.tooltip || ''}"`,
                        `                maxlength="${control.maxlength || ''}"${control.isRequired ? ' required' : ''}${control.isDisabled ? ' disabled' : ''}></textarea>`,
                        `        </div>`
                    ].join('\n');
                    break;

                case 'number':
                    controlHtml = [
                        `        <div class="${control.column} ${control.customClass || ''}">`,
                        `            <label for="${control.id}">${control.label}</label>`,
                        `            <input type="number" id="${control.id}" class="form-control"`,
                        `                placeholder="${control.tooltip || ''}"`,
                        `                maxlength="${control.maxlength || ''}" min="${control.min || ''}" max="${control.max || ''}" step="${control.step || ''}"${control.isRequired ? ' required' : ''}${control.isDisabled ? ' disabled' : ''}>`,
                        `        </div>`
                    ].join('\n');
                    break;

                case 'button':
                    controlHtml = [
                        `        <div class="${control.column} ${control.customClass || ''}">`,
                        `            <button id="${control.id}" class="btn btn-${control.color || 'primary'}">`,
                        `                ${control.label}`,
                        `            </button>`,
                        `        </div>`
                    ].join('\n');
                    break;

                case 'radio':
                    controlHtml = [
                        `        <div class="${control.column} ${control.customClass || ''}">`,
                        `            <label>${control.label}</label>`,
                        control.options
                            .map((option: any) => [
                                `            <div class="form-check">`,
                                `                <input class="form-check-input" type="radio" name="${control.id}" id="${option.key}" value="${option.value}"${option.isChecked ? ' checked' : ''}>`,
                                `                <label class="form-check-label" for="${option.key}">${option.value}</label>`,
                                `            </div>`
                            ].join('\n'))
                            .join('\n'),
                        `        </div>`
                    ].join('\n');
                    break;

                case 'checkbox':
                    controlHtml = [
                        `        <div class="${control.column} ${control.customClass || ''}">`,
                        `            <label>${control.label}</label>`,
                        control.options
                            .map((option: any) => [
                                `            <div class="form-check">`,
                                `                <input class="form-check-input" type="checkbox" id="${option.key}" name="${control.id}" value="${option.value}"${option.isChecked ? ' checked' : ''}>`,
                                `                <label class="form-check-label" for="${option.key}">${option.value}</label>`,
                                `            </div>`
                            ].join('\n'))
                            .join('\n'),
                        `        </div>`
                    ].join('\n');
                    break;

                // Add other control types as needed

                default:
                    break;
            }

            currentRowHtml.push(controlHtml);

            // Reset the column sum and row content if it reaches exactly 12
            if (currentRowColumnSum === 12) {
                htmlCode += `    <div class="row">\n${currentRowHtml.join('\n')}\n    </div>\n`;
                currentRowColumnSum = 0;
                currentRowHtml = [];
            }
        });

        // Add the last row if it hasn't been added yet
        if (currentRowHtml.length > 0) {
            htmlCode += `    <div class="row">\n${currentRowHtml.join('\n')}\n    </div>\n`;
        }
        if(this.data.length>0) htmlCode += '</form>';

        this.formattedHtmlCode = htmlCode; // Store the formatted HTML code for display
        console.log(htmlCode);
    }
}
