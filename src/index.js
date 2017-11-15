import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className={"square " + props.clase} 
      onClick={props.onClick}
    ></button>
  );
}
function Boton(props) {
  return (
    <button 
      className={props.clase} 
      onClick={props.onClick}
    >{props.value}</button>
  );
}

class Board extends React.Component {
  renderSquare(f, c) {
    return <Square key={f.toString() + "." + c.toString()}
      clase = {this.props.estado[f][c] ? "fillSquare" : "emptySquare"} 
      onClick = {() => this.props.onClick(f, c)}
    />;
  }

  render() {
    return (
      <div>
        <div className="status"></div>
        {[...Array(this.props.filas)].map((y, f) => 
          <div key={"fila" + f} className="board-row">
            {[...Array(this.props.columnas)].map((x, c) => this.renderSquare(f, c))}
          </div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props)
    const n=51;
    var arreglo = new Array(n)
    for (var f = 0; f < n; f++){
      arreglo[f] = new Array(n).fill(false);
    }
    crearExplosion(arreglo, n);
    
    this.state = {
      estado: arreglo,
      isPlaying : false,
      filas: n,
      columnas: n
    }
  }


  handleClick(f, c) {
    var squares = this.state.estado.slice();
    squares[f][c] = !squares[f][c];
    this.setState({
      estado: squares,
    });
  }

  evolve() {
    var squares = this.state.estado.map(function(arr) {
      return arr.slice();
    });
    
    //evita el indexado negativo
    for (var f = 0; f<squares.length; f++){
      squares[f].push(false);
      squares[f].unshift(false);
    }
    squares.push(new Array(squares[0].length).fill(false));
    squares.unshift(new Array(squares[0].length).fill(false));
    
    //compruebo el estado nuevo
    var newState = this.state.estado.map(function(arr) {
      return arr.slice();
    });

    for (f = 1; f < squares.length -1; f++){
      for (var c = 1; c < squares[f].length -1; c++){
        var nb = 0;
        for (var mf = -1; mf < 2; mf++){
          for (var mc = -1; mc < 2;  mc++){
            if (squares[f + mf][c + mc]) nb++;
          }
        }
        if (squares[f][c]){
          //se resta a si mismo
          nb--;
          if (nb < 2 || nb > 3) newState[f-1][c-1] = false;
        } else {
          //console.log(f, c, nb);
          if (nb === 3) newState[f-1][c-1] = true;
        }
        //console.log (f, c, nb);
      } 
    }
    this.setState({
      estado: newState
    });
    if (this.state.isPlaying)
      setTimeout(this.evolve.bind(this), 500);
    
  }

  changePlaying() {
    if (!this.state.isPlaying){
      setTimeout(this.evolve.bind(this), 500);
    }
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }

  clearMap(){
    var arreglo = new Array(this.state.filas)
    for (var f = 0; f < this.state.filas; f++){
      arreglo[f] = new Array(this.state.columnas);
    }
  
    this.setState({
      estado: arreglo
    });
  }

  render() {
    return (
      <div>
        <div className="start">
          <Boton 
            className={"play"}
            value= {this.state.isPlaying ? "Stop" : "Start"} 
            onClick={() => this.changePlaying()}
          />
          <Boton 
            className={"play"}
            value= {"Clear"} 
            onClick={() => this.clearMap()}
          />
        </div>
        <div className="game">
          <div className="game-board">
            <Board
              estado= {this.state.estado}
              filas= {this.state.filas}
              columnas= {this.state.columnas}
              onClick= {(f, c) => this.handleClick(f, c)}
            />
          </div>
        </div>
        <div className="params">
          <div className="dims">{/* status */}</div>
          <div className="velocity"></div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function crearExplosion(arreglo, n){
  n = (n-13)/2;
  
  arreglo[n][n+2] = true;
  arreglo[n][n+3] = true;
  arreglo[n][n+4] = true;
  arreglo[n][n+8] = true;
  arreglo[n][n+9] = true;
  arreglo[n][n+10] = true;

  arreglo[n+2][n] = true;
  arreglo[n+2][n+5] = true;
  arreglo[n+2][n+7] = true;
  arreglo[n+2][n+12] = true;
  arreglo[n+3][n] = true;
  arreglo[n+3][n+5] = true;
  arreglo[n+3][n+7] = true;
  arreglo[n+3][n+12] = true;
  arreglo[n+4][n] = true;
  arreglo[n+4][n+5] = true;
  arreglo[n+4][n+7] = true;
  arreglo[n+4][n+12] = true;

  arreglo[n+5][n+2] = true;
  arreglo[n+5][n+3] = true;
  arreglo[n+5][n+4] = true;
  arreglo[n+5][n+8] = true;
  arreglo[n+5][n+9] = true;
  arreglo[n+5][n+10] = true;

  arreglo[n+7][n+2] = true;
  arreglo[n+7][n+3] = true;
  arreglo[n+7][n+4] = true;
  arreglo[n+7][n+8] = true;
  arreglo[n+7][n+9] = true;
  arreglo[n+7][n+10] = true;

  arreglo[n+8][n] = true;
  arreglo[n+8][n+5] = true;
  arreglo[n+8][n+7] = true;
  arreglo[n+8][n+12] = true;
  arreglo[n+9][n] = true;
  arreglo[n+9][n+5] = true;
  arreglo[n+9][n+7] = true;
  arreglo[n+9][n+12] = true;
  arreglo[n+10][n] = true;
  arreglo[n+10][n+5] = true;
  arreglo[n+10][n+7] = true;
  arreglo[n+10][n+12] = true;


  arreglo[n+12][n+2] = true;
  arreglo[n+12][n+3] = true;
  arreglo[n+12][n+4] = true;
  arreglo[n+12][n+8] = true;
  arreglo[n+12][n+9] = true;
  arreglo[n+12][n+10] = true;
}
