import React, { useState } from 'react'

export default function TimerSlot({timer, updateTimer}) {  
  const [text, setText] = useState(timer.text);
  
  const handleBlur = (e) => {
    e.preventDefault();   
    updateTimer(text)
  }
  return (
    <form className="timer" onSubmit={handleBlur}>          
          <input className={`${timer.isActive ? 'input_active' : ''}`}
          type="text" value={text} placeholder={timer.placeholder}
          onChange={({target})=>setText(target.value)}
          onBlur={handleBlur}
          
          />
        </form>
  )
}


