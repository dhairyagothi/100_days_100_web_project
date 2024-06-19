import React from 'react'

export const Profile = ({data}) => {
  return (
    <section className='flex gap-20 border-2 justify-center max-w-[600px] p-5 rounded-2xl'>
        <div>
            <img alt='profilepicture' src={data.avatar_url} className='w-48 rounded-full '/>
        </div>
        
        <div className='flex flex-col items-start gap-2'>
        <h2>{data.name}</h2>
        <p>Username: {data.login}</p>
        <p>Location: {data.location}</p>
        <p>Followers: {data.followers}</p>
        <p>Following: {data.following}</p>
        <p>Public Repos: {data.public_repos}</p>
        <a href={data.html_url} target='blank' > Github profile link</a>
        </div>
    
    </section>
  )
}
