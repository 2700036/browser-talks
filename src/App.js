import React, { useEffect, useState } from 'react';
import TimerSlot from './TimerSlot';
import { useSpeechSynthesis } from 'react-speech-kit';

import './App.css';
import { useStopwatch } from 'react-timer-hook';
import { randomPrase } from './utils';



export default function App() {
  const [timers, setTimers] = useState([
    {id: 1, text: 'Привет!', placeholder: 'Сообщение', isActive: false},
    {id: 2, text: 'Ты можешь написать что-нибудь', placeholder: 'Сообщение', isActive: false},
    {id: 3, text: 'И я просто скажу это', placeholder: 'Сообщение', isActive: false},
    
  ]);
  const [currentPhrase, setCurrentPhrase] = useState({id: 0, text: ' ', placeholder: 'Сообщение', isActive: false});
  const { speak, speaking, supported, voices } = useSpeechSynthesis();
  const {
    isRunning, start, reset
  } = useStopwatch();

  function setNextTimer (){
    setCurrentPhrase((currentPhrase)=>{
      const i = timers.findIndex(el=>el.id === currentPhrase.id)      
      if(!timers[i+1])resetTalk();        
      return timers[i+1]}); 
  
      setTimers(timers.map((timer) =>{
        timer.id === currentPhrase.id ? timer.isActive = true : timer.isActive = false        
        return timer
      }));
  }

  const resetTalk = () => {    
    setTimeout(() => {
      const newTimers = timers.map((timer) =>{
        timer.isActive = false        
        return timer
      })  
      setTimers(newTimers);      
    }, 2000);    
    
    reset();
    setCurrentPhrase({id: 0, text: ' ', placeholder: 'Сообщение', isActive: false});
  }

  const startTalk = () => {
    if(currentPhrase.id == 0 ){
      speak({text: currentPhrase.text})
      setCurrentPhrase(timers[0])
      start()      
      return
    }
    if(currentPhrase.text.length < 1){
      speak({text: randomPrase()})
      setNextTimer ()
      return
    }
    if(speaking)return;
    start()            
    setTimeout(() => {       
      speak({text: currentPhrase.text})
    }, 700)
  
    setNextTimer ()

  };
  
    const updateTimer = (i, text) => {      
      const newTimers = timers.map(timer => timer.id == i ? {...timer, text, isActive: false, placeholder: 'Сообщение'} : timer)   
      setTimers(newTimers);
     
  }

  useEffect(() => {
    if(!isRunning || speaking)return; 
           
    startTalk();
  }, [speaking])

  const addTimerSlot = () => {
    setTimers([...timers, {id: Math.floor(Math.random() * 1000000), text: '', placeholder: 'Сообщение', isActive: false}])
  }

  return (
    <div className="app">
      <h2>Разговоры c браузером</h2>

      {supported && 
      <>
      <div className="timers">
        {timers.map((timer)=>
        <TimerSlot 
        key={timer.id}
        timer={timer} 
        updateTimer={(text)=>updateTimer(timer.id, text)}
        
        />)
        }

        <button className="add-button" onClick={addTimerSlot}>Добавить реплику +</button>
      </div>
      
      <div className="buttons">
        {!isRunning && <button className="start-button" onClick={startTalk}>
          Говори!
          </button>}
        {isRunning && <button className="stop-button" 
        onClick={resetTalk}
        >
          Прекрати
          </button>}
      </div> 
      </>}
      {!supported && <div>Ваш браузер не поддерживается приложением.</div>}
    </div>
  );
}
