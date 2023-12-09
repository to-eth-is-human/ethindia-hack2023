'use client'

import { useState, useRef, useEffect } from 'react'

import data from './data.json'

export default function Features() {
  
  const [tab, setTab] = useState<number>(1)

  const tabs = useRef<HTMLDivElement>(null)

  const heightFix = () => {
    if (tabs.current && tabs.current.parentElement) tabs.current.parentElement.style.height = `${tabs.current.clientHeight}px`
  }

  useEffect(() => {
    heightFix()
  }, []) 

  console.log(data)

  return (
    <section className="relative">

      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div className="absolute inset-0 bg-gray-100 pointer-events-none mb-16" aria-hidden="true"></div>
      <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h2 mt-12">Dashboard</h1>
            <p className="text-xl text-gray-600">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat.</p>
          </div>

          {/* Section content */}
          {/* <div className="md:grid md:grid-cols-12 md:gap-6"> */}

            {/* Content */}
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 light:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 light:bg-gray-700 light:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Accept
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Reject
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {[...Array(10)].map((elementInArray, i) => (  */}
                        {data.data.map((e, i) => ( 
                        <tr className="odd:bg-white odd:light:bg-gray-900 even:bg-gray-50 even:light:bg-gray-800 border-b light:border-gray-700" key={i}>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap light:text-white">
                                {e.description}
                            </th>
                            <td className="px-6 py-4">
                                {e.price}
                            </td>
                            <td className="px-6 py-4">
                            <   button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Accept</button>

                            </td>
                            <td className="px-6 py-4">
                                <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Reject</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>


          </div>

        </div>
      </div>
    </section>
  )
}