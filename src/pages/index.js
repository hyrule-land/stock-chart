import G6 from '@antv/g6';
import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import data from './data';
import './registerFlowRect'


export default function() {
  const ref = useRef(null);
  let graph = null;


  useEffect(() => {
    const containerDom = ref.current;

    if(!graph) {
      graph = new G6.TreeGraph({
        container: containerDom,
        width: containerDom.offsetWidth,
        height: containerDom.offsetHeight,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
                const data = item.get('model').data;
                data.collapsed = collapsed;
                return true;
              },
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
          shape: 'flow-rect',
          style: {
            stroke: '#72CC4A',
            width: 170
          }
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            stroke: '#A3B1BF',
          },
        },
        layout: {
          type: 'mindmap',
          direction: 'H',
          getHeight: () => 20,
          getWidth: () => 50,
          getVGap: () => 12,
          getHGap: () => 150,
          getSide: d => {
            // if (d.data.nodeType === 'gd-node') {
            //   return 'left';
            // }
            return 'right';
          },
        },
      });

      graph.node((node) => {
        return {
          label: node.name,
          type: 'flow-rect',
          labelCfg: {
            position: 'center'
          },
        };
      });

      graph.data(data);
      graph.render();
      graph.fitView()
    }



  }, [])

  return (
    <div className={styles.container}>
      <div id="chart" className={styles.chart} ref={ref}>

      </div>
    </div>
  );
}
