import React, { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, ChartDataLabels);

// Draw the 50/50 cross + quadrant titles
const quadrantPlugin = {
  id: "quadrantPlugin",
  afterDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const { left, right, top, bottom } = chartArea;
    // const xMid = scales.x.getPixelForValue(50);
    // const yMid = scales.y.getPixelForValue(50);

    ctx.save();

    // Labels
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.font = "bold 14px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.textAlign = "center";

    ctx.fillText("Bold", (left + right) / 2, top + 16);
    ctx.fillText("Light", (left + right) / 2, bottom - 8);

    ctx.textAlign = "left";
    ctx.fillText("Fruity", left + 6, (top + bottom) / 2 - 10);

    ctx.textAlign = "right";
    ctx.fillText("Earthy", right - 6, (top + bottom) / 2 - 10);

    ctx.restore();
  },
};

ChartJS.register(quadrantPlugin);

// Draw multi-line cluster labels + per-name color markers under each line
const clusterLabelsPlugin = {
  id: "clusterLabelsPlugin",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta || meta.hidden) return;

      const placed = []; // label bounding boxes already drawn (to avoid overlap)

      const intersects = (a, b) => {
        return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
      };

      meta.data.forEach((pointEl, i) => {
        const p = dataset.data[i];
        if (!p) return;

        const px = pointEl.x;
        const py = pointEl.y;

        const items = Array.isArray(p.items) ? p.items : [{ name: p.label, color: p.color }];
        const lines = items.map((it) => it.name);

        // Styling (slightly tighter to reduce collisions)
        const lineHeight = 13;
        const markerRadius = 4;
        const markerGap = 6; // distance from text baseline to marker center
        const padding = 4;    // padding around the label box

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = "600 10.5px system-ui, -apple-system, Segoe UI, Roboto";

        // Measure label block size
        const maxTextWidth = lines.reduce((m, line) => Math.max(m, ctx.measureText(line).width), 0);
        const textBlockHeight = lines.length * lineHeight;

        // We draw a marker under each line; include it in height budget
        const markersExtra = lines.length * (markerGap + markerRadius * 2);
        const blockW = Math.ceil(maxTextWidth + padding * 2);
        const blockH = Math.ceil(textBlockHeight + markersExtra + padding * 2);

        // Candidate positions around the point (dx, dy from point to TOP-LEFT of block)
        const candidates = [
          { dx: -blockW / 2, dy: -(blockH + 10) }, // above
          { dx: 10,         dy: -(blockH + 10) }, // above-right
          { dx: -(blockW + 10), dy: -(blockH + 10) }, // above-left
          { dx: 10,         dy: 10 },              // below-right
          { dx: -blockW / 2, dy: 10 },             // below
          { dx: -(blockW + 10), dy: 10 },          // below-left
          { dx: 10,         dy: -blockH / 2 },     // right
          { dx: -(blockW + 10), dy: -blockH / 2 }, // left
        ];

        const chartArea = chart.chartArea;
        const clamp = (box) => {
          const x1 = Math.max(chartArea.left, Math.min(box.x1, chartArea.right - blockW));
          const y1 = Math.max(chartArea.top, Math.min(box.y1, chartArea.bottom - blockH));
          return { x1, y1, x2: x1 + blockW, y2: y1 + blockH };
        };

        let chosen = null;

        for (const c of candidates) {
          const trial = clamp({
            x1: px + c.dx,
            y1: py + c.dy,
            x2: px + c.dx + blockW,
            y2: py + c.dy + blockH,
          });

          const hit = placed.some((b) => intersects(trial, b));
          if (!hit) {
            chosen = trial;
            break;
          }
        }

        // If everything overlaps, just pick the first (clamped) position
        if (!chosen) {
          chosen = clamp({
            x1: px - blockW / 2,
            y1: py - (blockH + 10),
            x2: px - blockW / 2 + blockW,
            y2: py - (blockH + 10) + blockH,
          });
        }

        placed.push(chosen);

        // Draw (optional subtle white backing for readability)
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillRect(chosen.x1, chosen.y1, blockW, blockH);
        ctx.restore();

        // Draw text + markers inside the chosen box
        const centerX = chosen.x1 + blockW / 2;
        let cursorY = chosen.y1 + padding;

        lines.forEach((line, idx) => {
          // text baseline
          const textY = cursorY + lineHeight;
          ctx.fillStyle = "rgba(0,0,0,0.80)";
          ctx.fillText(line, centerX, textY);

          // marker under the line
          const markerY = textY + markerGap;
          const color = items[idx]?.color || p.color || "#888888";

          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(centerX, markerY, markerRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(0,0,0,0.25)";
          ctx.stroke();

          // advance cursor: text line + marker area
          cursorY += lineHeight + markerGap + markerRadius * 2;
        });

        ctx.restore();
      });
    });
  },
};

