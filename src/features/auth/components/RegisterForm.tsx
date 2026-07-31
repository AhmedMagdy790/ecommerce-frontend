import type { RegisterPayload } from "../types/auth.types";


interface Props {

    onSubmit:
    (data:RegisterPayload)=>void;

    loading:boolean;

}


export default function RegisterForm({
    onSubmit,
    loading
}:Props){


function handleSubmit(
e:React.FormEvent<HTMLFormElement>
){

e.preventDefault();


const form =
new FormData(e.currentTarget);


onSubmit({

name:
form.get("name") as string,


email:
form.get("email") as string,


phone:
form.get("phone") as string,


password:
form.get("password") as string,


password_confirmation:
form.get("password_confirmation") as string

});


}


return (

<form onSubmit={handleSubmit}>


<input
name="name"
/>


<input
name="email"
/>


<input
name="phone"
/>


<input
name="password"
type="password"
/>


<input
name="password_confirmation"
type="password"
/>


<button disabled={loading}>

{
loading
?
"Loading..."
:
"Register"
}

</button>


</form>

);


}