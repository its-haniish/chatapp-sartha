import React, { useState } from 'react';
import { RotatingLines } from "react-loader-spinner"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"

const App = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    dispatch({
      type: "join",
      payload: { ...formData }
    })
    setLoading(false);
    navigate("/chat");
  }

  return (
    <main className='w-screen h-screen bg-slate-100 flex justify-center items-center '>
      <form className='w-[80vw] h-[90vh] flex flex-col justify-start items-center gap-10' onSubmit={handleSubmit}>
        <h2 className='text-2xl'>Yooo, Jayesh wassup?</h2>
        <input name='name' type="text" placeholder='Full Name' className='py-1 px-2 text-l text-center rounded-lg outline-none shadow-md' onChange={handleChange} required />

        <div className='flex w-[100%] justify-between px-8 items-center '>
          <div className='flex justify-center items-center'>
            <label htmlFor="mentor" className='mr-2'>Mentor: </label>
            <input type="radio" id='mentor' name='title' value="mentor" onChange={handleChange} required />
          </div>

          <div className='flex justify-center items-center'>
            <label htmlFor="student" className='mr-2'>Student: </label>
            <input type="radio" id='student' name='title' value="student" onChange={handleChange} required />
          </div>

        </div>

        <button className='w-28 h-9 py-1 px-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-400 flex justify-center items-center'>
          {!loading ? "JOIN CHAT" : <RotatingLines height="30" width="30" strokeColor='white' />}
        </button>

      </form>
    </main>
  );
};

export default App;
