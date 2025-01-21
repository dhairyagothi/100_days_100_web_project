import React, { useEffect, useState } from 'react'
import './LineChart.css'
import Chart from 'react-google-charts'

const LineChart = ({historicalData}) => {

    const [data, setData] = useState(['Data', 'Prices'])

    useEffect(() => {
        let dataCopy = [["Data","Prices"]]
        if(historicalData.prices){
            historicalData.prices.map((item) => {
                dataCopy.push([`${new Date(item[0]).toLocaleDateString().slice(0,-5)}`, item[1]])
            })
            setData(dataCopy)
        }
    }, [historicalData])
  return (
    <Chart  
        chartType='LineChart'
        data={data}
        height="100%"
        legendToggle
    />      
  )
}

export default LineChart
