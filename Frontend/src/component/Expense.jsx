// src/component/Expense.jsx

import React, {
    useEffect,
    useState
} from "react";

import { MdDeleteForever } from "react-icons/md";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

function Expense(props) {
    const navigate = useNavigate();

    useEffect(() => {
        // localStorage.removeItem('token')
        if (!localStorage.getItem('token')) {
            navigate("/login");
        }
    }, [])

    let { id } = useParams();

    const [expenses, setExpenses] = useState({});
    const [expAdd, setExpAdd] = useState(true);
    const [expDelete, setExpDelete] = useState(true);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    async function fetchExpenses() {
        try {
            const response = await
                fetch(`http://localhost:4000/budget/${id}/expenses`, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },// Assuming token is stored in local storage
                });
            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }
            const data = await response.json();
            console.log(data.data)
            if (data.data) {
                setExpenses(data.data);
            }


        } catch (error) {
            console.log(error.message)
            console.error('Error fetching expenses:', error);
        }
    };

    function convertDecimal(amount) {
        return Number(amount).toFixed(2);
    }

    useEffect(() => {

        fetchExpenses();
    }, [id]); // Runs whenever budgetId changes

    useEffect(() => {
        fetchExpenses();
    }, [expAdd, expDelete]); // Runs whenever budgetId changes


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await
                fetch(`http://localhost:4000/budget/${id}/expenses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token'),
                    },// Assuming token is stored in local storage
                    body: JSON.stringify({ name, amount }),
                });

            if (!response.ok) {
                throw new Error('Failed to add expense');
            }

            const data = await response.json();
            console.log('Expense added:', data);
            alert("added")
            setExpAdd(!expAdd)
            /*
             Handle success: e.g., 
            show a success message or update the UI 
            */
        } catch (error) {
            console.error('Error adding expense:', error);
            // Handle error: e.g., show an error message to the user
        }
    };

    const deleteItem = async (eid) => {
        try {
            if (confirm("Are you sure want to delete?")) {
                console.log(eid);
                if (eid) {
                    const response = await
                        fetch(`http://localhost:4000/budget/${id}/expenses/${eid}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: localStorage.getItem('token'),
                            },// Assuming token is stored in local storage
                            body: JSON.stringify({}),
                        });

                    if (!response.ok) {
                        throw new Error('Failed to add expense');
                    }
                }
                setExpDelete(!expDelete);

            }
        }
        catch (error) {

        }
    }

    return (
        <>
            <div><h1 className="logo">
                <u>EMS</u>
            </h1>
            </div>
            <h2 style={{
                textAlign: 'center'
            }}>
                Budget Name: {expenses.name}</h2>
            <Link to={`/`}>
                <button className='btn_exp'>
                    Back
                </button>
            </Link>

            <div className="float-container">
                <div className="first-child">
                    <form className="form_exp" onSubmit={handleSubmit}>
                        <input
                            required="required"
                            type="text"
                            placeholder="Expense Details"
                            className="input_exp"
                            value={name} onChange={
                                (e) => setName(e.target.value)}
                        />
                        <input required="required" type="number" placeholder="Amount"
                            value={amount} onChange={
                                (e) => setAmount(e.target.value)}
                            className="input_exp" />
                        <br />
                        <input type="submit" value="Add"
                            className="btn_exp" />
                    </form>
                </div>
                <div className="second-child">
                    <h1 className="text_exp2">Budget: &#8377; {convertDecimal(expenses.total)}</h1>
                    <h1 className="text_exp2">Used: &#8377; {convertDecimal(expenses.used)}</h1>
                    <h1 className="text_exp2">Remaining: &#8377; {convertDecimal(expenses.available)}</h1>
                </div>

            </div>
            <div className="float-container">
                <div className="separate-child">
                    <h2>Expenses List</h2>
                    <br />

                    <ul className="newul">
                        {expenses?.budgets?.expenses?.map((item) => {
                            return (
                                <li className="li_exp">
                                    <span className="name_exp">
                                        {item.name}
                                    </span>

                                    <span className="a_exp">
                                        {item.amount}
                                    </span>
                                    <span className="name_exp">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </span>
                                    <button onClick={() => deleteItem(item._id)} className='btn_danger'>
                                        Delete Expense
                                    </button>

                                </li>

                            )
                        })}
                    </ul>
                </div>
            </div>

        </>
    );
}

export default Expense;