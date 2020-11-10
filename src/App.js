import React, { useEffect, useState } from 'react';
import TimerSlot from './TimerSlot';
import { useSpeechSynthesis } from 'react-speech-kit';

import './App.css';
import { useStopwatch } from 'react-timer-hook';

export default function App() {
  const [timers, setTimers] = useState([
    {time: 1, text: 'Привет!', isActive: false},
    {time: 3, text: 'Ты можешь написать что-нибудь', isActive: false},
    {time: 6, text: 'И я просто скажу это', isActive: false},
    // {time: 9, text: 'Слева - секунда на которой будет произнесена фраза', isActive: false},
  ]);
  const { speak, speaking, supported, voices } = useSpeechSynthesis();
  const {
    seconds, isRunning, start, reset
  } = useStopwatch();

  const updateTimer = (i, time, text, isActive = false) => {    
    setTimers([...timers.slice(0, i), 
    {time, text, isActive}, ...timers.slice(i+1,)])
  }
  const addTimerSlot = () => {
    setTimers([...timers, {time: Math.floor(timers[timers.length-1]?.time 
      + (timers[timers.length-1]?.text.length>25
        ?timers[timers.length-1]?.text.length/10 
        :timers[timers.length-1]?.text.length/6)
        ) || 1, text: 'Cообщение', isActive: false}])
  }

  const resetTalk = () => {
    const newTimers = timers.map((timer) =>{
      timer.isActive = false        
      return timer
    })  
    setTimers(newTimers);
    reset();
  }

  useEffect(() => {
    const foundTimer = timers.find(({time}) => time == seconds)
    if (foundTimer) {    
      const ind = timers.indexOf(foundTimer);
      const newTimers = timers.map((timer, i, arr) =>{
        arr[i] == arr[ind] ? timer.isActive = true : timer.isActive = false        
        return timer
      })  
      setTimers(newTimers);
      speak({text: foundTimer.text, voice: voices[18]})
    }
    console.log(seconds, timers[timers.length-1]?.time+1)
    if (seconds > timers[timers.length-1]?.time+1) resetTalk();
  }, [seconds])



  return (
    <div className="app">
      <h2>Разговоры c браузером</h2>

      {supported && 
      <>
      <div className="timers">
        {timers.map((timer, index)=>
        <TimerSlot 
        key={index}
        timer={timer} 
        updateTimer={(time, text)=>updateTimer(index, time, text)}
        
        />)
        }

        <button className="add-button" onClick={addTimerSlot}>Добавить реплику +</button>
      </div>

     
      {/* <h2>{seconds}</h2> */}

      
      <div className="buttons">
        {!isRunning && <button className="start-button" onClick={start}>
          Говори!
          </button>}
        {isRunning && <button className="stop-button" onClick={resetTalk}>
          Прекрати
          </button>}
      </div> 
      </>}
      {!supported && <div>Ваш браузер не поддерживается приложением.</div>}
    </div>
  );
}
