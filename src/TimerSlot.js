import React, { useState } from 'react'

export default function TimerSlot({timer, updateTimer}) {
  const [time, setTime] = useState(timer.time);
  const [text, setText] = useState(timer.text);
  console.log(timer)
  const handleBlur = () => {
    updateTimer(time, text)
  }
  return (
    <form className="timer">
          {/* <input className={`${timer.isActive ? 'input_active' : ''}`}
          type="number" value={time} 
          onChange={({target})=>setTime(target.value)}
          onBlur={handleBlur}
          /> */}
          <input className={`${timer.isActive ? 'input_active' : ''}`}
          type="text" value={text} 
          onChange={({target})=>setText(target.value)}
          onBlur={handleBlur}
          />
        </form>
  )
}


