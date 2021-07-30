import React from 'react';
import ReactDOM from 'react-dom';
import { Typography, makeStyles, Theme, AppBar, Toolbar, Drawer, List, ListItem, ListItemText, IconButton, InputBase } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  title: {
    margin: '0 16px',
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  toolGroup: {
    display: 'flex',
    flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  drawer: {
    width: '64px',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      width: '256px',
    },
  },
  drawerPaper: {
    width: '64px',
    [theme.breakpoints.up('sm')]: {
      width: '256px',
    },
  },
  drawerContainer: {
    height: '100%',
    overflow: 'auto',
  },
  mainContent: {
    flexGrow: 1,
    padding: theme.spacing(1),
    height: `calc(100vh - ${theme.spacing(2)}px)`,
  },
  textContent: {
    padding: theme.spacing(2),
    height: `calc(100vh - ${theme.spacing(13)}px)`,
  },
  textRoot: {
    width: '100%',
    height: `calc(100vh - ${theme.spacing(11)}px)`
  },
  textArea: {
    width: '100% !important',
    height: '100% !important',
    overflow: 'auto !important'
  }
}));

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            mymemo
          </Typography>

          <div className={classes.toolGroup}>
            <IconButton color="inherit" aria-label="delete">
              <DeleteIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="postAdd">
              <PostAddIcon />
            </IconButton>
          </div>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button key={'sample'}>
              <ListItemText primary={'sample'} />
            </ListItem>
          </List>
        </div>
      </Drawer>

      <main className={classes.mainContent}>
        <Toolbar />
        <div className={classes.textContent}>
          <InputBase
            multiline
            defaultValue=""
            classes={{
              root: classes.textRoot,
              input: classes.textArea
            }}
          />
        </div>
      </main>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('contents'));
