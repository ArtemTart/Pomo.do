import React, {useState, useEffect ,useRef, useContext} from 'react'
import { CircularProgress, Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import "./pomodo.css"
import SettingContext from '../../settings/settingcontext';
import {Howl, Howler} from 'howler';
import { Tabtiles } from '../../GeneralFunctions';
const soundSrc = "https://www.mboxdrive.com/Clockk.mp3"

var sound = new Howl({
  src: soundSrc,
  loop: true,
  preload: true,
  volume: 1,
  html5: true
});

export default function Pomodoro() {
  
 let settingcontext =  useContext(SettingContext);
 let [ispaused, setIspaused]=useState(false)
 let [secondsleft, setSecondsleft] = useState(0);
 let [rounds, setRounds] = useState (settingcontext.rounds*2-1)
 let [mode, setMode] = useState("work") //"work" || "shortbrk" || "longbrk"
 
let ispausedRef = useRef(ispaused)
let secondsleftRef = useRef(secondsleft)
let modedRef = useRef(mode)
let roundsRef = useRef (rounds)






let Tick = ()=>{
  secondsleftRef.current--;
  setSecondsleft(secondsleftRef.current);
  
}

    

let initTicker= ()=>{
  setIspaused(true);
  ispausedRef.current = true;
  
}
let stopTicker=()=>{
  setIspaused(false)
  ispausedRef.current = false;
  //setSecondsleft(secondsleftRef.current);
}

let resethndler = ()=>{
  settingcontext.setStateswitch(false)
  setIspaused(false)
  ispausedRef.current = false;
  secondsleftRef.current = settingcontext.worktime*60;
  setSecondsleft(settingcontext.worktime*60);
  setRounds(settingcontext.rounds*2-1);
      roundsRef.current= settingcontext.rounds*2-1;
      settingcontext.setTabseconds(0);
}


useEffect(()=>{

  let switchMode=()=>{
    console.log("switchmode : ", roundsRef.current);
    let nextmode = modedRef.current==="work" 
    ? roundsRef.current > 0? "shortbrk": "longbrk" 
    : "work" ;
    setMode(nextmode);
    modedRef.current = nextmode;

    let nextSesson = nextmode ==="work" 
    ? (settingcontext.worktime*60) 
    : nextmode === "longbrk" ?
    (settingcontext.longbrktime*60)
    :(settingcontext.shortbrktime*60);
    console.log("State is: ", nextmode);
    setSecondsleft(nextSesson);
    secondsleftRef.current = nextSesson;
    
    
  }
  let countRound = ()=>{
    //console.log("countrounds before ", roundsRef.current);
    roundsRef.current--;
    setRounds(roundsRef.current);
    //console.log("countrounds aftr s ", roundsRef.current);
    if (roundsRef.current < 0){
      setRounds(settingcontext.rounds*2-1);
      roundsRef.current= settingcontext.rounds*2-1;
    }
   // console.log("countrounds affter ", roundsRef.current);
  }
  
  secondsleftRef.current = settingcontext.worktime*60;
  setSecondsleft(settingcontext.worktime*60);


  let interval = setInterval(()=>{
if (!ispausedRef.current){
return;
}
if (secondsleftRef.current ===0){
  sound.playing()? sound.stop() : sound.play();
  countRound();
  switchMode();
  
}
  else{ 
    Tick();
    }
  },1000);
  
  return ()=> clearInterval(interval);
  

},[settingcontext])

useEffect(()=>{
  
},[secondsleft])
 
const totalSeconds = mode === "work" 
? (settingcontext.worktime*60) 
: mode === "longbrk" ?
(settingcontext.longbrktime*60)
:(settingcontext.shortbrktime*60);
const percentage = Math.round(secondsleft / totalSeconds * 100);

Tabtiles(`0${parseInt(secondsleft/60)}`.slice(-2)+ ":" +`0${secondsleft%60}`.slice(-2) + " ⏳ | " + "Pomo.do" )
    return (
        <div className='timer'>
          <Box position="relative" display="inline-flex">
            
      <CircularProgress variant="determinate" value={percentage}
          style={{display: "flex",
          height: "100%",
          width: "250px"}} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography
          variant="caption"
          component="div"
          fontSize="40px"
          fontWeight="800"
          color="var(--black)"
        >{`0${parseInt(secondsleft/60)}`.slice(-2)+ ":" +`0${secondsleft%60}`.slice(-2)}</Typography>
         <Typography
          variant="caption"
          component="div"
          fontSize="20px"
          fontWeight="800"
          color="var(--black)"
        >{ mode === "work" ? "Focus" : "Break"}</Typography>
        <Typography color="var(--liteblack)" fontSize="12px" >Pomo.do</Typography>
      </Box>
    </Box>
          
         
          
          <div className="btnwrap">
          <Button 
          className='button' 
          variant="outlined" 
          startIcon={<ReplayIcon />} 
          onClick={()=>{sound.stop();resethndler(); settingcontext.setStateswitch(false)}}
          >
            Reset
          </Button>
            {!ispaused ? 
            <Button 
            className='button' 
            variant="contained" 
            onClick={()=>{sound.play(); initTicker(); settingcontext.setStateswitch(true)}} 
            endIcon={<PlayCircleOutlineIcon />}>
            Start
          </Button>
            : <Button 
            className='button' 
            variant="contained" 
            onClick={()=>{sound.stop(); stopTicker();}} 
            endIcon={<PauseCircleOutlineIcon />}>
            Pause
          </Button>}
          </div>
          <Typography color="var(--liteblack)">{Math.floor((rounds+1)/2)} of {settingcontext.rounds} sessions left</Typography>
          
          
        </div>
    )
}
