import React from 'react';
import './App.scss';
import DrawField from './components/drawField/drawField';

class App extends React.Component {
  state = {
    gameField: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],

    firstMove: true,
    arrow: '',
    score: 0,
    overGame: false,
  }

  componentDidMount() {
    document.documentElement.addEventListener('keydown', (e) => {
      let path = ''
      if (e.key === 'ArrowRight') {
        path = 'right'
      } else if (e.key === 'ArrowLeft') {
        path = 'left'
      } else if (e.key === 'ArrowUp') {
        path = 'up'
      } else if (e.key === 'ArrowDown') {
        path = 'down'
      }

      this.setState(({ arrow: path }));
    });
  }

  checkForOverGame = () => {
    this.setState({ overGame: false });
    const { gameField } = this.state;
    for (let i = 0; i < gameField; i++) {
      for (let j = 0; j < gameField[i]; j++) {
        if (gameField[i][j] === 0) {
          return;
        }
      }
    }

    const moveDown = this.canMoveDown(true);

    if (moveDown) {
      return;
    }

    const moveUp = this.canMoveUp(true);

    if (moveUp) {
      return;
    }

    const moveLeft = this.canMoveLeft(true);

    if (moveLeft) {
      return;
    }

    const moveRight = this.canMoveRight(true);

    if (moveRight) {
      return;
    }

    this.setState({ overGame: true });
  }

  newItemPosition = () => {
    this.setState(({ firstMove: false }));
    let randomCell = {
      x: +(Math.random() * (3 - 0) + 0).toFixed(0),
      y: +(Math.random() * (3 - 0) + 0).toFixed(0),
    }

    if (this.state.gameField[randomCell.x][randomCell.y] === 0) {
      this.newItem(randomCell.x, randomCell.y);
    } else {
      this.newItemPosition();
    }
    this.checkForOverGame();
  }

  newItem = (x, y) => {
    const probability = [2, 4, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 8, 2];
    const probIdx = (Math.random() * (14 - 0) + 0).toFixed(0);
    const newField = [...this.state.gameField];
    newField[x][y] = probability[probIdx];
    this.setState(() => ({ gameField: newField }));

    this.checkForOverGame();
  }

  canMoveRight = (check) => {
    const { gameField } = this.state;
    let canMove = false;

    for (let i = 0; i < gameField.length; i++) {
      for (let j = 0; j < gameField[i].length; j++) {
        if (gameField[i][j] !== 0) {
          for (let z = j + 1; z < gameField[i].length; z++) {
            if (gameField[i][z] === 0) {
              canMove = true;
              break;
            }
          }
        }
      }
    }

    for (let i = 0; i < gameField.length; i++) {
      for (let j = gameField[i].length; j >= 0; j--) {
        if (j - 1 >= 0
          && gameField[i][j] !== 0
          && gameField[i][j] === gameField[i][j - 1]) {
          canMove = true;
          break;
        }
      }
    }

    if (check) {
      console.log('can move right', canMove);
      return canMove;
    } else if (canMove && !check) {
      this.rightDirection();
    }
  }

  rightDirection = () => {
    const { gameField } = this.state;
    const currentField = [];
    const updateField = [];

    for (let i = 0; i < gameField.length; i++) {
      let row = []
      for (let j = 0; j < gameField[i].length; j++) {
        if (gameField[i][j] === 0) {
          row.unshift(gameField[i][j])
        } else {
          row.push(gameField[i][j])
        }
      }
      updateField.push(row)
    }

    for (let i = 0; i < updateField.length; i++) {
      let row = [];
      let rowCounter = 3
      const length = updateField[i].length - 1
      for (let j = length; j >= 0; j--) {
        if (j - 1 >= 0 && updateField[i][j] === updateField[i][j - 1]) {
          const double = updateField[i][j] * 2;
          this.setState(state => ({ score: state.score + double }));
          row[rowCounter] = double;
          j--;
          rowCounter--;
          continue;
        }
        row[rowCounter] = updateField[i][j]
        rowCounter--
      }

      for (let z = 0; z < row.length; z++) {
        if (!row[z]) {
          row[z] = 0
        }
      }
      currentField.push(row)
    }

    this.setState(() => ({ gameField: currentField, arrow: '' }), () => this.newItemPosition());
  }

  canMoveLeft = (check) => {
    const { gameField } = this.state;
    let x = null;
    let y = null;
    let canMove = false
    for (let i = 0; i < gameField.length; i++) {
      for (let j = gameField[i].length - 1; j >= 0; j--) {
        if (gameField[i][j] !== 0) {
          x = i;
          y = j;
          break;
        }
      }

      if (typeof x === 'number' && typeof y === 'number') {
        for (let z = y - 1; z >= 0; z--) {
          if (gameField[x][z] === 0) {
            canMove = true;
          }
        }
      }
    }

    for (let i = 0; i < gameField.length; i++) {
      for (let j = 0; j < gameField[i].length; j++) {
        if (j + 1 < gameField.length
          && gameField[i][j] !== 0
          && gameField[i][j] === gameField[i][j + 1]) {
          canMove = true;
        }
      }
    }

    if (check) {
      return canMove;
    } else if (canMove && !check) {
      this.leftDirection();
    }
  }

  leftDirection = () => {
    const { gameField } = this.state;
    const currentField = [];
    const updateField = [];

    for (let i = 0; i < gameField.length; i++) {
      let row = []
      for (let j = gameField[i].length - 1; j >= 0; j--) {
        if (gameField[i][j] === 0) {
          row.push(gameField[i][j])
        } else {
          row.unshift(gameField[i][j])
        }
      }
      updateField.push(row)
    }

    for (let i = 0; i < updateField.length; i++) {
      let row = [];
      let rowCounter = 0
      for (let j = 0; j < updateField[i].length; j++) {
        if (j + 1 < updateField[i].length
          && updateField[i][j] === updateField[i][j + 1]) {
          const double = updateField[i][j] * 2;
          this.setState(state => ({ score: state.score + double }));
          row[rowCounter] = double;
          j++;
          rowCounter++;
          continue;
        }
        row[rowCounter] = updateField[i][j]
        rowCounter++
      }
      for (let z = 0; z < 4; z++) {
        if (!row[z]) {
          row[z] = 0
        }
      }
      currentField.push(row)
    }
    this.setState(() => ({ gameField: currentField, arrow: '' }), () => this.newItemPosition());
  }

  canMoveUp = (check) => {
    const { gameField } = this.state;
    let canMove = false;

    for (let i = gameField.length - 1; i >= 0; i--) {
      for (let j = 0; j < gameField[i].length; j++) {
        if (gameField[i][j] !== 0) {
          for (let z = i; z >= 0; z--) {
            if (gameField[z][j] === 0) {
              canMove = true;
            }
          }
        }
      }
    }

    for (let i = gameField.length - 1; i >= 0; i--) {
      for (let j = 0; j < gameField[i].length; j++) {
        if (i - 1 >= 0
          && gameField[i][j] !== 0
          && gameField[i][j] === gameField[i - 1][j]) {
          canMove = true;
        }
      }
    }

    if (check) {
      return canMove;
    } else if (canMove && !check) {
      this.upDirection();
    }
  }

  upDirection = () => {
    const { gameField } = this.state;
    const currentField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const updateField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    let counterUp = 0;
    for (let i = 0; i < gameField.length; i++) {
      for (let j = 0; j < gameField[i].length; j++) {
        let upperPosition = false;
        if (gameField[i][j] !== 0) {

          while (!upperPosition) {
            if (currentField[counterUp][j] === 0) {
              currentField[counterUp][j] = gameField[i][j];
              counterUp = 0;
              upperPosition = true;
            } else {
              counterUp++;
            }
          }
        }
      }
    }
    let j = 0;

    while (j <= 3) {
      for (let i = 0; i < currentField.length; i++) {
        if (i + 1 < currentField.length
          && currentField[i][j] === currentField[i + 1][j]
          && currentField[i][j]) {
          const double = currentField[i][j] * 2;
          this.setState(state => ({ score: state.score + double }));
          i++;
          let upperPosition = false;
          let rowCounter = 0;
          while (!upperPosition) {
            if (updateField[rowCounter][j] === 0) {
              updateField[rowCounter][j] = double;
              upperPosition = true;
            } else {
              rowCounter++;
            }
          }
          continue;
        }

        if (currentField[i][j] !== 0) {
          let upperPosition = false;
          let rowCounter = 0;
          while (!upperPosition) {
            if (updateField[rowCounter][j] === 0) {
              updateField[rowCounter][j] = currentField[i][j];
              upperPosition = true;
            } else {
              rowCounter++;
            }
          }
        }
      }
      j++;
    }

    this.setState(() => ({ gameField: updateField, arrow: '' }),
      () => this.newItemPosition());
  }

  canMoveDown = (check) => {
    const { gameField } = this.state;
    let canMove = false;
    for (let i = 0; i < gameField.length; i++) {
      for (let j = 0; j < gameField[i].length; j++) {
        if (gameField[i][j] !== 0) {
          for (let z = i; z < gameField.length; z++) {
            if (gameField[z][j] === 0) {
              canMove = true;
            }
          }
        }
      }
    }

    for (let i = 0; i < gameField.length; i++) {
      for (let j = 0; j < gameField[i].length; j++) {
        if (i + 1 < gameField.length
          && gameField[i][j] !== 0
          && gameField[i][j] === gameField[i + 1][j]) {
          canMove = true
        }
      }
    }

    if (check) {
      return canMove;
    } else if (canMove && !check) {
      this.downDirection();
    }
  }

  downDirection = () => {
    const { gameField } = this.state;
    const currentField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const updateField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    let counterDown = 3;
    for (let i = gameField.length - 1; i >= 0; i--) {
      for (let j = 0; j < gameField[i].length; j++) {
        let downPosition = false;
        if (gameField[i][j] !== 0) {
          while (!downPosition) {
            if (currentField[counterDown][j] === 0) {
              currentField[counterDown][j] = gameField[i][j]
              counterDown = 3;
              downPosition = true;
            } else {
              counterDown--;
            }
          }
        }
      }
    }

    let j = 0;

    while (j <= 3) {
      for (let i = currentField.length - 1; i >= 0; i--) {
        if (i - 1 >= 0
          && currentField[i][j] === currentField[i - 1][j]
          && currentField[i][j]) {
          const double = currentField[i][j] * 2;
          this.setState(state => ({ score: state.score + double }));
          i--;
          let downPosition = false;
          let rowCounter = 3;
          while (!downPosition) {
            if (updateField[rowCounter][j] === 0) {
              updateField[rowCounter][j] = double;
              downPosition = true;
            } else {
              rowCounter--;
            }
          }
          continue;
        }

        if (currentField[i][j] !== 0) {
          let downPosition = false;
          let rowCounter = 3;
          while (!downPosition) {
            if (updateField[rowCounter][j] === 0) {
              updateField[rowCounter][j] = currentField[i][j];
              downPosition = true;
            } else {
              rowCounter--;
            }
          }
        }
      }
      j++;
    }

    this.setState(() => ({ gameField: updateField, arrow: '' }),
      () => this.newItemPosition());
  }

  chooseDirection = (arrow) => {
    switch (arrow) {
      case 'right':
        this.canMoveRight()
        break;

      case 'left':
        this.canMoveLeft()
        break;

      case 'up':
        this.canMoveUp()
        break;

      case 'down':
        this.canMoveDown()
        break;

      default:
        break;
    }
  }

  reset = () => {
    this.setState(() => ({
      gameField: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],

      firstMove: true,
      arrow: '',
      score: 0,
      overGame: false,
    }))
  }

  render() {
    const { gameField, firstMove, arrow, score, overGame } = this.state
    if (firstMove) {
      this.newItemPosition();
    }

    if (arrow && !overGame) {
      this.chooseDirection(arrow);
    }

    console.log('overgame', overGame);

    return (
      <>
        <div className="container">
          <button
            onClick={this.reset}
            type="button"
            className="newGame"
          >
            New Game
        </button>
          <h1 className="score">Score <br />
            <span className="currentScore">
              {score}
            </span>
          </h1>
        </div>

        <div
          className="field"
          style={overGame ? { zIndex: "-2" } : { zIndex: "0" }}
        >
          <DrawField
            gameField={gameField}
          />
        </div>
        <div
          className="gameOverDiv"
          style={overGame
            ? { zIndex: "2", display: "block" }
            : { zIndex: "-2", display: "none" }}
        >
          <p className="gameOverText">Game over!</p>
          <p className="gameOverScore">Your score: {score}</p>
          <p className="hint">Click 'New Game' for start ↑</p>
        </div>
      </>
    );
  }
}

export default App;
