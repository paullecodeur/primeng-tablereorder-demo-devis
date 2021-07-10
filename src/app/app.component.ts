import { Component, OnInit } from '@angular/core';
import { ProductService } from './productservice';
import { Product } from './product';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent { 
    products: Product[];

    cols: any[];

    drapelem: any;
    elemDrop: any[]=[];

    statuses: SelectItem[];

    constructor(private productService: ProductService) { }

    ngOnInit() {

        this.statuses = [{label: 'Ligne', value: 'ligne'},{label: 'Section', value: 'section'}]

        this.productService.getProductsSmall().then(data => {
            
            this.products = data;
            this.numerotation();

        });

        this.cols = [
            { field: 'number', header: 'Num' },
            { field: 'id', header: 'ID' },
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            // { field: 'rating', header: 'Rating' }
        ];

    }

    numerotation() {

        let compt = 1;

        this.products.forEach((elem, index) => {
            if(elem.parentId === null) {
                elem.number = compt.toString();
                
                let compt2 = 1;
                this.products.forEach((elem2, index2) => {
                    if(elem2.parentId === elem.id) {
                        elem2.number = elem.number + '.' + compt2.toString();

                        let compt3 = 1;
                        this.products.forEach((elem3, index3) => {
                            if(elem3.parentId === elem2.id) {
                                elem3.number = elem2.number + '.' + compt3.toString();
                                compt3++;
                            }
                        })

                        compt2++;
                    }
                })

                compt++;

            }
        })

         // sort
         this.products.sort(function(a, b) {

            if (a.number < b.number)
            return -1;
            if (a.number > b.number)
            return 1;
            // a doit être égal à b
            return 0;

            // return a.id - b.id;
        });

    }

    insertAt(array, index) {
        var arrayToInsert = Array.prototype.splice.apply(arguments, [2]);
        return this.insertArrayAt(array, index, arrayToInsert);
    }
    
    insertArrayAt(array, index, arrayToInsert) {
        Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
        return array;
    }

    onDrop(event, droprow, index){

        // event.preventdefault();
        // event.stopPropagation();

        console.log(index);
        console.log('drop', droprow);
        // on masque les fils
        this.products.forEach(elem => {
            if(elem.parentId === this.drapelem.id)
            elem.visible = true;
        })


        const indexdrap = this.products.findIndex(ele=>ele.id === this.drapelem.id)

        // this.insertArrayAt(this.products, indexdrap + 1, this.elemDrop);

        // mise à jour parent
        if(droprow.rowType === 'ligne') {
            // on controle le niveau du parent
            if(this.products[indexdrap].rowType === 'ligne') {
                this.products[indexdrap].parentId = droprow.parentId;
            }

            if(this.products[indexdrap].rowType === 'section' && this.parentLevel(droprow) < 2) {
                this.products[indexdrap].parentId = droprow.parentId;
            }
        }

        if(droprow.rowType === 'section') {

            if(this.products[indexdrap].rowType === 'ligne') {
                this.products[indexdrap].parentId = droprow.id;
            }

            if(this.products[indexdrap].rowType === 'section') {
                this.products[indexdrap].parentId = droprow.parentId;
            }
        }

        // numerotation
        this.numerotation();

    } 


    parentLevel(rowData) {

        let level = 0 
        while( rowData.parentId !== null) {
            level++
            const indexparent = this.products.findIndex(elem=>elem.id === rowData.parentId)
            rowData = this.products[indexparent];
        }

        return level;

    }


    dragStart(rowData){
        // alert('');
        this.elemDrop = [];
        this.drapelem = rowData;
        console.log('drap start', rowData)
        this.products.forEach((elem, index) => {
            if(elem.parentId === this.drapelem.id) {
                elem.visible = false;
                this.elemDrop.push(elem);
               // console.log(index);
            }
        })
    }

    dragEnd(rowData) {

        console.log('drap start', rowData)
        this.products.forEach((elem, index) => {
            if(elem.parentId === this.drapelem.id) {
                elem.visible = true;
                this.elemDrop.push(elem);
               // console.log(index);
            }
        })

    }

    dragleave(){
        console.log('dragleave')
    }

    dragover(){
        // console.log('drapover')
        
    }

   

    dragenter(){
        // alert('');
        console.log('drapenter')
    }

    onRowReorder(event) {
        // alert(event.dropIndex);
        /* this.products.forEach(elem => {
            elem.number = '5';
        }) */

        // on tri le tableau
        // on ordonne le tableau de flux
        /* this.products.sort(function(a, b) {

            if (a.id < b.id)
            return 1;
            if (a.id > b.id)
            return -1;
            // a doit être égal à b
            return 0;

            // return a.id - b.id;
        }); */

    }
}
