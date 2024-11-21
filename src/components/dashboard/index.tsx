'use client'

import SignedInWrapper from "../signed-in-wrapper"

const Dashboard = ({csrf}:{csrf:string}) => {
    return (
        <SignedInWrapper {...{csrf}}>
            <></>
        </SignedInWrapper>
    )
}

export default Dashboard