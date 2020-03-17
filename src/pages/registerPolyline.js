import G6 from '@antv/g6';
import colors from './colors';

G6.registerEdge('polyline', {
  itemType: 'edge',
  draw: function draw(cfg, group) {
    debugger;
    const { target } = cfg;
    const targetModel = target.getModel();

    const { tzbl, nodeType } = targetModel;
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

    const line1EndPoint = {
      x: startPoint.x + slope,
      y: endPoint.y + offset
    };
    const line2StartPoint = {
      x: line1EndPoint.x + cpOffset,
      y: endPoint.y
    };

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
      ['L', line1EndPoint.x, line1EndPoint.y],
      [
        'Q',
        controlPoint.x,
        controlPoint.y,
        line2StartPoint.x,
        line2StartPoint.y
      ],
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

    const labelLeftOffset = 8;
    const labelTopOffset = 8;
    // amount
    group.addShape('text', {
      attrs: {
        text: `投资比例: ${tzbl ? (tzbl * 100).toFixed(2) : '--'}%`,
        x: line2StartPoint.x + labelLeftOffset,
        y: endPoint.y - labelTopOffset - 2,
        fontSize: 11,
        textAlign: 'left',
        textBaseline: 'middle',
        fill: '#000000D9'
      }
    });
    return line;
  }
});
