import { suggestionions } from '@/app/_components/Hero'
import React from 'react'

function EmptyBoxState({onSelectOption}:any) {
  return (
    <div className='mt-3'>
      <h2 className='font-bold text-3xl text-center'>Start Planning New <strong className='text-purple-700'>Trip From Here</strong></h2>
    <p className='text-center text-gray-400 mt-2'>Where to next? Type your dream destination, city, or landmark, and watch as we craft your perfect personalized trip itinerary instantly!"

Want it more adventurous, cozy, or futuristic? I can tweak it</p>
    
    <div className='flex flex-col gap-5 mt-5'>
                    {suggestionions.map((suggestion, index) => (
                        <div key={index}
                        onClick={()=>onSelectOption(suggestion.title)}
                        className='flex items-center gap-2 border rounded-xl p-3  cursor-pointer hover:border-purple-700 hover:text-purple-700' >
                            {suggestion.icons}
                            <h2 className='text-lg'>{suggestion.title}</h2>
                        </div>
                    ))}
    
                </div>
    
    
    
    
    
    </div>

  )
}

export default EmptyBoxState
