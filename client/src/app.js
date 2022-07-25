import * as React from 'react';
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material"
import SettingContext from '../src/components/settings/settingcontext';
import Pomodoro from "../src/components/home/pomodo/pomodo";
import Stopwatch from "../src/components/home/stopwatch/stopwatch";
import { Tabtiles } from "../src/components/GeneralFunctions"
import { Grid } from "@mui/material";
import {
    BrowserRouter as Router, Routes,
    Route
} from "react-router-dom";
import { BsGearFill, BsBarChartLine, BsClock } from 'react-icons/bs'
import Home from '../src/components/home/home';
import States from "../src/components/state/state";
import Setting from "../src/components/settings/setting.jsx";
import SidebarDrawer from '../src/components/drawer/drawer';
import GetUser from "../src/components/userdetails/userdetails"


const drawerWidth = 200;

function App(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [worktime, setWorktime] = useState(30);
    let [shortbrktime, setShortbrktime] = useState(5);
    let [longbrktime, setLongbrktime] = useState(20);
    let [rounds, setRounds] = useState(3);
    let [stateswitch, setStateswitch] = useState(false)
    let [tabseconds, setTabseconds] = useState(0)
    let [issignedin, setIssignedin] = useState(false)
    let [starttime, setStarttime] = useState(undefined)


    Tabtiles(`0${parseInt(tabseconds / 60)}`.slice(-2) + `:` + `0${tabseconds % 60}`.slice(-2) + " ⏳ | Pomo.do")

  
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    
    const items = [
      {
          href: '/',
          icon: (<BsGearFill fontSize="large" />),
          title: 'Pomodo'
      },
      {
          href: '/state',
          icon: (<BsBarChartLine fontSize="large" />),
          title: 'State'
      },
      {
          href: '/settings',
          icon: (<BsClock fontSize="large" />),
          title: 'Settings'
      }
  ];
   

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
          <GetUser/>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: "transparent", boxShadow: "none",
                    display: { xs: 'block', sm: 'none' },

                }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }} >

                    <Typography variant="h6" noWrap component="div" sx={{ color: "black" }}>
                        POMO.DO
                    </Typography>
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        {items.map((item) => (
                            <Button key={item} sx={{ color: 'black' }} href={item.href}>
                                {item.title}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <SidebarDrawer/>
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                       
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, justifyContent:"center", },
                    }}
                    open
                >
                    <SidebarDrawer/>
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <SettingContext.Provider value={{
                    worktime,
                    shortbrktime,
                    longbrktime,
                    rounds,
                    stateswitch,
                    tabseconds,
                    issignedin,
                    starttime,
                    setWorktime,
                    setShortbrktime,
                    setLongbrktime,
                    setRounds,
                    setStateswitch,
                    setTabseconds,
                    setIssignedin,
                    setStarttime
                }}>
                    <Router>
                        <Grid container>
                           
                            <Routes>


                                <Route exact path="/" element={<Home />}></Route>
                                <Route exact path="/pomodoro" element={<Pomodoro />}></Route>
                                <Route exact path="/stopwatch" element={<Stopwatch />}></Route>
                                <Route exact path="/state" element={<States />}></Route>
                                <Route exact path="/settings" element={<Setting />}></Route>


                            </Routes>

                        </Grid>
                        {/* </Grid> */}
                    </Router>
                </SettingContext.Provider>

            </Box>
        </Box>
    );
}


export default App;
