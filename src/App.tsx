import { Button, Checkbox, Container, createMuiTheme, createStyles, CssBaseline, FormControlLabel, FormGroup, Grid, IconButton, Link, List, ListItem, ListItemText, makeStyles, Paper, Switch, Theme, Tooltip, Typography } from '@material-ui/core';
import { Brightness6, Brightness7 } from '@material-ui/icons';
import { ThemeProvider } from "@material-ui/styles";

import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    align: {
      textAlign: 'center'
    },
    root: {
      flexGrow: 1,
    },
    paper: {
      height:735,
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
  }),
);

const copyToClipboard = (content: string) => {
  const el = document.createElement('textarea');
  el.value = content;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  alert('Copied ' + content)
};

function App() {

  const classes = useStyles();

  interface intentsInterface {
    [key: string]: string[]
  }

  const basicIntents:string[] = [
    "READY",
    "RESUMED",
    "VOICE_SERVER_UPDATE",
    "USER_UPDATE"
  ]

  const intents : intentsInterface = {
    GUILDS: [
      "GUILD_CREATE",
      "GUILD_UPDATE",
      "GUILD_DELETE",
      "GUILD_ROLE_CREATE",
      "GUILD_ROLE_UPDATE",
      "GUILD_ROLE_DELETE",
      "CHANNEL_CREATE",
      "CHANNEL_UPDATE",
      "CHANNEL_DELETE",
      "CHANNEL_PINS_UPDATE"
    ], 
    GUILD_MEMBERS: [
      "GUILD_MEMBER_ADD",
      "GUILD_MEMBER_UPDATE",
      "GUILD_MEMBER_REMOVE"
    ], 
    GUILD_BANS: [
      "GUILD_BAN_ADD",
      "GUILD_BAN_REMOVE"
    ], 
    GUILD_EMOJIS: [
      "GUILD_EMOJIS_UPDATE"
    ], 
    GUILD_INTEGRATIONS: [
      "GUILD_INTEGRATIONS_UPDATE"
    ], 
    GUILD_WEBHOOKS: [
      "WEBHOOKS_UPDATE"
    ], 
    GUILD_INVITES: [
      "INVITE_CREATE",
      "INVITE_DELETE"
    ], 
    GUILD_VOICE_STATES: [
      "VOICE_STATE_UPDATE"
    ], 
    GUILD_PRESENCES: [
      "PRESENCE_UPDATE"
    ], 
    GUILD_MESSAGES: [
      "MESSAGE_CREATE",
      "MESSAGE_UPDATE",
      "MESSAGE_DELETE",
      "MESSAGE_DELETE_BULK"
    ], 
    GUILD_MESSAGE_REACTIONS: [
      "MESSAGE_REACTION_ADD",
      "MESSAGE_REACTION_REMOVE",
      "MESSAGE_REACTION_REMOVE_ALL",
      "MESSAGE_REACTION_REMOVE_EMOJI"
    ], 
    GUILD_MESSAGE_TYPING: [
      "TYPING_START"
    ], 
    DIRECT_MESSAGES: [
      "MESSAGE_CREATE",
      "MESSAGE_UPDATE",
      "MESSAGE_DELETE",
      "CHANNEL_PINS_UPDATE"
    ], 
    DIRECT_MESSAGE_REACTIONS: [
      "MESSAGE_REACTION_ADD",
      "MESSAGE_REACTION_REMOVE",
      "MESSAGE_REACTION_REMOVE_ALL",
      "MESSAGE_REACTION_REMOVE_EMOJI"
    ], 
    DIRECT_MESSAGE_TYPING: [
      "TYPING_START"
    ]
  }

  const [state, setState] : any = React.useState({
    theme: localStorage.getItem('theme') || 'dark',
    GUILDS: false,
    GUILD_MEMBERS: false,
    GUILD_BANS: false,
    GUILD_EMOJIS: false,
    GUILD_INTEGRATIONS: false,
    GUILD_WEBHOOKS: false,
    GUILD_INVITES: false,
    GUILD_VOICE_STATES: false,
    GUILD_PRESENCES: false,
    GUILD_MESSAGES: false,
    GUILD_MESSAGE_REACTIONS: false,
    GUILD_MESSAGE_TYPING: false,
    DIRECT_MESSAGES: false,
    DIRECT_MESSAGE_REACTIONS: false,
    DIRECT_MESSAGE_TYPING: false,
    privilegedIntents: {
      presence: localStorage.getItem('presenceIntent') === 'true' || false,
      guildMembers: localStorage.getItem('guildMembersIntent') === 'true' || false
    },
    intents: 0,
    eventsCount: 4
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>):void => {
    let intentsValue;
    let eventsCountValue;
    if(event.target.name !== "presence" && event.target.name !== "guildMembers") {
      if(event.target.checked) { 
        intentsValue = state.intents += 1 << Object.keys(state).indexOf(event.target.name)
        eventsCountValue = state.eventsCount+intents[event.target.name].length
      } else {
        intentsValue = state.intents -= 1 << Object.keys(state).indexOf(event.target.name) 
        eventsCountValue = state.eventsCount-intents[event.target.name].length
      }
      setState({ ...state, [event.target.name]: event.target.checked, intents: intentsValue, eventsCount: eventsCountValue});
    } else {
      if(event.target.name === "presence") {
        setState({ ...state, privilegedIntents: {presence: event.target.checked, guildMembers: state.privilegedIntents.guildMembers}});
        localStorage.setItem('presenceIntent', event.target.checked.toString())
      } else {
        setState({ ...state, privilegedIntents: {guildMembers: event.target.checked, presence: state.privilegedIntents.presence}});
        localStorage.setItem('guildMembersIntent', event.target.checked.toString())
      }
      
    }
    
  };

  const resetIntents = () => {
    setState({
      theme: state.theme,
      GUILDS: false,
      GUILD_MEMBERS: false,
      GUILD_BANS: false,
      GUILD_EMOJIS: false,
      GUILD_INTEGRATIONS: false,
      GUILD_WEBHOOKS: false,
      GUILD_INVITES: false,
      GUILD_VOICE_STATES: false,
      GUILD_PRESENCES: false,
      GUILD_MESSAGES: false,
      GUILD_MESSAGE_REACTIONS: false,
      GUILD_MESSAGE_TYPING: false,
      DIRECT_MESSAGES: false,
      DIRECT_MESSAGE_REACTIONS: false,
      DIRECT_MESSAGE_TYPING: false,
      privilegedIntents: state.privilegedIntents,
      intents: 0,
      eventsCount: basicIntents.length
    })
  }

  const theme = createMuiTheme({
    palette: {
      type: state.theme
    }
  });

  const darkMode = ():void => {
    if(state.theme === 'dark') {setState({...state, theme: 'light'}); localStorage.setItem('theme', 'light')} else {setState({...state, theme: 'dark'}); localStorage.setItem('theme', 'dark')}
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container className={classes.align}>
      <Typography variant='h4'>
        Discord Intents Calculator
      </Typography>

      <Typography variant='body1'>
        Learn more about <Link href="https://discord.com/developers/docs/topics/gateway#gateway-intents" target="_blank">Gateway Intents</Link>
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
      <Tooltip title={state.theme === 'dark' ? "Turn on the lights" : "Turn off the lights"}>
      <IconButton aria-label="theme" onClick={() => darkMode()}>
          {state.theme === 'dark' ? <Brightness7 fontSize='small' /> : <Brightness6 fontSize="small"/>}
        </IconButton>
      </Tooltip>
      

      <br/>

      <Grid container spacing={2} className={classes.root} direction='row' justify='center' alignItems='center'>
        <Grid item xs={4}>
          <Paper elevation={5} className={classes.paper}>
            <Typography variant='h6'>
              Intents
              </Typography>
            <FormGroup>
            {
              Object.keys(intents).map(key => 
                <FormControlLabel
                  control={<Checkbox checked={state[key]} onChange={handleChange} name={key} color='default' disabled={key === "GUILD_PRESENCES" ? !state.privilegedIntents.presence : key === "GUILD_MEMBERS" && !state.privilegedIntents.guildMembers} indeterminate={key === "GUILD_PRESENCES" ? !state.privilegedIntents.presence : key === "GUILD_MEMBERS" && !state.privilegedIntents.guildMembers} />}
                  label={key}
                  key={key}
                />
              )
            }
            {
              Object.keys(state).some(key => state[key] === true) && <Button onClick={() => resetIntents()} key='resetIntents'>Clear</Button> 
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
              basicIntents.map(intent => <Tooltip key={intent.toString()} title={"Open Discord Api Docs about #" + intent.toLowerCase().trim().replace(/_/g, "-")} >
              <ListItem onClick={() => window.open("https://discord.com/developers/docs/topics/gateway#" + intent.toLowerCase().trim().replace(/_/g, "-"), "_blank")} button>
                <ListItemText primary={intent} />
              </ListItem>
            </Tooltip>)
          }
          {
              Object.keys(state).filter(key => state[key] === true).map(key => {
                return intents[key].map((element, index) => {
                  return <Tooltip key={element+index.toString()} title={"Open Discord Api Docs about #" + element.toLowerCase().trim().replace(/_/g, "-")} >
                    <ListItem onClick={() => window.open("https://discord.com/developers/docs/topics/gateway#" + element.toLowerCase().trim().replace(/_/g, "-"), "_blank")} button>
                      <ListItemText primary={element} />
                    </ListItem>
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
        <Button variant="outlined" onClick={() => copyToClipboard(state.intents)}>
          Intents : {state.intents}
        </Button>
      </Tooltip>
      
      <br/>
      <Typography variant='caption'>Click on this button to copy</Typography>

      <p style={{color: 'gray'}}>Copyright © Aymen Djeghmoum - Larko#1783</p>      
    </Container>
    </ThemeProvider>
    
  );
}

export default App;