ChartJS.register(clusterLabelsPlugin);

// Combine points that are close to each other on BOTH axes
function clusterVarietals(varietals, threshold = 8) {
  const clusters = [];

  Object.entries(varietals).forEach(([name, v]) => {
    const body = Number(v.body);
    const fruity = Number(v.fruity);

    // Skip invalid rows safely
    if (!Number.isFinite(body) || !Number.isFinite(fruity)) return;

    let matched = null;

    for (const c of clusters) {
      const bodyDiff = Math.abs(c.body - body);
      const fruityDiff = Math.abs(c.fruity - fruity);
      if (bodyDiff <= threshold && fruityDiff <= threshold) {
        matched = c;
        break;
      }
    }

    if (matched) {
      matched.items.push({ name, ...v, body, fruity });
      const count = matched.items.length;
      matched.body = Math.round(matched.items.reduce((s, i) => s + i.body, 0) / count);
      matched.fruity = Math.round(matched.items.reduce((s, i) => s + i.fruity, 0) / count);
    } else {
      clusters.push({
        body,
        fruity,
        color: v.color,
        items: [{ name, ...v, body, fruity }],
      });
    }
  });

  return clusters;
}

export default function WineMapChart({ state }) {
    const varietals = state?.varietals;
  // varietals example shape:
  // { "Pinot Noir": { body: 55, fruity: 65, color: "#8A2E3B" }, ... }

  const CLUSTER_THRESHOLD = 8; // 5-10 recommended; tweak as needed

  const points = useMemo(() => {
    if (!varietals) return [];

    const clusters = clusterVarietals(varietals, CLUSTER_THRESHOLD);

    return clusters.map((c) => {
      const items = c.items.map((i) => ({
        name: i.name,
        color: i.color,
      }));

      const names = items.map((i) => i.name);
      return {
        x: c.fruity,
        y: c.body,
        // multi-line label for clustered points
        label: names.join("\n"),
        items,
        count: items.length,
        // keep a fallback color for the point itself
        color: items[0]?.color || c.color || "#888888",
      };
    });
  }, [varietals]);

    if (!varietals || Object.keys(varietals).length === 0) {
        return <div>Loading...</div>;
    }
  const data = {
    datasets: [
      {
        label: "Varietals",
        data: points,
        // Hide cluster points visually, but keep them interactive via hitRadius
        pointRadius: points.map((p) => (p.count > 1 ? 0 : 6)),
        pointHoverRadius: points.map((p) => (p.count > 1 ? 0 : 8)),
        hitRadius: points.map((p) => (p.count > 1 ? 16 : 10)),
        pointBackgroundColor: points.map(p => p.color),
        pointBorderColor: "rgba(0,0,0,0.35)",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
scales: {
    x: {
        min: 0,
        max: 100,
        ticks: { display: false },
        grid: { display: false },
        border: {
        display: true,
        color: "#999",
        width: 1
        },
        position: "center",
        offset: false,
        axis: "x",
        crossAlign: "center"
    },
    y: {
        min: 0,
        max: 100,
        ticks: { display: false },
        grid: { display: false },
        border: {
        display: true,
        color: "#999",
        width: 1
        },
        position: "center",
        offset: false,
        axis: "y",
        crossAlign: "center"
    }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const p = ctx.raw;
            if (p.count > 0) {
              return `Cluster (${p.count}): ${(p.items || []).map(i => i.name).join(" / ")} — Body ${Math.round(p.y)}, Fruity ${Math.round(p.x)}`;
            }
            return `${(p.items?.[0]?.name || p.label)}: Body ${Math.round(p.y)}, Fruity ${Math.round(p.x)}`;
          },
        },
      },
      datalabels: { display: false },
    },
  };

  return (
    <div style={{ height: 700, width: "100%" }}>
      <Scatter data={data} options={options} />
    </div>
  );
}