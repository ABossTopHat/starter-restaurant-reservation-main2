import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function ReservationForm(
){
    const history = useHistory()
    const base = {
        first_name: '',
        last_name: '',
        mobile_number: '000-000-0000',
        reservation_date: '',
        reservation_time: '',
        people: 0
    }
    const [form, setForm] = useState(base)

    function changeHandler({target: {name, value}}){
        if(name === 'people'){
            setForm((prevState)=>({
                ...prevState,
                [name]: Number(value)
            }))
        }else{
            setForm((prevState) => ({
                ...prevState,
                [name]: value
            }));
        } 
     
    }
    function submitHandler(event){
        event.preventDefault();
        console.log('form value:',form)
        console.log('form.people', typeof form.people)
        console.log('form.people', Number(form.people))
        console.log('form.people', typeof form.people)
        createReservation(form)
        .then(history.push(`/dashboard?date=${form.reservation_date}`))
        // .then(setForm(base))
        //create reservation function that connects to backend
    }

    return(
        <>
        <form onSubmit={submitHandler}>
            <div className='formGroup'>
                <label>Name</label>
                <input
                    type='text'
                    id='firstName'
                    name='first_name'
                    value={form.first_name}
                    required={true}
                    placeholder='First Name'
                    onChange={changeHandler}
                />
                    <input
                    type='text'
                    id='lastName'
                    name='last_name'
                    value={form.last_name}
                    required={true}
                    placeholder='Last Name'
                    onChange={changeHandler}
                />
                    <input
                    type='phone'
                    id='mobileNumber'
                    name='mobile_number'
                    value={form.mobile_number}
                    required={true}
                    placeholder='000-000-0000'
                    onChange={changeHandler}
                />
                     <input
                    type='date'
                    id='reservation_date'
                    name='reservation_date'
                    value={form.reservation_date}
                    required={true}
                    placeholder='01/01/01'
                    onChange={changeHandler}
                />
                    <input
                    type='time'
                    id='reservation_time'
                    name='reservation_time'
                    value={form.reservation_time}
                    required={true}
                    placeholder='12:00 am'
                    onChange={changeHandler}
                />
                    <input
                    type='number'
                    id='people'
                    name='people'
                    value={form.people}
                    required={true}
                    placeholder='Number of People'
                    onChange={changeHandler}
                />
                
            </div>
            <button type='submit' className='btn' onClick={submitHandler}>Submit Reservation</button>
            <button type='cancel' className='btn' onClick={submitHandler}>Cancel</button>
        </form>

        </>
    )
}