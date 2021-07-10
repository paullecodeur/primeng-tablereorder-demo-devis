export interface Product {
    id?:number;
    code?:string;
    name?:string;
    description?:string;
    price?:number;
    quantity?:number;
    inventoryStatus?:string;
    category?:string;
    image?:string;
    rating?:number;
    number?:string;
    parentId?:number;
    visible?:boolean;
    rowType?: string;
}