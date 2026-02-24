import { useState } from "react"
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export function FakeStoreLoginPage(){

    const [userName, setUserName] = useState();
    const [cookie, setCookie, removeCookie] = useCookies(['userName']);
    const navigate = useNavigate();

    function handleUserName(e){
        setUserName(e.target.value);
        console.log(userName);
    }

    function handleSubmit(){
        setCookie('userName', userName);
        console.log(cookie['userName']);
        navigate('/Home');
    }

    return(
        <div>
            <h2 className="fs-4">Login To <span className="fw-bold fs-2 " style={{fontFamily:'fantasy'}}>{'FakeStore.'.toUpperCase()}</span></h2>
            <div className="d-flex justify-content-center">
                <form className="w-25">
                    <div className="d-flex my-2">
                        <label className="form-label mx-3" htmlFor="" >UserName</label>
                        <input className="form-control" onChange={handleUserName} type="text" />
                    </div>
                    <div className="d-flex my-2">
                        <label className="form-label mx-3" htmlFor="" >Password</label>
                        <input className="form-control" type="password" />
                    </div>
                    <button className="btn btn-dark" onClick={handleSubmit} type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}