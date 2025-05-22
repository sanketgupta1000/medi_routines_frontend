import config from "../configs/config";
import { InvalidDataError, NetworkError, UnknownError } from "../utils/errors/sharedErrors";
import { InvalidCredentialsError } from "../utils/errors/userErrors";

interface UserDefinedMedicine
{
    id: string;
    name: string;
};

interface CreateUserDefinedMedicineRequest
{
    token: string;
    name: string;
};

interface UserDefinedMedicineResponse
{
    userDefinedMedicine: UserDefinedMedicine;
};

interface GetAllUserDefinedMedicinesRequest
{
    token: string;
};

interface GetAllUserDefinedMedicinesResponse
{
    userDefinedMedicines: UserDefinedMedicine[];
};

class UserDefinedMedicineService
{
    // method to create a new user-defined medicine
    async createUserDefinedMedicine(request: CreateUserDefinedMedicineRequest): Promise<UserDefinedMedicineResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/user-defined-medicine`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${request.token}`,
                },
                body: JSON.stringify({
                    name: request.name,
                }),
            });
        }
        catch (error)
        {
            console.log(error);
            throw new NetworkError('Please check your network connection');
        }

        if(response.status === 401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }
        if(response.status === 422)
        {
            throw new InvalidDataError((await response.json()).message);
        }
        if(response.status!=201)
        {
            throw new UnknownError('An unknown error occurred');
        }

        const data = await response.json();

        return data as UserDefinedMedicineResponse;
    }

    // method to get all user-defined medicines
    async getAllUserDefinedMedicines(request: GetAllUserDefinedMedicinesRequest): Promise<GetAllUserDefinedMedicinesResponse>
    {
        let response: Response;

        try
        {
            response = await fetch(`${config.baseUrl}/api/user-defined-medicine`, 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${request.token}`,
                },
            });
        }
        catch (error)
        {
            console.log(error);
            throw new NetworkError('Please check your network connection');
        }

        if(response.status === 401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }
        if(response.status!=200)
        {
            throw new UnknownError('An unknown error occurred');
        }

        const data = await response.json();

        return data as GetAllUserDefinedMedicinesResponse;
    }

};

export default new UserDefinedMedicineService();
export type {
    UserDefinedMedicine,
    CreateUserDefinedMedicineRequest,
    UserDefinedMedicineResponse,
    GetAllUserDefinedMedicinesRequest,
    GetAllUserDefinedMedicinesResponse
};