/*
  Proposal drawings for the two chapters that have no commissioned work yet. Ink line on paper,
  drawn rather than rendered, so they can never be mistaken for a project: crop marks, dashed
  construction lines, no words. They are placeholders for the design owner's own drawings.
*/

type Props = { kind: 'exhibition' | 'occasion'; label: string }

const crop = (x: number, y: number, dx: number, dy: number) => `M${x} ${y + dy * 14}V${y}H${x + dx * 14}`

function CropMarks() {
  return (
    <path
      d={[crop(12, 12, 1, 1), crop(388, 12, -1, 1), crop(12, 488, 1, -1), crop(388, 488, -1, -1)].join(' ')}
      className="draw-faint"
    />
  )
}

function Exhibition() {
  return (
    <>
      <CropMarks />
      {/* the page */}
      <rect x="48" y="52" width="304" height="396" />
      <path d="M48 84H352" className="draw-faint" />
      <path d="M64 68H120M296 68H336" />
      {/* the work */}
      <rect x="64" y="104" width="196" height="248" />
      <path d="M84 300C112 250 132 270 152 214S206 150 238 132" className="draw-faint" />
      <path d="M92 168h64v72H92z M176 236h60v88h-60z" className="draw-hatch" />
      <path d="M48 104H40M48 352H40" className="draw-guide" />
      {/* caption */}
      <path d="M64 372H200M64 386H170M64 400H130" />
      {/* the column of works */}
      <rect x="280" y="104" width="56" height="56" />
      <rect x="280" y="176" width="56" height="72" />
      <rect x="280" y="264" width="56" height="44" />
      <path d="M280 324H336M280 336H320" className="draw-faint" />
      <path d="M270 96V420" className="draw-guide" />
    </>
  )
}

function Occasion() {
  return (
    <>
      <CropMarks />
      {/* the phone */}
      <rect x="120" y="40" width="160" height="420" rx="22" />
      <path d="M182 56H218" />
      {/* title and date */}
      <path d="M140 92H236M140 106H196" />
      <path d="M140 124H260" className="draw-faint" />
      {/* programme: time, then the line it belongs to */}
      <path d="M140 148H160M172 148H256 M140 176H160M172 176H236 M140 204H160M172 204H250 M140 232H160M172 232H226" />
      <path d="M166 140V240" className="draw-guide" />
      {/* the small map and its route */}
      <rect x="140" y="262" width="120" height="96" />
      <path d="M152 344C176 320 186 330 202 300S236 282 248 274" className="draw-guide" />
      <circle cx="248" cy="274" r="4" />
      <circle cx="152" cy="344" r="2.5" />
      {/* the way back to the occasion */}
      <rect x="140" y="378" width="120" height="28" rx="14" />
      <path d="M104 92H72M104 232H72" className="draw-guide" />
      <path d="M72 92V232" className="draw-guide" />
    </>
  )
}

export function Drawing({ kind, label }: Props) {
  // An empty label means the drawing sits inside something that already names it.
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const }
  return (
    <svg className="drawing" viewBox="0 0 400 500" {...a11y}>
      <g fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        {kind === 'exhibition' ? <Exhibition /> : <Occasion />}
      </g>
    </svg>
  )
}
