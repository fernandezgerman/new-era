import loginConnector from "./loginConnector.jsx";
import dashboardConnector from "./dashboardConnector.jsx";
import detectLeavingPageConnector from "./detectLeavingPageConnector.jsx";

export default () =>
{
    loginConnector();
    dashboardConnector();
    detectLeavingPageConnector();
}
