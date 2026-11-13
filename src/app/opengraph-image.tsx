import { ImageResponse } from 'next/og';

export const alt = 'Manav Shaji — Frontend & Full-Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          color: '#ededed',
          display: 'flex',
          flexDirection: 'column',
          height: 566,
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            height: '100%',
            left: 32,
            position: 'absolute',
            top: 32,
            width: 1136,
          }}
        />
        <div
          style={{
            color: '#7ef0c0',
            display: 'flex',
            fontFamily: 'monospace',
            fontSize: 22,
            letterSpacing: '0.16em',
            marginBottom: 24,
            textTransform: 'uppercase',
          }}
        >
          Portfolio
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: '-0.06em',
            lineHeight: 1,
          }}
        >
          Manav&nbsp;<span style={{ color: '#7ef0c0' }}>Shaji</span>
        </div>
        <div
          style={{
            color: '#a1a1aa',
            display: 'flex',
            fontSize: 30,
            letterSpacing: '0.01em',
            marginTop: 28,
          }}
        >
          Frontend &amp; Full-Stack Developer
        </div>
        <div
          style={{
            background: '#7ef0c0',
            borderRadius: '50%',
            bottom: 76,
            height: 12,
            position: 'absolute',
            right: 80,
            width: 12,
          }}
        />
      </div>
    ),
    size,
  );
}
