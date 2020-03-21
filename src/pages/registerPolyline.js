import G6 from '@antv/g6';
import colors from './colors';

// lineDash 的差值，可以在后面提供 util 方法自动计算
const dashArrayReverse = [
  [4, 2, 1, 2],
  [3, 2, 1, 2],
  [2, 2, 1, 2],
  [1, 2, 1, 2],
  [0, 2, 1, 2],
  [0, 1, 1, 2],
  [1, 2],
  [0, 2],
  [0, 1],
];

const dashArray = [
  [0, 1],
  [0, 2],
  [1, 2],
  [0, 1, 1, 2],
  [0, 2, 1, 2],
  [1, 2, 1, 2],
  [2, 2, 1, 2],
  [3, 2, 1, 2],
  [4, 2, 1, 2],
];
const lineDash = [4, 2, 1, 2];
const interval = 9;

G6.registerEdge('polyline', {
  itemType: 'edge',
  draw: function draw(cfg, group) {
    const { target } = cfg;
    const targetModel = target.getModel();

    const { tzbl, nodeType, name } = targetModel;

    if (name === '中国1111）公司（左边）' || name === '右边异常节点2') {
      // debugger;
    }

    let strokeColor = colors.upstream.stroke;
    if (nodeType === 'gd-node') {
      strokeColor = colors.upstream.stroke;
    } else if (nodeType === 'tz-node') {
      strokeColor = colors.downstream.stroke;
    }

    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;

    const Ydiff = endPoint.y - startPoint.y;

    const slope = Ydiff !== 0 ? 500 / Math.abs(Ydiff) : 0;

    const cpOffset = 16;
    const offset = Ydiff < 0 ? cpOffset : -cpOffset;

    let line1EndPoint = {};
    let line2StartPoint = {};
    if (endPoint.x >= startPoint.x) {
      line1EndPoint = {
        x: startPoint.x + slope,
        y: endPoint.y + offset
      };
      line2StartPoint = {
        x: line1EndPoint.x + cpOffset,
        y: endPoint.y
      };
    } else {
      line1EndPoint = {
        x: startPoint.x - slope,
        y: endPoint.y + offset
      };
      line2StartPoint = {
        x: line1EndPoint.x - cpOffset,
        y: endPoint.y
      };
    }



    // 控制点坐标
    const controlPoint = {
      x:
        ((line1EndPoint.x - startPoint.x) * (endPoint.y - startPoint.y)) /
        (line1EndPoint.y - startPoint.y) +
        startPoint.x,
      y: endPoint.y
    };

    let path = [
      ['M', startPoint.x, startPoint.y],
      // ['L', line1EndPoint.x, line1EndPoint.y],
      ['L', line2StartPoint.x, line2StartPoint.y],
      // [
      //   'Q',
      //   controlPoint.x,
      //   controlPoint.y,
      //   line2StartPoint.x,
      //   line2StartPoint.y
      // ],
      ['L', endPoint.x, endPoint.y]
    ];

    if (Ydiff === 0) {
      path = [
        ['M', startPoint.x, startPoint.y],
        ['L', endPoint.x, endPoint.y]
      ];
    }

    const line = group.addShape('path', {
      attrs: {
        path,
        stroke: strokeColor,
        lineWidth: 1.2,
        endArrow: false
      }
    });



    // const labelLeftOffset = 8;
    const labelTopOffset = 8;

    let textX = endPoint.x - 120;
    if ((endPoint.x - startPoint.x) < 0) {
      textX = endPoint.x + 40;
    }

    group.addShape('text', {
      attrs: {
        text: `投资比例: ${tzbl ? (tzbl * 100).toFixed(2) : '--'}%`,
        x: textX,
        y: endPoint.y - labelTopOffset - 2,
        fontSize: 11,
        textAlign: 'left',
        textBaseline: 'middle',
        fill: '#000000D9'
      }
    });


    // const path = 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
    let arrowX = endPoint.x - 25;
    if (endPoint.x < startPoint.x) {
      arrowX += 50;
    }
    if (nodeType === 'tz-node') {
      arrowX += 12
    }
    const arrowY = endPoint.y;

    const leftArrow = [
      ['M', arrowX, arrowY],
      ['L', arrowX + 12, arrowY - 6],
      ['L', arrowX + 9, arrowY],
      ['L', arrowX + 12, arrowY + 6],
      ['L', arrowX, arrowY],
    ];
    const rightArrow = [
      ['M', arrowX, arrowY],
      ['L', arrowX - 12, arrowY - 6],
      ['L', arrowX - 9, arrowY],
      ['L', arrowX - 12, arrowY + 6],
      ['L', arrowX, arrowY],
    ];

    if (nodeType === 'gd-node' && endPoint.x >= startPoint.x) {
      group.addShape('path', {
        attrs: {
          path: leftArrow,
          fill: strokeColor,
          lineWidth: 1.2,
          endArrow: false
        }
      });
    } else if (nodeType === 'gd-node' && endPoint.x < startPoint.x) {
      group.addShape('path', {
        attrs: {
          path: rightArrow,
          fill: strokeColor,
          lineWidth: 1.2,
          endArrow: false
        }
      });
    } else if (nodeType === 'tz-node') {
      group.addShape('path', {
        attrs: {
          path: rightArrow,
          fill: strokeColor,
          lineWidth: 1.2,
          endArrow: false
        }
      });
    }

    return line;
  },
  setState(name, value, item) {
    const shape = item.get('keyShape');
    if (name === 'running') {
      if (value) {
        const length = shape.getTotalLength(); // 后续 G 增加 totalLength 的接口
        let totalArray = [];
        for (let i = 0; i < length; i += interval) {
          totalArray = totalArray.concat(lineDash);
        }
        let index = 0;
        shape.animate(
          () => {
            const cfg = {
              lineDash: dashArray[index].concat(totalArray),
            };
            index = (index + 1) % interval;
            return cfg;
          },
          {
            repeat: true,
            duration: 6000,
          },
        );
      } else {
        shape.stopAnimate();
        shape.attr('lineDash', null);
      }
    }
  },
});
