export interface ISpecification {
    id:number;
    name:string;
}

export interface IPurchaseRecordItem {
    movementID:number;
    internalSkuID:string;
    quantity:number;
    quantityTemp:number;
    costRmb:number;
}

export interface IInternalMovementRecord {
    movementID:number;
    receiptDT:number;
    movementTypeID:number;
}

export interface IInternalItemSpecification {
    internalSkuID:string;
    metalColorID:number;
    productTypeID:number;
    image:string;
}

export interface IProductTypeMapItem {
    id:number;
    mainTypeID:number;
    subTypeID:number;
}