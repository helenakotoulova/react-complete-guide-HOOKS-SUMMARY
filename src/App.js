import React, { Fragment, useContext } from "react";

import Ingredients from "./components/Ingredients/Ingredients";
import Auth from "./components/Auth";
import { AuthContext } from "./context/auth-context";

const App = (props) => {
  const authCtx = useContext(AuthContext);

  return (
    <Fragment>
      {authCtx.isAuth && <Ingredients />}
      {!authCtx.isAuth && <Auth />}
    </Fragment>
  );
};
export default App;

/*
useEffect(()=> {
  const timer =setTimeout(()=> {
    console.log('ahoj')
  }, 500)
  return () => {
    clearTimeout(timer)
  };
},[])
*/

/*
State Batching:
setNewState(prevState=>prevState+1)
All state Updates from one and the same synchronous event handler are batched together a updatujou se az se spusti nejake fce
=> react batches the updates - tzn after setNewState() you cant immediately use the new state when NOT using the function form
tzn setError a setIsLoading updates pojedou pak zaroven. pri jednom renderu.
*/
