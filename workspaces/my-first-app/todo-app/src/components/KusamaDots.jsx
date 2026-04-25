const BLOBS = [
  { cx: '3%',  cy: '6%',  rx: 52, ry: 44 },
  { cx: '22%', cy: '2%',  rx: 26, ry: 20 },
  { cx: '45%', cy: '1%',  rx: 42, ry: 36 },
  { cx: '70%', cy: '4%',  rx: 30, ry: 26 },
  { cx: '90%', cy: '2%',  rx: 46, ry: 38 },
  { cx: '97%', cy: '18%', rx: 28, ry: 34 },
  { cx: '1%',  cy: '30%', rx: 36, ry: 30 },
  { cx: '99%', cy: '42%', rx: 22, ry: 28 },
  { cx: '2%',  cy: '58%', rx: 42, ry: 34 },
  { cx: '98%', cy: '65%', rx: 34, ry: 26 },
  { cx: '1%',  cy: '80%', rx: 28, ry: 36 },
  { cx: '96%', cy: '82%', rx: 38, ry: 30 },
  { cx: '8%',  cy: '95%', rx: 44, ry: 32 },
  { cx: '30%', cy: '98%', rx: 28, ry: 22 },
  { cx: '55%', cy: '97%', rx: 48, ry: 38 },
  { cx: '78%', cy: '96%', rx: 30, ry: 24 },
  { cx: '94%', cy: '94%', rx: 40, ry: 32 },
]

export default function KusamaDots() {
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {BLOBS.map((b, i) => (
        <ellipse
          key={i}
          cx={b.cx} cy={b.cy}
          rx={b.rx} ry={b.ry}
          fill="#0a0f1a"
          opacity="0.5"
        />
      ))}
    </svg>
  )
}
