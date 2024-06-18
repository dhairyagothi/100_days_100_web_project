import axios from 'axios';
import React, { useState } from 'react'
import { Profile } from './Profile';
import { Repo } from './Repo';
// import ''
export const Finder = () => {
    const token = process.env.REACT_APP_AUTH_TOKEN;
    // console.log(token);
    const [username,setUserName] = useState('');
    const [loading,setLoading] = useState(false);
    const [userNotFound,setUserNotFound]= useState(null);
    const [result,setResult] = useState('');
    async function getUserDetails(){
        try{
            setUserNotFound(null);
            setLoading(true);
            const response = await axios.get(`https://api.github.com/users/${username}`,{
                headers: {
                  Authorization:token
                }});
            console.log(response.data);
            setResult(response);
            setLoading(false);
            setUserNotFound(false);
        }
        catch(e){
            if(e.response.status===404){
                console.log("User not found ");
                setUserNotFound(true);
                setLoading(false);
            }
            else {
                console.log("error occured");
                setLoading(false);
            }
        }
    }

    function handleInput(e){
        setUserName(e.target.value)
    }
  return (
    <main className='text-white flex flex-col gap-20 ' >
        <section className='pt-10 text-xl'>
            GITHUB PROFILE FINDER
        </section>
        <section className='w-full flex justify-center items-center  gap-10'>
            <input placeholder='Enter GitHub Id' onChange={handleInput} value={username} className='h-15 rounded-xl bg-stone-800 p-2 ' />
            <button onClick={getUserDetails}>Search</button>
        </section>

        <section>
            {
                loading===true?<p>Loading.....</p>:
                <div>
                    {
                        userNotFound===false? <div className='flex flex-col justify-center items-center gap-5'>
                            <Profile data={result.data}/>
                            <Repo url={result.data.repos_url}/>
                        </div>:userNotFound===true?<p>User Not Found</p> :<>Search for the github profile :)</>
                    }
                    {/* data -> avatar_url,created_at,followers,following,name,
                    public_repo,repo_url */}
                </div>
            }
        </section>
        
    </main>
  )
}
