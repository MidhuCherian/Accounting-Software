import { Component, OnInit, Pipe, PipeTransform, Injectable  } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { InvoiceService } from "./invoice.service";
import { IInvoice, IInvoiceLine } from "./invoice";
import { AlertService } from "../alert/alert.service";

import { PaginationComponent } from '../pagination/pagination.component';
import { DecimalPipe } from '@angular/common/src/pipes/number_pipe';







@Component({
    selector: 'app-invoicelist',
    templateUrl: './invoicelist.component.html',
    styleUrls: ['./invoicelist.component.css'],

})



export class InvoicelistComponent implements OnInit {
    invoiceNumber: string;
    selected:any;
    //selectedData:any;
    
   
    status = ['All', 'Unpaid and sent', 'Unpaid with due date', 'Paid', 'Open', 'Overdue'];
   
    // offset is the index of an invoice we want to view and is used to compute the page to show; offset = 3 for example means display the page containing the 4th invoice in the list

    // offset needs to be initialized
    offset: number = 0;
    // page: number = 1;
    limit: number = 1;
    title: string = 'CBA Invoicing';
    // invo: IInvoice;
    list = '';
    errorMessage: string;

    _listFilter: string;
    get listFilter(): string {
        return this._listFilter;
    }
    set listFilter(value: string) {
        this._listFilter = value;
        this.filteredInvoice = this.listFilter ? this.performFilter(this.listFilter) : this.invo;
    }
    filteredInvoice: IInvoice[];
    invo: IInvoice[] = [];


    // inject InvoiceService
    constructor(private route: ActivatedRoute, private _invoiceService: InvoiceService, private alertService: AlertService, private http: Http) {
       // this.selected = this.stat;
        this.invo = this.route.snapshot.data['invoices'];
       
    }
    onPageChange(offset) {
        this.offset = offset;
    }

    clearSearch() {
        this.listFilter = null;
        this.selected = null;
    }
    onOptionsSelected() {
        // let value = event.target.value;
        // this.selected = value;
        console.log(this.selected);
        //  this.filtered = this.invo.filter(t => t.status == this.selected);
        let today: Date = new Date();
        switch (this.selected) {
            case "All":
                this.invo = this.route.snapshot.data['invoices'];
                break;

            case "Paid":
                this.filteredInvoice = this.invo.filter(invoice => invoice.status == "Paid");
                break;
            case "Unpaid and sent":
                this.filteredInvoice = this.invo.filter(invoice => invoice.status == "Sent");
                break;

            case "Unpaid within due date":
                this.filteredInvoice = this.invo.filter(invoice => invoice.status == "Sent" && today <= invoice.dateDue);
                break;
            case "Overdue":
                this.filteredInvoice = this.invo.filter(invoice => invoice.status == "Sent" && today > invoice.dateDue);
                break;

        }

        //  this.performFilter(filterBy:any);
    }



    

    performFilter(filterBy: any): IInvoice[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.invo.filter((inv: IInvoice) =>
            (inv.clientName.toLocaleLowerCase().indexOf(filterBy) !== -1) || (inv.invoiceNumber.toLocaleLowerCase().indexOf(filterBy) !== -1)
            || (inv.dateCreated.toString().toLocaleLowerCase().indexOf(filterBy) !== -1)
            || (inv.dateDue.toString().toLocaleLowerCase().indexOf(filterBy) !== -1) || (inv.grandTotal.toString().toLocaleLowerCase().indexOf(filterBy) !== -1));



  
   
    }
      

    ngOnInit(): void {
        this._invoiceService.getInvoices()
            .subscribe(invo => {
                this.invo = invo;
                this.filteredInvoice = this.invo;
            },
            error => this.errorMessage = <any>error);
    }
       
    }

   
    

               
   
    
    




