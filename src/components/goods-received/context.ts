import { createContext } from "react";

export const GoodsReceivedContext = createContext<{
    productIDs:string[];
    imageMap:Map<string,string>;
}>({
    productIDs:[],
    imageMap:new Map()
})