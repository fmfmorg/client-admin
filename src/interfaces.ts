export interface ISpecification {
    id:number;
    name:string;
}

export interface IPurchaseRecordItem {
    id:number;
    movementID:number;
    internalSkuID:string;
    quantity:number;
    quantityTemp:number;
    costRmb:number;
    purchaseQuantity:number;
    purchaseQuantityTemp:number;
    supplierID:number;
    page:string;
    variation:string;
    productSupplierID:number;
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
    // supplierID:number;
    // page:string;
    // variation:string;
}

export interface IProductTypeMapItem {
    id:number;
    mainTypeID:number;
    subTypeID:number;
}

export interface ISkuMapItem {
    external:string;
    internal:string;
}

export interface IExternalItem {
    externalSkuID:string;
    price:number;
    priceTemp:number;
    labelQty:number;
    dtUpdated:number;
}

export interface IProductSupplierItem {
    productSupplierID:number;
    supplierID:number;
    internalSkuID:string;
}