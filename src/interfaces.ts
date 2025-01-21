export interface ISpecification {
    id:number;
    name:string;
}

export interface IProductMainType {
    name:string;
    subtypes:ISpecification[];
}

export interface IProductTypes {
    [k:string]:IProductMainType;
}

export interface IDiscount {
    id:number;
    productID:string;
    amount:number;
    startDT:number;
    endDT:number;
}

export interface IStockQuantity {
    addressID:number;
    name:string;
    quantity:number;
}

export interface IProduct {
    id: string;
    name: string;
    description: string;
    metaDescription: string;
    specification:string;
    materialIDs: number[];
    metalColorID: number;
    productTypeID: number;
    price: number;
    discounts: IDiscount[];
    url: string;
    publicImages: string[];
    adminImages: string[];
    gmcImages: string[];
    stockQuantities: IStockQuantity[];
    createdAt: number;
    isRetired: boolean;
    supplierID:number;
    measurements:IProductMeasurement[];
    soldAsPair:boolean;
}

export interface IOrderOverviewItem {
    orderID:number;
    orderStatusID:number;
    orderDate:number;
    totalOrderAmountExDelivery:number;
    deliveryMethodID:number;
}

export interface IDeliveryMethod {
    id:number;
    name:string;
    cost:number;
    minSpendForFree:number;
    regionName:number;
}

export interface IOrder {
    orderID: number;
    orderStatusID: number;
    orderDate: number;
    paymentMethod: string;
    totalOrderAmountExDelivery: number;
    deliveryCharge: number;
    deliveryMethod: string;
    memberDiscountAmount: number;
    memberDiscountRate: number;
    staffDiscount: number;
    storewideDiscountVoucherCode: string;
    storewideDiscountVoucherRate: number;
    storewideDiscountVoucherAmount: number;
    email: string;
    firstName: string;
    lastName: string;
    lineOne: string;
    lineTwo:string;
    city: string;
    stateProvince: string;
    postcode: string;
    country: string;
    collectionPoint: string;
    region: string;
    trackingNumber: string;
    dispatchDT: number;
    receiptDT: number;
    orderDetails: string;
    isDirectDelivery:boolean;
}

export interface IProductImage {
    productID:string;
    filename:string;
}

export interface IOrderProductLocationQuantity {
    location:string;
    quantityAtLocation:number;
}

export interface IOrderProduct {
    productID:string;
    imageFilename:string;
    quantitySold:number;
    locationQuantities:IOrderProductLocationQuantity[];
}

export interface IProductMeasurement {
    id?:string;
    width:number;
    depth:number;
    height:number;
    weight:number;
}