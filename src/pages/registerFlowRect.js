import G6 from '@antv/g6';
import colors from './colors';

G6.registerNode(
  'flow-rect', {
    shapeType: 'flow-rect',
    draw(cfg, group) {
      const {
        name = '',
        nodeType,
        style: {
          width = 170,
        }
      } = cfg;

      let rectConfig = {
        width,
        height: 30,
        radius: 15,
        stroke: '#000',
        fill: '#fff',
        lineWidth: 0.6,
        fontSize: 12,
        opacity: 1,
        isNodeShape: true,
        cursor: 'pointer',
      };

      // 根据节点类型设置节点颜色
      if (nodeType === 'root') {
        rectConfig = {
          ...rectConfig,
          width: 250,
          height: 50,
          fill: '#ffab2a',
          stroke: '#ffab2a',
          radius: 8,
          fontSize: 12,
        }
      } else if (nodeType === 'gd-node') {
        rectConfig = {
          ...rectConfig,
          fill: colors.upstream.fill,
          stroke: colors.upstream.stroke,
        }
      } else if (nodeType === 'tz-node') {
        rectConfig = {
          ...rectConfig,
          fill: colors.downstream.fill,
          stroke: colors.downstream.stroke,
        }
      }

      const rect = group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          ...rectConfig,
        },
      });

      let textConfig = {
        textAlign: 'center',
        textBaseline: 'bottom',
        x: 85,
        y: 24,
        text: name.length > 10 ? `${name.substr(0, 10)  }...` : name,
        fontSize: 14,
        fill: '#000',
        cursor: 'pointer',
        isNodeShape: true,
      };

      if (nodeType === 'root') {
        textConfig = {
          ...textConfig,
          fontSize: 20,
          x: 125,
          y: 35,
          fill: '#fff'
        }

      } else if (nodeType === 'gd-node') {
        textConfig = {
          ...textConfig,
          fill: colors.upstream.stroke
        }
      } else if (nodeType === 'tz-node') {
        textConfig = {
          ...textConfig,
          fill: colors.downstream.stroke
        }
      }

      group.addShape('text', {
        attrs: {
          ...textConfig,
        },
      });


      // 添加锚点
      let pointColor = colors.upstream.stroke;
      let pointY = 15;
      let nodeWidth = width;
      if (nodeType === 'root') {
        pointColor = '#ffab2a';
        pointY = 25;
        nodeWidth = 250;
      } else if (nodeType === 'gd-node') {
        pointColor = colors.upstream.stroke;
      } else if (nodeType === 'tz-node') {
        pointColor = colors.downstream.stroke;
      }

      if (nodeType === 'root') {
        group.addShape('circle', {
          attrs: {
            x: 0,
            y: pointY,
            r: 4,
            fill: '#fff',
            stroke: pointColor,
          }
        });
        group.addShape('circle', {
          attrs: {
            x: nodeWidth,
            y: pointY,
            r: 4,
            fill: '#fff',
            stroke: pointColor,
          }
        });
      } else {
        group.addShape('circle', {
          attrs: {
            x: 0,
            y: pointY,
            r: 3,
            fill: pointColor
          }
        });
        group.addShape('circle', {
          attrs: {
            x: nodeWidth,
            y: pointY,
            r: 3,
            fill: pointColor
          }
        });
      }

      this.drawLinkPoints(cfg, group);
      return rect;
    },
    update(cfg, item) {
      const group = item.getContainer();
      this.updateLinkPoints(cfg, group);
    },
    setState(name, value, item) {
      if (name === 'click' && value) {
        const group = item.getContainer();
        const {
          collapsed
        } = item.getModel();
        const [, , , , , , CircleShape, TextShape] = group.get('children');
        if (TextShape) {
          const {
            attrs: {
              stroke
            },
          } = CircleShape;
          if (!collapsed) {
            TextShape.attr({
              text: '-',
              fill: stroke,
            });
            CircleShape.attr({
              fill: '#fff',
            });
          } else {
            TextShape.attr({
              text: '+',
              fill: '#fff',
            });
            CircleShape.attr({
              fill: stroke,
            });
          }
        }
      }
    },
    getAnchorPoints: function getAnchorPoints() {
      return [[0, 0.5], [1, 0.5]];
    },
  },
  // 注意这里继承了 'single-shape'
  'rect',
);
