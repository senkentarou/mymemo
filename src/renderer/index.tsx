import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Typography, makeStyles, Theme, AppBar, Toolbar, Drawer, List, ListItem, ListItemText, IconButton, InputBase } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SearchIcon from '@material-ui/icons/Search';

declare global {
  interface Window {
    api: any
  }
};

type Memo = {
  id: number; // id
  title: string; // 見出し
  text: string; // 本文
  removed: boolean; // 論理削除フラグ
};

const ipcRenderer = window.api;

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
  listItemRoot: {
    backgroundColor: alpha(theme.palette.info.main, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.info.main, 0.25),
    },
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
  textInput: {
    width: '100% !important',
    height: '100% !important',
    overflow: 'auto !important'
  }
}));

const App: React.FC = () => {
  const classes = useStyles('');
  const [disableUpdate, setDisableUpdate] = useState<boolean>(false);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [currentMemo, setCurrentMemo] = useState<Memo>({
    id: 0,
    title: '',
    text: '',
    removed: false
  });

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value || '';

    const firstLine: string = text.split('\n')[0];
    const initialTitle: string = firstLine.length > 12 ? (firstLine.slice(0, 8) + ' ...') : firstLine
    const title = initialTitle === '' ? '[no title]' : initialTitle;

    if (disableUpdate) {
      setCurrentMemo({
        ...currentMemo,
        title: title,
        text: text
      });
      return;
    }

    setDisableUpdate(true);

    const targetMemoIndex = memos.findIndex((memo: Memo) => {
      return memo.id === currentMemo.id
    });
    const otherMemos = memos.filter((memo: Memo) => {
      return memo.id !== memos[targetMemoIndex]?.id;
    });
    const updateValue: Memo = {
      id: currentMemo.id,
      title: title,
      text: text,
      removed: currentMemo.removed
    };

    const savedMemos: Memo[] = await ipcRenderer.sendMemos('sendMemos', [updateValue].concat(otherMemos));

    setMemos(savedMemos);
    setCurrentMemo(updateValue);

    setTimeout((() => {setDisableUpdate(false)}), 500);
  };

  const handleOnCreateClick = async () => {
    const new_memo: Memo = {
      id: Math.round(new Date().getTime()),
      title: '[no title]',
      text: '',
      removed: false
    };

    const savedMemos: Memo[] = await ipcRenderer.sendMemos('sendMemos', [new_memo].concat(memos));

    setMemos(savedMemos);
    setCurrentMemo(new_memo);
  };

  const handleOnDeleteClick = async () => {
    const targetMemoIndex = memos.findIndex((memo: Memo) => {
      return memo.id === currentMemo.id
    });
    const otherMemos = memos.filter((memo: Memo) => {
      return memo.id !== memos[targetMemoIndex]?.id;
    });
    const updateValue: Memo = {
      id: currentMemo.id,
      title: currentMemo.title,
      text: currentMemo.text,
      removed: true
    };

    const savedMemos: Memo[] = await ipcRenderer.sendMemos('sendMemos', otherMemos.concat([updateValue]));

    setMemos(savedMemos);
    setCurrentMemo(savedMemos[0]);
  };

  useEffect(() => {
    (async () => {
      const result: Memo[] = await ipcRenderer.fetchMemos();
      if (result && result.length > 0) {
        setMemos(result);
        setCurrentMemo(result[0]);
      } else {
        const initial_memo: Memo = {
          id: Math.round(new Date().getTime()),
          title: '[no title]',
          text: '',
          removed: false
        };
        setMemos([initial_memo]);
        setCurrentMemo(initial_memo);
      }
    })();
  }, []);

  console.log(memos)

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            mymemo
          </Typography>

          <div className={classes.toolGroup}>
            <IconButton
              color="inherit"
              aria-label="delete"
              disabled={memos && memos.filter((memo: Memo) => { return !memo.removed }).length < 2}
              onClick={handleOnDeleteClick}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="postAdd"
              disabled={currentMemo.text === ''}
              onClick={handleOnCreateClick}
            >
              <PostAddIcon />
            </IconButton>
          </div>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search..."
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
            {memos.map((memo: Memo, index: number) => {
              if (!memo.removed) {
                if (memo.id === currentMemo.id) {
                  return (
                    <ListItem
                      key={currentMemo.id}
                      button
                      classes={{
                        root: classes.listItemRoot,
                      }}
                    >
                      <ListItemText primary={currentMemo.title} />
                    </ListItem>
                  );
                } else {
                  return (
                    <ListItem
                      key={memo.id}
                      button
                      onClick={() => {
                        setCurrentMemo(memos[index]);
                      }}
                    >
                      <ListItemText primary={memo.title} />
                    </ListItem>
                  );
                }
              }
            })}
          </List>
        </div>
      </Drawer>

      <main className={classes.mainContent}>
        <Toolbar />
        <div className={classes.textContent}>
          <InputBase
            multiline
            value={currentMemo.text}
            classes={{
              root: classes.textRoot,
              input: classes.textInput
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { handleOnChange(event) }}
          />
        </div>
      </main>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('contents'));
