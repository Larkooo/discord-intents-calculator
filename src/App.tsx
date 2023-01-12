import { Button, Checkbox, Container, CssBaseline, FormControlLabel, FormGroup, Grid, IconButton, Link, List, ListItemButton, ListItemText, Paper, Switch, Theme, Tooltip, Typography } from '@mui/material';
import { Brightness6, Brightness7 } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import React from 'react';

import { defaultIntents, intents } from './Intents';

const useStyles = makeStyles()((theme: Theme) => {
  return {
    align: {
      textAlign: 'center'
    },
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 735,
      maxWidth: 400,
      margin: 'auto',
      padding: theme.spacing(2),
      overflow: 'auto'
    },
    control: {
      padding: theme.spacing(2),
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }
});

function App() {

  const { classes } = useStyles();

  const initialState = {
    theme: localStorage.getItem('theme') || 'dark',
    // just map the intent keys here; with false as default value
    ...Object.keys(intents).reduce((acc: any, curr) => {
      acc[curr] = false;
      return acc;
    }, {}),
    privilegedIntents: {
      presence: localStorage.getItem('presenceIntent') === 'true' || false,
      guildMembers: localStorage.getItem('guildMembersIntent') === 'true' || false,
      messageContent: localStorage.getItem('messageContentIntent') === 'true' || false
    },
    intents: 0,
    eventsCount: defaultIntents.length
  };

  const [state, setState] : any = React.useState(initialState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>):void => {
    let intentsValue: number = state.intents;
    let eventsCountValue: number = state.eventsCount;
    if (event.target.name !== "presence" && event.target.name !== "guildMembers" && event.target.name !== "messageContent") {
      intentsValue += (event.target.checked ? 1 : -1) << intents[event.target.name][1];
      event.target.checked ? eventsCountValue += intents[event.target.name][0].length : eventsCountValue -= intents[event.target.name][0].length;
      setState({ ...state, [event.target.name]: event.target.checked, intents: intentsValue, eventsCount: eventsCountValue });
    } else {
      if (event.target.name === "presence") {
        setState({ ...state, privilegedIntents: { presence: event.target.checked, guildMembers: state.privilegedIntents.guildMembers, messageContent: state.privilegedIntents.messageContent } });
        localStorage.setItem('presenceIntent', event.target.checked.toString())
      } else if (event.target.name === "messageContent") {
        setState({ ...state, privilegedIntents: { messageContent: event.target.checked, guildMembers: state.privilegedIntents.guildMembers, presence: state.privilegedIntents.presence } });
        localStorage.setItem('messageContentIntent', event.target.checked.toString())
      } else {
        setState({ ...state, privilegedIntents: { guildMembers: event.target.checked, presence: state.privilegedIntents.presence, messageContent: state.privilegedIntents.messageContent } });
        localStorage.setItem('guildMembersIntent', event.target.checked.toString())
      }

    }

  };

  const resetIntents = () => {
    setState(initialState);
  }

  const theme = createTheme({
    palette: {
      mode: state.theme,
      primary: {
        main: '#265CFF',
      },
      ...(state.theme === 'dark' ?
        {
          background: {
            default: '#303030',
            paper: '424242'
          },
        }
      :
        {
          background: {
            default: '#fafafa',
            paper: '#fff'
          },
        }

      )
    }
  });

  const toggleLights = ():void => {
    if (state.theme === 'dark') {
      setState({ ...state, theme: 'light' });
      localStorage.setItem('theme', 'light');
    }
    else {
      setState({ ...state, theme: 'dark' });
      localStorage.setItem('theme', 'dark');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container className={classes.align}>
        <Typography variant='h4' paddingTop={'0.5rem'}>
          Discord Intents Calculator
        </Typography>

        <Typography variant='body1'>
          Learn more about <Link href="https://discord.com/developers/docs/topics/gateway#gateway-intents" target="_blank" underline='hover'>Gateway Intents</Link>
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={state.privilegedIntents.presence}
              onChange={handleChange}
              name="presence"
              color="primary"
            />
          }
          label="Presence Intent"
        />
        <FormControlLabel
          control={
            <Switch
              checked={state.privilegedIntents.guildMembers}
              onChange={handleChange}
              name="guildMembers"
              color="primary"
            />
          }
          label="Server Members"
        />
        <FormControlLabel
          control={
            <Switch
              checked={state.privilegedIntents.messageContent}
              onChange={handleChange}
              name="messageContent"
              color="primary"
            />
          }
          label="Message Content"
        />
        <Tooltip title={state.theme === 'dark' ? "Turn on the lights" : "Turn off the lights"}>
          <IconButton aria-label="theme" onClick={() => toggleLights()}>
            {state.theme === 'dark' ? <Brightness7 fontSize='small' /> : <Brightness6 fontSize="small" />}
          </IconButton>
        </Tooltip>


        <br/>

        <Grid container spacing={2} className={classes.root} direction='row' justifyContent='center' alignItems='center'>
          <Grid item xs={4}>
            <Paper elevation={5} className={classes.paper}>
              <Typography variant='h6'>
                Intents
              </Typography>
              <FormGroup>
                {
                  Object.keys(intents).map(key =>
                    <FormControlLabel
                      control={<Checkbox checked={state[key]} onChange={handleChange} name={key} color='primary' disabled={key === "GUILD_PRESENCES" ? !state.privilegedIntents.presence : key === "GUILD_MEMBERS" ? !state.privilegedIntents.guildMembers : key === "MESSAGE_CONTENT" && !state.privilegedIntents.messageContent} indeterminate={key === "GUILD_PRESENCES" ? !state.privilegedIntents.presence : key === "GUILD_MEMBERS" ? !state.privilegedIntents.guildMembers : key === "MESSAGE_CONTENT" && !state.privilegedIntents.messageContent} />}
                      label={key}
                      key={key}
                    />
                  )
                }
                {
                  Object.keys(state).some(key => state[key] === true) && <Button onClick={() => resetIntents()} key='resetIntents'>Clear</Button>
                }
              </FormGroup>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={5} className={classes.paper}>
              <Typography variant='h6'>
                What you have access to ({state.eventsCount} events)
              </Typography>
              <List dense component="div" role="list">
                {
                  defaultIntents.map(intent => <Tooltip key={intent.toString()} title={"Open Discord Api Docs about #" + intent.toLowerCase().trim().replace(/_/g, "-").replaceAll('*', '')} >
                    <ListItemButton onClick={() => window.open("https://discord.com/developers/docs/topics/gateway-events#" + intent.toLowerCase().trim().replace(/_/g, "-").replaceAll('*', ''), "_blank")} >
                      <ListItemText primary={intent} />
                    </ListItemButton>
                  </Tooltip>)
                }
                {
                  Object.keys(state).filter(key => state[key] === true && key in intents).map(key => {
                    return intents[key][0].map((element, index) => {
                      return <Tooltip key={element + index.toString()} title={"Open Discord Api Docs about #" + element.toLowerCase().trim().replace(/_/g, "-").replaceAll('*', '')} >
                        <ListItemButton onClick={() => window.open("https://discord.com/developers/docs/topics/gateway-events#" + element.toLowerCase().trim().replace(/_/g, "-").replaceAll('*', ''), "_blank")} >
                          <ListItemText primary={element} />
                        </ListItemButton>
                      </Tooltip>
                    })
                  })
                }
              </List>

            </Paper>
          </Grid>
        </Grid>

        <br/>

        <Tooltip title="Copy Intents Payload">
          <Button variant="outlined" color="inherit" onClick={async () => {
            await navigator.clipboard.writeText(state.intents)
            alert(`Your intent payload has just been copied to the clipboard.  (${state.intents})\nJust set this as your intents payload on the discord api library you're using and you should be ready to go!`)
          }}>
            Intents : {state.intents}
          </Button>
        </Tooltip>

        <br/>
        <Typography variant='caption'>Click on this button to copy</Typography>

        <p style={{ color: 'gray' }}>Copyright © {new Date().getFullYear()} Nasr AA Djeghmoum - Larko#0742 - <Link href="https://github.com/Larkooo/discord-intents-calculator" underline="always" target="_blank">Github</Link></p>
      </Container>
    </ThemeProvider>

  );
}

export default App;
