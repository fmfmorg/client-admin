import { createContext } from "react";

export const CsrfContext = createContext<{csrfToken:string}>({csrfToken:''})