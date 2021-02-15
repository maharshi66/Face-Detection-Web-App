import './App.css';
import React, {Component} from 'react'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Rank from './components/Rank/Rank'
import 'tachyons'
import Particles from 'react-particles-js'
// import Clarifai from 'clarifai' (Moved to backend for API security)

const particleOptions = {
    particles: {
      line_linked: {
        shadow: {
          enable: true,
          color: "#3CA9D1",
          blur: 5
        }
      }
    }
}

class App extends Component{

  constructor() {
    super();
    this.state = {
      input: '',
      imgUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    } 
  }

  loadUser = (data) => {
    this.setState({user: {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
        }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = ((box) => {
    console.log(box);
    this.setState({box: box});
  });

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imgUrl: this.state.input});
    
    fetch('http://localhost:3000/imageUrl', {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            "input": this.state.input 
          }),
    })
    .then(response => response.json())
    .then(response => {
      if(response){
          fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            "id": this.state.user.id 
          }),
        }) 
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}));
          console.log(count);
        })
        .catch(console.log);
    }
    this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log);
}

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, route, box, imgUrl} = this.state;
    return (
      <div className="App">
        <Particles 
          className="particles"
           params={particleOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
          ? <div>
              <Logo /> 
              <Rank entries={this.state.user.entries} name={this.state.user.name}/>
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
              <FaceRecognition box={box} imgUrl={imgUrl} />
            </div>
          : (route === 'signin') 
            ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>  
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        }
      </div>
    );
  }
}
export default App;