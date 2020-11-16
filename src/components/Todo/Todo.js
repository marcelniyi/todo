import React from 'react';
import '../../App.css';
import firebase from '../../firebase';
import Navbar from '../Navbar/Navbar';


class Todo extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        todoList:[],
          title:'',
          completed:false,
          editing:false,
          user: localStorage.getItem("user")
      }
      this.handleSubmit = this.handleSubmit.bind(this)
  };

  componentWillMount(){
    this.fetchTasks();
    this.checkLogin();
  }

  fetchTasks = async () =>{
    const todos = await firebase.firestore().collection('todos').where('user','==', this.state.user).get();
    const result = todos.docs.map((item) => item.data());
    this.setState({
      todoList:result
    })
  }

  handleSubmit(e){
    e.preventDefault();
    firebase.firestore().collection('todos').add({
      id:'ID#_' + Math.random().toString(36).substr(2, 9),
      title: this.state.title,
      completed: false,
      user: this.state.user
    }).then(() =>
      this.fetchTasks()
    )
    this.setState({
      title:''
    })
};


   handleChange = (e)=>{
     var value = e.target.value;
     this.setState({
         title:value
     })
   }



   deleteItem(todo){
     var query = firebase.firestore().collection('todos').where('id','==',todo);
      query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete();
        });
      });
      this.fetchTasks();
   }


   strikeUnstrike(todo, state){
     console.log(!state);
     var query = firebase.firestore().collection('todos').where('id','==',todo);
      query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.update('completed', !state);
        });

      });
      this.fetchTasks();
   }

   checkLogin() {
     const user = localStorage.getItem("user");
     console.log(user)
     if(user !== null){
      this.setState({ user: user })
     }else{
      this.props.history.replace('/')
     }
   }



  render(){
    var tasks = this.state.todoList;
    //alert(this.state.user)
    var self = this
    return(

        <div className="container">
          <Navbar />
          <div id="task-container">
              <div  id="form-wrapper">
                 <form onSubmit={this.handleSubmit}  id="form">
                    <div className="flex-wrapper">
                        <div style={{flex: 6}}>
                            <input onChange={this.handleChange} className="form-control" id="title" value={this.state.title} type="text" name="title" placeholder="Add task.." />
                         </div>

                         <div style={{flex: 1}}>
                            <input id="submit" value="Add to list" className="btn btn-warning" type="submit" name="Add" />
                          </div>
                      </div>
                </form>

              </div>

              { tasks && tasks.length > 0 ?

              <div  id="list-wrapper">
                    {tasks.map(function(task, index){
                      return(

                          <div key={index} className="task-wrapper flex-wrapper">
                            <div onClick={() => self.strikeUnstrike(task.id, task.completed)} style={{flex:7}}>

                                {task.completed === false ? (
                                    <span>{task.title}</span>

                                  ) : (

                                    <strike>{task.title}</strike>
                                  )}

                            </div>
                            <div style={{flex:1}}>
                                <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                            </div>

                            <div style={{flex:1}}>
                                <button onClick={() => self.deleteItem(task.id)} className="btn btn-sm btn-outline-dark delete">-</button>
                            </div>

                          </div>
                        )
                    })}
              </div>
              :<div  id="list-wrapper"><div id="errorDisplay">no data</div></div>
            }

          </div>

        </div>
      )
  }
}



export default Todo;
