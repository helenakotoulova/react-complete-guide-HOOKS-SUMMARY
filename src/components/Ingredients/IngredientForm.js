import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';

// sice tady mame React.memo, ale i tak se nekdy rerenderuje, kdyz neni potreba => proto musime v Ingredients.js hodit addIngredientHandler do useCallbacku, aby se pri renderu Ingredients nevytvarela znovu a nezpusobovala rerender IngredientFOrm
// to stejne pro INgredientList a removeItemHandler => bud opet jako React.memo v ingredients List + usecallback v Ingredients nebo useMemo v Ingredients.
// storing components je obecne lepsi pomoci React.memo, ale pomoci useMemo() muzeme store jakykoliv data, ktery nechceme recreatovat pri kazdem renderu
const IngredientForm = React.memo(props => {
  const [enteredTitle, setEnteredTitle]= useState(''); // inputState je array. [currentState,setState]. proto pozice [0] vyjadruje ten aktualni stav.
  const [enteredAmount, setEnteredAmount]= useState('');
  const submitHandler = event => {
    event.preventDefault();
    const ingredient = {title: enteredTitle, amount: enteredAmount};
    props.onAddIngredient(ingredient)
  };

  const titleHandler = (event) => {
    //const newTitle = event.target.value;
    //setInputState(prevInputState => {return {title: newTitle, amount: prevInputState.amount}}) // tady nemuzu psat title:event.target.value, protoze mi do toho nevstupuje ten event. musim si to nadefinovat nad tim
    setEnteredTitle(event.target.value)
  }

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={enteredTitle} onChange={titleHandler}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={enteredAmount} onChange={event => {setEnteredAmount(event.target.value)}}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
