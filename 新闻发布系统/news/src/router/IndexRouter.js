import React, { Component } from 'react'
import { BrowserRouter ,Switch,Route,Redirect} from 'react-router-dom'
import Login from '../views/login/Login'
// import Home from '../views/sandbox/home/Home'
// import Box from '../views/box/box'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import News from '../views/news/News'
import Detail from '../views/news/Detail'
export default class IndexRouter extends Component {
  render(){
    return (
    // <div>
        <BrowserRouter>
            <Switch>
                <Route path="/login"   component={Login}/>
                <Route path="/news"   component={News}/>
                <Route path="/detail/:id"   component={Detail}/>
                <Route path="/" render={() => 
                    localStorage.getItem("token")?
                    <NewsSandBox></NewsSandBox>:
                    <Redirect to="/login" />
                } />
            </Switch>
        </BrowserRouter>
    // </div>
  )
}
  
}
