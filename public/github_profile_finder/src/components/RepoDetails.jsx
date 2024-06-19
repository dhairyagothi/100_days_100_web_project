import React from 'react'

export const RepoDetails = ({item}) => {
  return (
    <div className='flex flex-col items-start gap-2 border-2 rounded-2xl p-4'>
        <div className='flex flex-col items-start'>
            <h2>Name: {item.name}</h2>
            <h2>Language: {item.language}</h2>
        </div>
        <div className='flex justify-center w-full'>
            <a href={item.html_url} target='blank'>Repo link</a>
        </div>
    </div>
  )
}
