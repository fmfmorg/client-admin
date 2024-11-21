import SignInForm from "../../components/sign-in";
import { fetchCSRF } from "../fetch-csrf";

const SignInPage = async () => {
    const csrf = await fetchCSRF() || ''
    return (
        <SignInForm {...{csrf}} />
    )
}

export default SignInPage