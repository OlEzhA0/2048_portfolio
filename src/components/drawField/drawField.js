import React from 'react';

class DrawField extends React.PureComponent {
  render() {
    const { gameField } = this.props;

    return (
      gameField.map(row => row.map((cell, i) => {
        return (
          <div
            className={cell === 0
              ? 'cell'
              : `cell__${parseFloat(cell)} cell`}
            key={i}
          >
            {cell === 0 ? '' : parseFloat(cell)}
          </div>
        )
      })
      )
    )
  }
}


export default DrawField;