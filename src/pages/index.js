import G6 from '@antv/g6';
import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import data from './data';
import './registerFlowRect'


export default function() {
  const ref = useRef(null);
  let graph = null;

  /**
   * 创建提示
   * @param position
   * @param name
   * @param id
   */
  const createTooltip = (position, name, id) => {
    const offsetTop = -60;
    const existTooltip = document.getElementById(id);
    const x = position.x + 'px';
    const y = position.y + offsetTop + 'px';
    if (existTooltip) {
      existTooltip.style.left = x;
      existTooltip.style.top = y;
    } else {
      // content
      const tooltip = document.createElement('div');
      const span = document.createElement('span');
      span.textContent = name;
      tooltip.style.padding = '10px';
      tooltip.style.background = 'rgba(0,0,0, 0.65)';
      tooltip.style.color = '#fff';
      tooltip.style.borderRadius = '4px';
      tooltip.appendChild(span);
      // box
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.zIndex = '99';
      div.id = id;
      div.style.left = x;
      div.style.top = y;
      div.appendChild(tooltip);
      document.body.appendChild(div);
    }
  };
  /**
   * 删除提示
   * @param id
   */
  const removeTooltip = id => {
    const removeNode = document.getElementById(id);
    if (removeNode) {
      document.body.removeChild(removeNode);
    }
  };

  const bindEvents = () => {
    graph.on('node:mousemove', evt => {
      debugger;
      const { item, target, x, y } = evt;
      const {
        attrs: { isNodeShape },
      } = target;
      const model = item.getModel();
      const { name, id } = model;
      if (isNodeShape) {
        const position = graph.getClientByPoint(x, y);
        createTooltip(position, name, id);
      } else {
        removeTooltip(id);
      }
    });

    graph.on('node:mouseout', evt => {
      const { item, target } = evt;
      const {
        attrs: { isNodeShape },
      } = target;
      const model = item.getModel();
      const { id } = model;
      if (isNodeShape) {
        removeTooltip(id);
      }
    });

    graph.on('node:mouseleave', evt => {
      const node = evt.item;
      graph.setItemState(node, 'hover', false);
      graph.updateItem(node, {
        style: {
          ...node._cfg.originStyle,
          shadowColor: 'transparent',
          shadowBlur: 0,
        },
      });
    });
  }


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
      graph.fitView();

      bindEvents();
    }



  }, [])

  return (
    <div className={styles.container}>
      <div id="chart" className={styles.chart} ref={ref}>

      </div>
    </div>
  );
}
