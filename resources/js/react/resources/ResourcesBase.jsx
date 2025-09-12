
import {ValidationError} from "../exceptions/Exceptions.jsx";
export default class ResourcesBase{



    processResponse(response)
    {
        if(response.status < 300)
        {
            return response.data;
        }
    }

    handleError(errorResponse)
    {
        if(errorResponse.status === 400)
        {
            throw new ValidationError(
                errorResponse?.response.data?.message ?? 'Revise los datos, estos no son validos',
                errorResponse?.response.data?.extra ?? ''
                );
        }

        throw new Error(error?.response.message ?? 'Error no determinado realizando la operacion');
    }


}
