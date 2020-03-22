import G6 from '@antv/g6';
import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import data from './data';
import './registerFlowRect'
import './registerPolyline'
import NodeTooltip from './components/NodeTooltip';


export default function() {
  const ref = useRef(null);
  let graph = null;

  // 节点tooltip坐标
  const [showNodeTooltip, setShowNodeTooltip] = useState(false);
  const [nodeTooltipText, setNodeTooltipText] = useState(0);
  const [nodeTooltipX, setNodeToolTipX] = useState(0);
  const [nodeTooltipY, setNodeToolTipY] = useState(0);

  const bindEvents = () => {
    graph.on('node:mouseenter', (evt) => {
      const { item } = evt
      const model = item.getModel()
      const { x, y, name } = model
      const point = graph.getCanvasByPoint(x, y)

      const edges = item.getEdges();
      edges.forEach(edge => graph.setItemState(edge, 'running', true));

      setNodeTooltipText(name)
      setNodeToolTipX(point.x + 31)
      setNodeToolTipY(point.y + 32)
      setShowNodeTooltip(true)
    });

    graph.on('node:mouseleave', evt => {
      const { item } = evt
      const edges = item.getEdges();
      edges.forEach(edge => graph.setItemState(edge, 'running', false));
      setShowNodeTooltip(false)
    });

    // 响应 hover 状态
    // graph.on('node:mouseenter', ev => {
    //   const node = ev.item;
    //   const edges = node.getEdges();
    //   edges.forEach(edge => graph.setItemState(edge, 'running', true));
    // });
    // graph.on('node:mouseleave', ev => {
    //   const node = ev.item;
    //   const edges = node.getEdges();
    //   edges.forEach(edge => graph.setItemState(edge, 'running', false));
    // });
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
          },
          // linkPoints: {
          //   top: true,
          //   bottom: true,
          //   left: true,
          //   right: true,
          //   size: 5,
          //   fill: '#fff',
          // },
        },
        defaultEdge: {
          shape: 'polyline'
        },
        layout: {
          type: 'mindmap',
          direction: 'H',
          getHeight: () => 20,
          getWidth: () => 50,
          getVGap: () => 12,
          getHGap: (d) => {
            if (d.nodeType && d.nodeType === 'root') {
              return 180
            }
            return 140
          },
          getSide: d => {
            if (d.data.nodeType === 'gd-node') {
              return 'left';
            }
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
      // graph.fitView();

      bindEvents();
    }



  }, [])

  return (
    <div className={styles.container}>

      <div className={styles.studio}>
        <div className={styles.top}>
          这是按钮区
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>左边</div>
          <div className={styles.bottomRight}>
            <div id="chart" className={styles.chart} ref={ref}>
              { showNodeTooltip && <NodeTooltip name={nodeTooltipText} x={nodeTooltipX} y={nodeTooltipY} /> }
            </div>
          </div>
        </div>
      </div>




    </div>
  );
}
