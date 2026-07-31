import { useMutation } from "@tanstack/react-query";

import { registerService } from "../services/auth.service";

import type { RegisterPayload } from "../types/auth.types";


export function useRegister(){


return useMutation({

    mutationFn:
    (data:RegisterPayload)=>
        registerService(data)

});


}