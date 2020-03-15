import React from 'react'
import styles from './NodeTooltip.less'
const NodeToolTips = (props) => {
  debugger;
  const { name, x, y } = props;
  debugger;

  return (
    <div className={styles.nodeTooltips} style={{ top: `${y}px`, left: `${x}px`}}>
      <span>{name}</span>
    </div>
  )
}

export default NodeToolTips
