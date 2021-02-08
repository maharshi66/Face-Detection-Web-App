import './App.css';
import React, {Component} from 'react'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Rank from './components/Rank/Rank'
import 'tachyons'
import Particles from 'react-particles-js'
import Clarifai from 'clarifai'

const app = new Clarifai.App({
 apiKey: '5f7b23d0cd6847f9b3665f83a334a126'
});

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
      imgUrl: ''
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imgUrl: this.state.input});
    console.log('click');
    app.models.predict(Clarifai.FACE_DETECT_MODEL, "https://samples.clarifai.com/face-det.jpg")
    .then(
        function(response){
          console.log(response);
        }, 
        function(err){

        }
    );
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange}  onSubmit={this.onSubmit} />
        <FaceRecognition imgUrl={this.state.imgUrl} />
      </div>
    );
  }
}

export default App;