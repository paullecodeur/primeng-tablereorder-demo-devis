import { Component, OnInit } from '@angular/core';
import { ProductService } from './productservice';
import { Product } from './product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent { 
    products: Product[];

    cols: any[];

    drapelem: any;
    elemDrop: any[]=[];

    constructor(private productService: ProductService) { }

    ngOnInit() {

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
                        elem2.number = compt + '.' + compt2.toString();
                        compt2++;
                    }
                })

                compt++;

            }
        })

    }

    insertAt(array, index) {
        var arrayToInsert = Array.prototype.splice.apply(arguments, [2]);
        return this.insertArrayAt(array, index, arrayToInsert);
    }
    
    insertArrayAt(array, index, arrayToInsert) {
        Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
        return array;
    }

    onDrop(rowdata, index){
        console.log(index);
        console.log('drop', rowdata)
        this.products.forEach(elem => {
            if(elem.parentId === this.drapelem.id)
            elem.visible = true;
        })

        this.elemDrop.forEach(elem => {
            const index = this.products.findIndex(ele=>ele.id === elem.id)
            if(index > -1)
            this.products.splice(index, 1);
            // console.log(elem);
        })

        const indexdrap = this.products.findIndex(ele=>ele.id === this.drapelem.id)

        this.insertArrayAt(this.products, indexdrap + 1, this.elemDrop);

        // mise à jour parent
        if(rowdata.rowType === 'ligne')
        this.products[indexdrap].parentId = rowdata.parentId;

        if(rowdata.rowType === 'section')
        this.products[indexdrap].parentId = rowdata.id;


        // numerotation
        this.numerotation();
        
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

    dragStart(rowdata){
        // alert('');
        this.elemDrop = [];
        this.drapelem = rowdata;
        console.log('drap start', rowdata)
        this.products.forEach((elem, index) => {
            if(elem.parentId === this.drapelem.id) {
                elem.visible = false;
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
