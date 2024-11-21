import { fetchCSRF } from "../fetch-csrf"
import Dashboard from "../../components/dashboard"

const DashboardPage = async () => {
    const csrf = await fetchCSRF() || ''
    return (
        <Dashboard {...{csrf}} />
    )
}

export default DashboardPage