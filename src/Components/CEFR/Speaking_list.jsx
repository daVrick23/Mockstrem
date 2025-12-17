import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function Speaking_list({ isPremium = false }) {
    return (
        <div className='w-full min-h-full h-max bg-white rounded-lg shadow-xl flex flex-col p-5'>
            <h3 className='text-3xl font-semibold'>CEFR speakings</h3>
            <div className="list w-full min-h-full h-max flex items-center flex-col mt-5">
                <Link to={`/mock/cefr/speaking/4`} target='_blank' className="speaking-card w-full h-max rounded-lg shadow-xl bg-slate-200 p-4 flex items-center justify-between transition-all duration-500 hover:translate-1 cursor-pointer active:translate-y-1" >
                    <h5 className="text-slate-900 text-xl">Speaking 9</h5>

                    <span className="text-white px-4 py-2 bg-blue-400 rounded-lg">Take exam</span>
                </Link>
            </div>
        </div>
    )
}
