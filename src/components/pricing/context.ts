import { createContext } from "react";

const ShowListContext = createContext<{
    updateShowList:(v:boolean)=>void;
}>({
    updateShowList:()=>{}
})

export default ShowListContext