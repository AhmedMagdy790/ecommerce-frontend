import RegisterForm from "../components/RegisterForm";

import { useRegister } from "../hooks/useRegister";


export default function RegisterPage(){


const register =
useRegister();



function handleRegister(data:any){

register.mutate(data);

}



return (

<section>

<h1>
Create Account
</h1>


<RegisterForm

onSubmit={handleRegister}

loading={register.isPending}

/>


</section>

);


}


