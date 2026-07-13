import loginConnector from "./loginConnector.jsx";
import dashboardConnector from "./dashboardConnector.jsx";
import detectLeavingPageConnector from "./detectLeavingPageConnector.jsx";
import mercadoPagoBySucursalConfigurationConnector from "@/connectors/mercadoPagoBySucursalConfigurationConnector.jsx";
import InicioSucursalAlertasConnector from "@/connectors/InicioSucursalAlertasConnector.jsx";

export default () =>
{
    loginConnector();
    dashboardConnector();
    detectLeavingPageConnector();
    mercadoPagoBySucursalConfigurationConnector();
    InicioSucursalAlertasConnector();
}
