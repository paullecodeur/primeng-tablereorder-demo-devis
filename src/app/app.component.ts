import { Component, OnInit } from '@angular/core';
import { ProductService } from './productservice';
import { Product } from './product';
import { MenuItem, SelectItem } from 'primeng/api';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 

    items: MenuItem[];
    products: Product[];

    cols: any[];

    drapelem: any;
    drapIndex: any;

    statuses: SelectItem[];

    separateur = '.';

    niveauParent = 2;



    constructor(private productService: ProductService) { }

    ngOnInit() {

        this.statuses = [{label: 'Ligne', value: 'ligne'},{label: 'Section', value: 'section'}]

        this.productService.getProductsSmall().then(data => {
            
            this.products = data;
            this.numerotation();

        });

        this.cols = [
            // { field: 'order', header: '' },
            { field: 'number', header: 'Num' },
            { field: 'name', header: 'Name' },
            { field: 'id', header: 'ID' },
            { field: 'quantity', header: 'Quantity' },
            { field: 'category', header: 'Category' },
            // { field: 'rating', header: 'Rating' }
        ];

        this.items = [
            {
               label:'File',
               icon:'pi pi-fw pi-file',
               items:[
                  {
                     label:'New',
                     icon:'pi pi-fw pi-plus',
                     items:[
                        {
                           label:'Bookmark',
                           icon:'pi pi-fw pi-bookmark',
                           command: () => alert('')
                        },
                        {
                           label:'Video',
                           icon:'pi pi-fw pi-video'
                        },

                     ]
                  },
                  {
                     label:'Delete',
                     icon:'pi pi-fw pi-trash'
                  },
                  {
                     separator:true
                  },
                  {
                     label:'Export',
                     icon:'pi pi-fw pi-external-link'
                  }
               ]
            },
            {
               label:'Edit',
               icon:'pi pi-fw pi-pencil',
               items:[
                  {
                     label:'Left',
                     icon:'pi pi-fw pi-align-left'
                  },
                  {
                     label:'Right',
                     icon:'pi pi-fw pi-align-right'
                  },
                  {
                     label:'Center',
                     icon:'pi pi-fw pi-align-center'
                  },
                  {
                     label:'Justify',
                     icon:'pi pi-fw pi-align-justify'
                  },

               ]
            },
            {
               label:'Users',
               icon:'pi pi-fw pi-user',
               items:[
                  {
                     label:'New',
                     icon:'pi pi-fw pi-user-plus',

                  },
                  {
                     label:'Delete',
                     icon:'pi pi-fw pi-user-minus',

                  },
                  {
                     label:'Search',
                     icon:'pi pi-fw pi-users',
                     items:[
                        {
                           label:'Filter',
                           icon:'pi pi-fw pi-filter',
                           items:[
                              {
                                 label:'Print',
                                 icon:'pi pi-fw pi-print'
                              }
                           ]
                        },
                        {
                           icon:'pi pi-fw pi-bars',
                           label:'List'
                        }
                     ]
                  }
               ]
            },
            {
               label:'Events',
               icon:'pi pi-fw pi-calendar',
               items:[
                  {
                     label:'Edit',
                     icon:'pi pi-fw pi-pencil',
                     items:[
                        {
                           label:'Save',
                           icon:'pi pi-fw pi-calendar-plus'
                        },
                        {
                           label:'Delete',
                           icon:'pi pi-fw pi-calendar-minus'
                        },

                     ]
                  },
                  {
                     label:'Archieve',
                     icon:'pi pi-fw pi-calendar-times',
                     items:[
                        {
                           label:'Remove',
                           icon:'pi pi-fw pi-calendar-minus'
                        }
                     ]
                  }
               ]
            },
            {
               separator:true
            },
            {
               label:'Quit',
               icon:'pi pi-fw pi-power-off'
            }
        ];

        // numerotation
        // this.numerotation();

    }


    

    recurciveNumerotation(parent, comptorder) {

        let compt = 0;
        this.products.forEach((elem) => {
            if(elem.parentId === parent.id) {
                // si on trouve un fils on le  compte
                compt++;
                comptorder.value++;
                elem.number = parent.number + this.separateur + compt.toString();
                elem.order = comptorder.value;
                // on recommence le processus pour chaque fils trouvé
                this.recurciveNumerotation(elem, comptorder);
            }
        })

    }

    recurciveTotal(racine, parent) {

        this.products.forEach((elem) => {
            if(elem.parentId === parent.id ) {
                // si on trouve un fils on le  compte
                if(elem.rowType === "ligne"){
                    racine.quantity += elem.quantity ;
                }

                if(elem.rowType === "section") {
                    this.recurciveTotal(racine, elem);
                } 
                
                // on recommence le processus pour chaque fils trouvé
            }
        })

    }

    calculTotaux() {

        // Initialize total
        const comptTotal = {
            // The `value` is inside `ref` variable object
            // The initial value is `1`
            value: 0
        };
        this.products.forEach((elem, index) => {
            if(elem.rowType === "section") {
                elem.quantity = 0;
                this.recurciveTotal(elem, elem);
            } else {
                comptTotal.value += elem.quantity;
            }
        })

    }

    recurciveNbrFils(comptTotal, parent) {

        this.products.forEach((elem) => {
            if(elem.parentId === parent.id ) {
                // si on trouve un fils on le  compte
                if(elem.rowType === "ligne"){
                    comptTotal.value++ ;
                }

                if(elem.rowType === "section") {
                    this.recurciveNbrFils(comptTotal, elem);
                } 
                
                // on recommence le processus pour chaque fils trouvé
            }
        })

    }

    nbrFils(index) {

        // Initialize total
        const comptTotal = {
            // The `value` is inside `ref` variable object
            // The initial value is `1`
            value: 0
        };
        
        this.recurciveNbrFils(comptTotal, this.products[index]);
          

        return comptTotal.value

    }

    editComplete(event) {
        console.log(event)
        this.calculTotaux();
    }

    numerotation() {

        
        this.calculTotaux();

        // primitive type variables like strings and numbers are always passed by value.
        // Arrays and Objects are passed by reference or by value based on these conditions:
            /* if you are setting the value of an object or array it is Pass by Value.

            object1 = {prop: "car"};
            array1 = [1,2,3];

            if you are changing a property value of an object or array then it is Pass by Reference.

            object1.prop = "car";
            array1[0] = 9; */

        // Initialize `comptorder` as object
        const comptorder = {
            // The `value` is inside `ref` variable object
            // The initial value is `1`
            value: 0
        };
        let compt = 0;
        this.products.forEach((elem, index) => {
            if(elem.parentId === null) {
                // si on trouve un parent on le  compte
                compt++;
                comptorder.value++;
                elem.number = compt.toString();
                elem.order = comptorder.value;
                this.recurciveNumerotation(elem, comptorder);
            }
        })



        
        /* const separateur = ' ' + '.' + ' '

        this.products.forEach((elem, index) => {
            if(elem.parentId === null) {
                elem.number = compt.toString();
                
                let compt2 = 1;
                this.products.forEach((elem2, index2) => {
                    if(elem2.parentId === elem.id) {
                        elem2.number = elem.number + separateur + compt2.toString() ;

                        let compt3 = 1;
                        this.products.forEach((elem3, index3) => {
                            if(elem3.parentId === elem2.id) {
                                elem3.number = elem2.number + separateur + compt3.toString() ;
                                compt3++;
                            }
                        })

                        compt2++;
                    }
                })

                compt++;

            }
        }) */

        // sort
        this.products.sort(function(a, b) {

            if (a.order < b.order)
            return -1;
            if (a.order > b.order)
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


    } 

    
    expand(rowData){
        //alert()
        rowData.expand = true;
        this.products.forEach((elem) => {
            if(elem.parentId === rowData.id) {
                // si on trouve un fils on le  masque
                elem.visible = true; 
                elem.expand = true;
                this.expand(elem);
            }
        })

    }

    close(rowData){
        rowData.expand = false;
        this.products.forEach((elem) => {
            if(elem.parentId === rowData.id) {
                // si on trouve un fils on le  masque
                elem.visible = false; 
                elem.expand = false;
                this.close(elem);
            }
        })

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

    recurciveHidden(parent) {

        this.products.forEach((elem) => {
            if(elem.parentId === parent.id) {
                // si on trouve un fils on le  masque
                elem.visible = false; 
                this.recurciveHidden(elem);
            }
        })
    }

    recurciveShow(parent) {

        this.products.forEach((elem) => {
            if(elem.parentId === parent.id) {
                // si on trouve un fils on le  masque
                elem.visible = true; 
                this.recurciveShow(elem);
            }
        })
    
    }


    dragStart(rowData, index){
        // alert('');
        this.drapelem = rowData;
        this.drapIndex = index;
        console.log('drap start', rowData)
        // if(rowData.expand || rowData.expand === undefined)
        this.recurciveHidden(this.drapelem);
    }

    dragEnd(rowData) {
        console.log('drap end', rowData)
        
        
        // numerotation
        this.numerotation();

        if(rowData.expand || rowData.expand === undefined)
        this.recurciveShow(this.drapelem);
    }

    dragleave(rowData, index){
        //console.log('dragleave', rowData)

        const droprow = rowData;
        const indexdrap = this.products.findIndex(ele=>ele.id === this.drapelem.id)

        // mise à jour parent
        if(droprow.rowType === 'ligne') {
            
            if(this.products[indexdrap].rowType === 'ligne') {
                this.products[indexdrap].parentId = droprow.parentId;
            }

            
            if(this.products[indexdrap].rowType === 'section' ) {
                
                if(this.parentLevel(droprow) < this.niveauParent) // controle niveau parent 
                this.products[indexdrap].parentId = droprow.parentId;
            }
        }

        if(droprow.rowType === 'section') {

            if(this.products[indexdrap].rowType === 'ligne') {
                if(indexdrap > index) // en descendant
                this.products[indexdrap].parentId = droprow.id; // la ligne devient sous ligne
                else // en montant
                this.products[indexdrap].parentId = droprow.parentId;
            }

            if(this.products[indexdrap].rowType === 'section') {
                if(indexdrap > index) {// en descendant
                    if(this.parentLevel(droprow) < (this.niveauParent-1)) // la section devient une sous section si le niveau n'est pas encore atteind
                    this.products[indexdrap].parentId = droprow.id;
                }
                else // en montant
                this.products[indexdrap].parentId = droprow.parentId;
            } 
        } 

    }

    dragover(){
        console.log('drapover')
        
    }

   

    dragenter(index: number){
        // alert('');
        const indexdrap = this.products.findIndex(ele=>ele.id === this.drapelem.id);
        // console.log('drapenter', this.products[indexdrap])

        // this.arraymove(this.products, indexdrap, index);
        moveItemInArray(this.products, indexdrap, index); 


    
    }

    arraymove(arr, fromIndex, toIndex) {
        /* var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        // this.insertAt(arr, toIndex)
        arr.splice(toIndex, 0, element); */
        
        arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
    }

    onRowReorder(event) {
        console.log('onRowReorder', event)
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
