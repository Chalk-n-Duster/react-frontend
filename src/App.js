import React from 'react';
import Math from './maths/mathjax-loader'
import Layout from './components/layout'
import { Component } from 'react';
// import functionPlot from 'function-plot';
import LineChart from './maths/vector2dplot'
import FunctionPlot from './maths/func_plot'
import {Form,Button} from 'semantic-ui-react'
import Plotter from './maths/plotter_adv'

class App extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  state={
    func_txt:'',
    expression:''
  }
  
 onSubmit=(event)=>{
   event.preventDefault()
   this.setState({expression:this.state.func_txt})
   console.log(this.state.expression)
 }

  render(){
  return (
    <Layout
      render={({setLoading,setNotLoading}) => (
      // <Math ></Math>
      // <LineChart x={5} y={5}/>
      <div>
        <Plotter explist={[
        {
          type:'implicit',
          expression:'x^2+y^2-z^2',
          
        },
        {
          type:'implicit',
          expression:'x+y+z-2',
          
        },
        ]}/>
      <Form onSubmit={this.onSubmit}>
    <Form.Field>
      <label>Enter function...</label>
      <input placeholder='Function' value={this.state.func_txt} onChange={event => this.setState({ func_txt: event.target.value })}/>
    </Form.Field>
    <Button type='submit' primary>Go!</Button>
  </Form>
      </div>
      
     
      )}
    />
  );
}
}

export default App;
