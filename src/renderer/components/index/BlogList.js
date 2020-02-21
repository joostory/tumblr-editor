import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, ListSubheader, Button, Avatar, Typography } from '@material-ui/core'
import BlogListItem from './BlogListItem'
import { selectBlog } from '../../actions'
import { Paper, makeStyles } from '@material-ui/core'
import Providers from '../../constants/Providers'

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  logo: {
    display: 'flex',
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1)
  },
  title: {
    display: 'flex',
    flexGrow: 1
  }
}))

function ServiceListHeader({service}) {
  const classes = useStyles()
  const provider = Providers.find(p => p.name == service.auth.provider)

  return (
    <ListSubheader className={classes.header}>
      <Avatar src={provider.logo} className={classes.logo} />
      <Typography component='div' className={classes.title}>
        {service.user.name}
      </Typography>
      <Button variant='text' color='secondary' size='small'>
        연결해제
      </Button>
    </ListSubheader>
  )
}

export default function BlogList({afterSelect}) {
  const classes = useStyles()
  const accounts = useSelector(state => state.accounts)
  const dispatch = useDispatch()

  function handleSelectBlog(auth, blog) {
    dispatch(selectBlog(auth, blog))
    if (afterSelect) {
      afterSelect()
    }
  }

  if (!accounts || accounts.length == 0) {
    return (
      <Paper className={classes.paper} variant='outlined' square>
        연결된 블로그가 없습니다.
      </Paper>
    )
  }

  return (
    <>
      {accounts.map(account =>
        <List key={account.auth.uuid} subheader={<ServiceListHeader service={account} />}>
          {account.blogs.sort((a,b) =>
            a.primary? -1 : b.primary? 1 : 0
          ).map(blog =>
            <li key={blog.url}>
              <BlogListItem
                blog={blog}
                onSelect={e => handleSelectBlog(account.auth, blog)}
              />
            </li>
          )}
        </List>
      )}
    </>
  )
}
