import React, { useEffect, useRef, useState } from 'react'
import { IoMdSend } from "react-icons/io";
import { useSelector } from 'react-redux';
import { io } from "socket.io-client"
import { useNavigate } from 'react-router-dom';

const ChatApp = () => {
    const [msgs, setMsgs] = useState([]);
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [msgBox, setMsgBox] = useState("");
    const [selected, setSelected] = useState("");
    const msgDivRef = useRef(null);
    const [isChatting, setIsChatting] = useState(false);
    const { name, title } = useSelector(state => state.reducer)
    const navigate = useNavigate();


    const handleChange = (e) => { setMsgBox(e.target.value) }
    const handleSelect = (e) => { setSelected(e.target.value) }

    const handleSendMsg = (e) => {
        e.preventDefault();
        if (msgBox === "") {
            return;
        }
        setMsgs([...msgs, { sender: name, message: msgBox }])
        socket.emit("new-message", { sender: name, message: msgBox, reciever: selected })
        setMsgBox("");
    }
    const scrollToBottom = () => {
        if (msgDivRef.current) {
            msgDivRef.current.scrollTop = msgDivRef.current.scrollHeight;
        }
    };
    const handleStartChat = () => {
        console.log("selected: ", selected)
        if (selected === "") {
            alert("Select user to chat with.")

        } else {
            setIsChatting(true);
        }

    }

    socket?.on("new-user", (users) => {
        setUsers([...users]);
    });

    socket?.on("user-disconnected", (user) => {
        setUsers(prev => prev.filter(elem => elem.name !== user.name));
    });


    socket?.on("new-message", (data) => {
        console.log(msgs);
        setMsgs(prevMsgs => {
            const isDuplicate = prevMsgs.some(msg => msg.message === data.message);
            if (!isDuplicate) {
                return [...prevMsgs, data];
            }
            return prevMsgs;
        });
        scrollToBottom();
    });



    useEffect(() => {
        if (name === "" || title === "")
            navigate('/')
        const newSocket = io('https://chatapp-sartha.onrender.com', { query: { name, title } }); // Replace with your server URL
        setSocket(newSocket);


        // Clean up function to close socket connection when component unmounts
        return () => {
            if (newSocket) {
                newSocket.close();
            }
        };
    }, [name, title, navigate])
    return (
        <main className='w-screen flex-col items-center justify-between h-[10%]'>
            <div className='flex justify-center items-center py-1'>
                <h2 className='px-2 font-bold'>{!isChatting ? `Hey, ${name} ` : `Chatting with ${selected}`}</h2>
                {
                    isChatting ? null :
                        <select name={title === "student" ? "mentor" : "student"} className="text-xl rounded-lg px-2 outline-none border-none" onChange={handleSelect} >
                            <option value="">Select {title === "student" ? "Mentor" : "Student"}</option>
                            {
                                users.map(user => {
                                    if (title !== user?.title) {
                                        return (<option value={user.name} key={user.name}>{user.name}</option>)
                                    } else {
                                        return null;
                                    }
                                })
                            }
                        </select>
                }
            </div>
            {

                !isChatting ? null :
                    <div className='w-[100%] h-[82vh] border-t overflow-y-scroll ' ref={msgDivRef}>
                        {msgs.map((elem, index) => {
                            const { sender, message } = elem;
                            return (
                                <div key={index} className={`w-screen flex ${sender === name ? "justify-end" : "justify-start"} items-center  px-2`} >
                                    <p
                                        className={`w-fit mt-1 mb-4 max-w-[80%] ${sender === name ? ' bg-green-200' : ' bg-blue-200'} rounded-xl border-none py-1 px-2`}
                                    >
                                        {message}
                                    </p>
                                </div>

                            );
                        })}
                    </div>

            }


            {!isChatting ? <div className='w-screen flex justify-center items-center'> <button
                className='bg-blue-600 rounded-md text-white text-center py-1 px-3 mt-5'
                onClick={handleStartChat}
            >Start Chat</button></div> :
                <form onSubmit={handleSendMsg} className='h-10 min-h-10 max-h-fit w-[100vw] bg-white flex justify-center items-center shadow rounded-lg'>
                    <input type="text" placeholder='Write here...' onChange={handleChange}
                        value={msgBox}
                        className='h-[100%] w-[80%] outline-none px-2 py-1 text-[1rem] text-justify' />
                    <button className='h-[100%] w-[10%] bg-white  border-l flex justify-center items-center'>
                        <IoMdSend color='blue' size="25px" />
                    </button>
                </form>}
        </main>
    )
}

export default ChatApp
