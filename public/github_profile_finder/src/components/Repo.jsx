import React,{useState} from 'react'
import axios from 'axios';
import { RepoDetails } from './RepoDetails';

export const Repo = ({url}) => {
    const [loading,setLoading] = useState(false);
    const [isError,setIsError] = useState(false);
    const [repoDetails,setRepoDetails] = useState(undefined);
    async function getRepoDetails(){
        try{
            // console.log(url);
            setIsError(false);
            setLoading(true);
            const response = await axios.get(url);
            // console.log(response);
            // console.log(response.data.length)
            const number=Math.min(5,response.data.length)
            // console.log(number);
            const array=response.data.slice(0,number);
            // console.log(array);
            setRepoDetails(array);
            // console.log(repoDetails)
            setLoading(false);
        }
        catch(e){
            console.log(e);
            setIsError(true);
            setLoading(false);
        }
    }

  return (
    <div>
        <button onClick={getRepoDetails}>Show repos</button>
        <div className='flex flex-wrap gap-5'>
            {
                loading?<p>Loading......</p>:isError?<p>Error occured while fetching</p>:<>
                    {/* full_name,html_url,name,stargazers_url,language */}
                   {/* { console.log(repoDetails[0])} */}
                    {repoDetails!==undefined && 
                        repoDetails.map((item)=>{
                            return <RepoDetails item={item}/>
                        })
                            
                    }
                </>
            }
        </div>
    </div>
  )
}
