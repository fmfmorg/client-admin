'use client'

import { Typography } from "@mui/material";
import { useState } from 'react';

const Test = () => {
    const [a,setA] = useState('ABC')
    return (
        <Typography>{a}</Typography>
    )
}

export default Test