export interface ISpecification {
    id:number;
    name:string;
}

export interface IPurchaseRecordItem {
    movementID:number;
    internalSkuID:string;
    quantity:number;
    quantityEdited:boolean;
    costRmb:number;
    costRmbEdited:boolean;
}

export interface IInternalMovementRecord {
    movementID:number;
    receiptDT:number;
    movementTypeID:number;
}

export interface IInternalItemSpecification {
    internalSkuID:string;
    metalColorID:number;
    metalColorEdited:boolean;
    productTypeID:number;
    productTypeEdited:boolean;
    image:string;
    imageEdited:boolean;
}

export interface IProductTypeMapItem {
    id:number;
    mainTypeID:number;
    subTypeID:number;
}